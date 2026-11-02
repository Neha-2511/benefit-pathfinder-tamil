// Pure data-collection helpers: normalise raw rows, classify TN/central, dedupe and merge without downgrading.
import type { TablesInsert } from "@/integrations/supabase/types";

export type SchemeRow = TablesInsert<"schemes">;
export type RawRow = Record<string, unknown>;

const ARRAY_FIELDS = ["states", "genders", "occupations", "purposes", "education_levels", "communities", "tags", "source_unavailable"] as const;
const TEXT_FIELDS = [
  "name", "name_ta", "level", "category", "summary", "description", "benefits", "eligibility_text", "application_process",
  "official_url", "apply_url", "source_name", "source_url", "department", "deadline", "deadline_note", "last_verified",
  "source_last_updated", "external_id", "status",
] as const;
const NUM_FIELDS = ["min_age", "max_age", "max_income"] as const;

// Fields that make a record "complete" for the collection report.
export const CORE_FIELDS = ["name", "benefits", "eligibility_text", "official_url", "source_url"] as const;

// Header aliases so CSV/Excel/API columns map onto our fields.
const ALIASES: Record<string, string> = {
  scheme_name: "name", title: "name", schemename: "name",
  details: "description", full_description: "description",
  eligibility: "eligibility_text", eligibility_criteria: "eligibility_text",
  application_procedure: "application_process", how_to_apply: "application_process",
  application_url: "apply_url", apply_link: "apply_url",
  official_source_url: "source_url", source: "source_name",
  department_name: "department", ministry: "department", nodal_department: "department",
  scheme_category: "category", state: "states", state_applicability: "states",
  income_limit: "max_income", annual_income_limit: "max_income",
  gender: "genders", caste: "communities", category_eligibility: "communities",
  last_updated: "source_last_updated", id: "external_id", scheme_id: "external_id",
  documents: "documents", required_documents: "documents",
};

const clean = (v: unknown) => (v == null ? "" : String(v).trim());
export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
export const normName = (s: string) => s.toLowerCase().replace(/\(.*?\)/g, "").replace(/[^a-z0-9]/g, "");

function toDate(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}

export function normaliseRow(raw: RawRow, defaults: Partial<SchemeRow> = {}): { row: SchemeRow | null; documents: string[]; error?: string } {
  const r: any = {};
  for (const [k, v] of Object.entries(raw)) {
    const key = k.toLowerCase().trim().replace(/[\s-]+/g, "_");
    r[ALIASES[key] ?? key] = v;
  }
  const name = clean(r.name);
  if (!name) return { row: null, documents: [], error: "Missing scheme name" };
  const out: any = { ...defaults };
  for (const f of TEXT_FIELDS) { const v = clean(r[f]); if (v) out[f] = v; }
  for (const f of NUM_FIELDS) {
    const v = clean(r[f]).replace(/[₹,\s]/g, "");
    if (v && !isNaN(Number(v))) out[f] = Number(v);
  }
  for (const f of ARRAY_FIELDS) {
    const v = r[f];
    const arr = Array.isArray(v) ? v.map(clean) : clean(v).split(/[;|,]/).map((x) => x.trim());
    const vals = arr.filter(Boolean);
    if (vals.length) out[f] = f === "states" ? vals : vals.map((x) => x.toLowerCase());
  }
  for (const f of ["deadline", "last_verified", "source_last_updated"]) if (out[f]) out[f] = toDate(String(out[f]));
  if (r.is_scholarship != null) out.is_scholarship = /^(true|yes|1)$/i.test(clean(r.is_scholarship));
  if (r.is_sample != null) out.is_sample = /^(true|yes|1)$/i.test(clean(r.is_sample));

  // Level/state classification
  const states = (out.states as string[] | undefined) ?? [];
  const lvl = clean(out.level).toLowerCase();
  if (lvl.startsWith("state") || (states.length && !states.some((s) => /all|india|central/i.test(s)))) {
    out.level = "state";
  } else {
    out.level = "central";
    out.states = null;
  }
  if (out.status && !["active", "expired", "discontinued", "needs_verification"].includes(String(out.status))) delete out.status;
  out.name = name;
  out.slug = clean(r.slug) ? slugify(clean(r.slug)) : slugify(name);
  const docs = clean(r.documents).split(/[;|]/).map((x) => x.trim().toLowerCase().replace(/\s+/g, "_")).filter(Boolean);
  return { row: out as SchemeRow, documents: docs };
}

export type Applicability = "tn_state" | "central" | "not_applicable";
export function applicability(row: Pick<SchemeRow, "level" | "states">): Applicability {
  if (row.level === "central") return "central";
  return (row.states ?? []).some((s) => /tamil\s*nadu/i.test(s)) ? "tn_state" : "not_applicable";
}

export function isIncomplete(row: Partial<SchemeRow>, docCount: number) {
  return CORE_FIELDS.some((f) => !clean(row[f])) || docCount === 0;
}

const isEmpty = (v: unknown) => v == null || (typeof v === "string" && !v.trim()) || (Array.isArray(v) && v.length === 0);

/** Field-wise merge: incoming non-empty values update; empty incoming values never erase existing data. */
export function mergeNoDowngrade(existing: any, incoming: any) {
  const patch: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(incoming)) {
    if (k === "id" || k === "slug" || isEmpty(v)) continue;
    // Never let an automated status overwrite an admin's verified status with needs_verification
    if (k === "status" && v === "needs_verification" && existing.status && existing.status !== "needs_verification") continue;
    if (JSON.stringify(existing[k]) !== JSON.stringify(v)) patch[k] = v;
  }
  return patch;
}

export function matchKey(row: { external_id?: string | null; slug?: string | null; name?: string | null }) {
  return { ext: row.external_id ?? null, slug: row.slug ?? null, name: row.name ? normName(row.name) : null };
}
