import { AGE_GROUPS, INCOMES } from "./taxonomy";
import type { Profile } from "./matching";

export type ProfileSearch = {
  state?: string;
  age?: string;
  occ?: string;
  purpose?: string;
  gender?: string;
  edu?: string;
  comm?: string;
  income?: string;
};

export function validateProfileSearch(s: Record<string, unknown>): ProfileSearch {
  const pick = (k: string) => (typeof s[k] === "string" ? (s[k] as string) : undefined);
  return {
    state: pick("state"), age: pick("age"), occ: pick("occ"), purpose: pick("purpose"),
    gender: pick("gender"), edu: pick("edu"), comm: pick("comm"), income: pick("income"),
  };
}

export function toProfile(s: ProfileSearch): Profile {
  return {
    state: s.state ?? "Tamil Nadu",
    age: AGE_GROUPS.find((a) => a.value === s.age)?.age ?? null,
    occupation: s.occ ?? null,
    purpose: s.purpose ?? null,
    gender: s.gender ?? null,
    education: s.edu ?? null,
    community: s.comm ?? null,
    income: INCOMES.find((i) => i.value === s.income)?.amount ?? null,
  };
}

// Conditional questionnaire: which optional questions are relevant for these answers.
export function relevantSteps(s: ProfileSearch): string[] {
  const steps = ["state", "age", "occ", "purpose"];
  const p = s.purpose, o = s.occ;
  const edu = ["education", "scholarship"].includes(p ?? "");
  if (edu || ["women", "health", "financial"].includes(p ?? "") || o === "student" || o === "homemaker") steps.push("gender");
  if (o === "student" || edu || p === "employment") steps.push("edu");
  if (edu || o === "student" || p === "business") steps.push("comm");
  if (edu || ["housing", "financial", "health", "women", "employment"].includes(p ?? "") || o === "student") steps.push("income");
  return steps;
}
