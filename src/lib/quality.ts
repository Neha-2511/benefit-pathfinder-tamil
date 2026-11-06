// Data-quality checks: find likely duplicate and outdated scheme records.
import { normName } from "./ingest";

type Q = { id: string; name: string; status: string; last_verified: string | null; deadline: string | null; link_status: number | null };

export function findDuplicates<T extends Q>(list: T[]): T[][] {
  const groups = new Map<string, T[]>();
  for (const s of list) {
    const k = normName(s.name);
    if (!k) continue;
    groups.set(k, [...(groups.get(k) ?? []), s]);
  }
  return [...groups.values()].filter((g) => g.length > 1);
}

/** Reasons a record looks outdated. Verification older than 365 days counts as stale. */
export function outdatedReasons(s: Q, today = new Date()): string[] {
  const out: string[] = [];
  const day = today.toISOString().slice(0, 10);
  if (!s.last_verified) out.push("Never verified");
  else if ((today.getTime() - new Date(s.last_verified).getTime()) / 86400000 > 365) out.push("Verified over a year ago");
  if (s.deadline && s.deadline < day && s.status === "active") out.push("Deadline passed but marked active");
  if (s.link_status != null && (s.link_status === 0 || s.link_status >= 400)) out.push("Official link broken");
  return out;
}
