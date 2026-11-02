import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { applicability, isIncomplete, mergeNoDowngrade, normName, normaliseRow, type RawRow } from "./ingest";

type Input = { source: string; method: string; totalAvailable?: number | null; rows: RawRow[]; defaults?: Record<string, unknown> };

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden");
}

async function ingest(supabase: any, userId: string, input: Input) {
  // Load ALL existing schemes with pagination (the Data API caps a request at 1000 rows).
  const existing: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from("schemes").select("*").range(from, from + 999);
    if (error) throw new Error(error.message);
    existing.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }
  const byExt = new Map(existing.filter((e) => e.external_id).map((e) => [e.external_id, e]));
  const bySlug = new Map(existing.map((e) => [e.slug, e]));
  const byName = new Map(existing.map((e) => [normName(e.name), e]));
  const { data: docRows } = await supabase.from("documents").select("id, code");
  const docId = new Map<string, string>((docRows ?? []).map((d: any) => [d.code, d.id]));
  const { data: linkRows } = await supabase.from("scheme_documents").select("scheme_id");
  const docCount = new Map<string, number>();
  (linkRows ?? []).forEach((l: any) => docCount.set(l.scheme_id, (docCount.get(l.scheme_id) ?? 0) + 1));

  const r = { fetched: input.rows.length, inserted: 0, updated: 0, unchanged: 0, duplicates: 0, failed: 0, incomplete: 0, not_applicable: 0, tn_count: 0, central_count: 0 };
  const errors: { row: number; name?: string; error: string }[] = [];
  const seen = new Set<string>();
  const inserts: { row: any; docs: string[] }[] = [];

  for (const [i, raw] of input.rows.entries()) {
    const { row, documents, error } = normaliseRow(raw, { source_name: input.source, ...(input.defaults ?? {}) });
    if (!row) { r.failed++; errors.push({ row: i + 1, error: error ?? "Invalid row" }); continue; }
    const key = row.external_id ?? normName(row.name);
    if (seen.has(key)) { r.duplicates++; continue; }
    seen.add(key);
    const app = applicability(row);
    if (app === "not_applicable") { r.not_applicable++; continue; }
    if (app === "tn_state") r.tn_count++; else r.central_count++;

    const match = (row.external_id && byExt.get(row.external_id)) || bySlug.get(row.slug) || byName.get(normName(row.name));
    const knownDocs = documents.filter((d) => docId.has(d));
    if (match) {
      const patch = mergeNoDowngrade(match, row as any);
      if (Object.keys(patch).length) {
        const { error: e } = await supabase.from("schemes").update(patch).eq("id", match.id);
        if (e) { r.failed++; errors.push({ row: i + 1, name: row.name, error: e.message }); continue; }
        r.updated++;
      } else r.unchanged++;
      if (knownDocs.length) {
        await supabase.from("scheme_documents").upsert(knownDocs.map((c) => ({ scheme_id: match.id, document_id: docId.get(c)! })), { onConflict: "scheme_id,document_id", ignoreDuplicates: true });
      }
      if (isIncomplete({ ...match, ...patch }, (docCount.get(match.id) ?? 0) + knownDocs.length)) r.incomplete++;
    } else {
      if (bySlug.has(row.slug)) row.slug = `${row.slug}-${Math.random().toString(36).slice(2, 6)}`;
      inserts.push({ row, docs: knownDocs });
      if (isIncomplete(row, knownDocs.length)) r.incomplete++;
    }
  }

  // Bulk insert in chunks
  for (let i = 0; i < inserts.length; i += 200) {
    const chunk = inserts.slice(i, i + 200);
    const { data, error } = await supabase.from("schemes").insert(chunk.map((c) => c.row)).select("id, slug");
    if (error) { r.failed += chunk.length; errors.push({ row: -1, error: `Bulk insert failed: ${error.message}` }); continue; }
    r.inserted += data.length;
    const links = data.flatMap((d: any) => (chunk.find((c) => c.row.slug === d.slug)?.docs ?? []).map((code) => ({ scheme_id: d.id, document_id: docId.get(code)! })));
    if (links.length) await supabase.from("scheme_documents").insert(links);
  }

  const run = { source: input.source, method: input.method, total_available: input.totalAvailable ?? null, ...r, details: { errors: errors.slice(0, 200) }, created_by: userId };
  await supabase.from("collection_runs").insert(run);
  return { ...run, errors };
}

export const importSchemes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: Input) => {
    if (!d?.source || !Array.isArray(d.rows)) throw new Error("source and rows are required");
    if (d.rows.length > 20000) throw new Error("Too many rows in one import (max 20,000)");
    return d;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    return ingest(context.supabase, context.userId, data);
  });

/**
 * Official Open Government Data (data.gov.in) API collector.
 * Pages through a dataset resource using offset/limit until the API's reported `total` is reached.
 * Requires DATA_GOV_IN_API_KEY (free key from data.gov.in).
 */
export const collectFromDataGov = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { resourceId: string; level: "central" | "state" }) => {
    if (!/^[a-z0-9-]{8,64}$/i.test(d?.resourceId ?? "")) throw new Error("Invalid resource id");
    return d;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const key = process.env['DATA_GOV_IN_API_KEY'];
    if (!key) throw new Error("DATA_GOV_IN_API_KEY is not configured");
    const rows: RawRow[] = [];
    let total: number | null = null;
    const limit = 500;
    for (let offset = 0; offset < 100000; offset += limit) {
      const url = `https://api.data.gov.in/resource/${data.resourceId}?api-key=${key}&format=json&limit=${limit}&offset=${offset}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`data.gov.in request failed [${res.status}]: ${(await res.text()).slice(0, 300)}`);
      const j = (await res.json()) as { total?: number | string; records?: RawRow[] };
      total = j.total != null ? Number(j.total) : total;
      const recs = j.records ?? [];
      rows.push(...recs);
      if (recs.length < limit || (total != null && rows.length >= total)) break;
    }
    const defaults = data.level === "state" ? { level: "state", states: ["Tamil Nadu"] } : { level: "central" };
    const result = await ingest(context.supabase, context.userId, {
      source: `data.gov.in:${data.resourceId}`, method: "official_api", totalAvailable: total, rows,
      defaults: { ...defaults, source_url: `https://data.gov.in/resource/${data.resourceId}`, status: "needs_verification" },
    });
    await context.supabase.from("data_sources").update({ last_checked: new Date().toISOString() }).eq("name", "Open Government Data Platform India");
    return result;
  });
