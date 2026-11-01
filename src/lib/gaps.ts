// Information Gap Detection for scheme records.
export type GapStatus = "complete" | "incomplete" | "needs_verification" | "outdated";
export type GapScheme = {
  eligibility_text: string | null;
  benefits: string | null;
  application_process: string | null;
  apply_url: string | null;
  official_url: string | null;
  source_url: string | null;
  deadline: string | null;
  last_verified: string | null;
  status: string;
  link_status: number | null;
  source_unavailable: string[];
  doc_count: number;
};

export type Gap = { field: string; label: string; origin: "our_database" | "government_source" };

const FIELDS: [keyof GapScheme | "documents", string, (s: GapScheme) => boolean][] = [
  ["eligibility_text", "Eligibility criteria", (s) => !s.eligibility_text?.trim()],
  ["documents", "Required documents", (s) => s.doc_count === 0],
  ["benefits", "Benefits information", (s) => !s.benefits?.trim()],
  ["application_process", "Application instructions", (s) => !s.application_process?.trim()],
  ["apply_url", "Official application link", (s) => !s.apply_url?.trim() && !s.official_url?.trim()],
  ["deadline", "Application deadline", (s) => !s.deadline],
  ["source_url", "Official source URL", (s) => !s.source_url?.trim()],
];

export const OUTDATED_DAYS = 180;

export function detectGaps(s: GapScheme, today = new Date()) {
  const gaps: Gap[] = FIELDS.filter(([, , missing]) => missing(s)).map(([field, label]) => ({
    field: String(field),
    label,
    origin: s.source_unavailable.includes(String(field)) ? "government_source" : "our_database",
  }));
  const brokenLink = s.link_status != null && (s.link_status === 0 || s.link_status >= 400);
  const ageDays = s.last_verified ? (today.getTime() - new Date(s.last_verified).getTime()) / 86400000 : null;

  let status: GapStatus;
  const ourGaps = gaps.filter((g) => g.origin === "our_database");
  if (ageDays != null && ageDays > OUTDATED_DAYS) status = "outdated";
  else if (!s.last_verified || s.status === "needs_verification" || brokenLink) status = "needs_verification";
  else if (ourGaps.length) status = "incomplete";
  else status = "complete";

  return { status, gaps, brokenLink, ageDays };
}

export const GAP_LABEL: Record<GapStatus, string> = {
  complete: "Complete Information",
  incomplete: "Incomplete Information",
  needs_verification: "Needs Verification",
  outdated: "Potentially Outdated",
};
