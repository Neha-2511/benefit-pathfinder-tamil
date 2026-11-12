// Fuzzy duplicate detection for scheme records (spelling, formatting, abbreviations, alternate names).
const PHRASES: [RegExp, string][] = [
  [/pradhan\s*mantri|prime\s*minister/g, "pm"], [/chief\s*minister'?s?|mudhalvar|muthalvar/g, "cm"],
  [/tamil\s*nadu|tamilnadu/g, "tn"], [/yojna|yojanaa/g, "yojana"], [/thittam|thitam/g, "thittam"],
  [/scholarships?/g, "scholarship"], [/&/g, " and "],
];
const STOP = new Set(["the", "of", "for", "and", "scheme", "schemes", "programme", "program", "yojana", "govt", "government", "a", "an", "to", "in", "under"]);

export function nameTokens(s: string): string[] {
  let t = (s ?? "").toLowerCase().replace(/\(([^)]*)\)/g, " $1 ");
  for (const [re, r] of PHRASES) t = t.replace(re, r);
  return t.replace(/[^a-z0-9]+/g, " ").split(" ").filter((w) => w && !STOP.has(w));
}
export const canonName = (s: string) => nameTokens(s).join(" ");
const acronym = (s: string) => {
  const raw = (s ?? "").toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/).filter((w) => w && !["of", "the", "and", "for"].includes(w));
  return raw.length >= 3 ? raw.map((w) => w[0]).join("") : "";
};

function lev(a: string, b: string) {
  const d = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]!; d[0] = i;
    for (let j = 1; j <= b.length; j++) { const tmp = d[j]!; d[j] = Math.min(d[j]! + 1, d[j - 1]! + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = tmp; }
  }
  return d[b.length]!;
}

/** 0..1 similarity of two scheme names. */
export function nameSimilarity(a: string, b: string) {
  const ca = canonName(a), cb = canonName(b);
  if (!ca || !cb) return 0;
  if (ca === cb || ca.replace(/ /g, "") === cb.replace(/ /g, "")) return 1;
  const A = new Set(ca.split(" ")), B = new Set(cb.split(" "));
  const inter = [...A].filter((x) => B.has(x)).length;
  const jac = inter / new Set([...A, ...B]).size;
  const ed = 1 - lev(ca, cb) / Math.max(ca.length, cb.length);
  return Math.max(jac, ed);
}

export type DupCandidate = { id?: string; name: string; alt_names?: string[] | null; department?: string | null; level?: string | null; external_id?: string | null };

/** Returns the existing record this row duplicates, or null. */
export function findDuplicate<T extends DupCandidate>(row: DupCandidate, existing: T[]): T | null {
  const names = [row.name, ...(row.alt_names ?? [])].filter(Boolean);
  const ac = acronym(row.name);
  let best: T | null = null, bestScore = 0;
  for (const e of existing) {
    if (row.external_id && e.external_id && row.external_id === e.external_id) return e;
    const enames = [e.name, ...(e.alt_names ?? [])].filter(Boolean);
    // Acronym of one equals the other's name (e.g. "PMKVY" vs "Pradhan Mantri Kaushal Vikas Yojana")
    if (enames.some((n) => { const c = canonName(n).replace(/ /g, ""); return (ac && c === ac) || (acronym(n) && acronym(n) === canonName(row.name).replace(/ /g, "")); })) return e;
    let s = 0;
    for (const a of names) for (const b of enames) s = Math.max(s, nameSimilarity(a, b));
    // Different level (state vs central) needs stronger evidence
    if (row.level && e.level && row.level !== e.level) s -= 0.08;
    // Same department makes a near match more convincing
    if (row.department && e.department && nameSimilarity(row.department, e.department) > 0.8) s += 0.04;
    if (s > bestScore) { bestScore = s; best = e; }
  }
  return bestScore >= 0.88 ? best : null;
}
