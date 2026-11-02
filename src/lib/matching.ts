// Rule-based eligibility + TF-IDF text similarity recommendation engine.
export type SchemeForMatch = {
  id: string;
  slug: string;
  name: string;
  category: string;
  level: string;
  states: string[] | null;
  status: string;
  summary: string | null;
  benefits: string | null;
  eligibility_text: string | null;
  tags: string[] | null;
  min_age: number | null;
  max_age: number | null;
  genders: string[] | null;
  occupations: string[] | null;
  purposes: string[] | null;
  education_levels: string[] | null;
  communities: string[] | null;
  max_income: number | null;
  is_scholarship: boolean;
};

export type Profile = {
  state: string;
  age?: number | null;
  occupation?: string | null;
  purpose?: string | null;
  income?: number | null;
  education?: string | null;
  gender?: string | null;
  community?: string | null;
};

export type MatchLabel = "eligible" | "more_info" | "not_meet";
export type MatchResult = {
  scheme: SchemeForMatch;
  label: MatchLabel;
  score: number;
  reasons: string[];
  missing: string[];
  failed: string[];
};

const PURPOSE_KEYWORDS: Record<string, string> = {
  education: "education student study college school course degree",
  scholarship: "scholarship student fees maintenance allowance merit",
  business: "business enterprise entrepreneur loan subsidy msme self employment",
  agriculture: "farmer crop agriculture land cultivation soil",
  housing: "house housing pucca construction home",
  employment: "employment job skill training internship worker",
  women: "women girl female mother maternity",
  financial: "financial assistance insurance pension savings income support",
  health: "health hospital insurance treatment maternity",
  pension: "pension senior old age elderly",
  other: "",
};

const STOP = new Set("the a an of for to and or in on with by is are as at be from per up their who".split(" "));
export function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
}

export function tfidfSimilarities(query: string, docs: string[]): number[] {
  const tokDocs = docs.map(tokenize);
  const df = new Map<string, number>();
  tokDocs.forEach((t) => new Set(t).forEach((w) => df.set(w, (df.get(w) ?? 0) + 1)));
  const N = docs.length;
  const vec = (tokens: string[]) => {
    const tf = new Map<string, number>();
    tokens.forEach((w) => tf.set(w, (tf.get(w) ?? 0) + 1));
    const v = new Map<string, number>();
    tf.forEach((c, w) => v.set(w, (c / tokens.length) * Math.log((N + 1) / ((df.get(w) ?? 0) + 1) + 1)));
    return v;
  };
  const q = vec(tokenize(query));
  const qn = Math.sqrt([...q.values()].reduce((s, x) => s + x * x, 0)) || 1;
  return tokDocs.map((t) => {
    if (!t.length) return 0;
    const d = vec(t);
    let dot = 0;
    q.forEach((x, w) => (dot += x * (d.get(w) ?? 0)));
    const dn = Math.sqrt([...d.values()].reduce((s, x) => s + x * x, 0)) || 1;
    return dot / (qn * dn);
  });
}

export function evaluate(s: SchemeForMatch, p: Profile): Omit<MatchResult, "score" | "scheme"> {
  const reasons: string[] = [];
  const missing: string[] = [];
  const failed: string[] = [];

  if (s.level === "state" && s.states?.length) {
    if (s.states.includes(p.state)) reasons.push(`Available in ${p.state}`);
    else failed.push(`Only for residents of ${s.states.join(", ")}`);
  } else reasons.push("Central scheme available across India");

  if (s.min_age != null || s.max_age != null) {
    const range = `${s.min_age ?? 0}${s.max_age ? `–${s.max_age}` : "+"} years`;
    if (p.age == null) missing.push(`Age (${range})`);
    else if ((s.min_age != null && p.age < s.min_age) || (s.max_age != null && p.age > s.max_age)) failed.push(`Age must be ${range}`);
    else reasons.push(`Your age group fits ${range}`);
  }
  if (s.genders?.length) {
    if (!p.gender || p.gender === "skip") missing.push(`Gender (scheme is for ${s.genders.join("/")})`);
    else if (!s.genders.includes(p.gender)) failed.push(`Only for ${s.genders.join("/")} applicants`);
    else reasons.push(`Meant for ${s.genders.join("/")} applicants`);
  }
  if (s.occupations?.length) {
    if (!p.occupation) missing.push("Occupation");
    else if (!s.occupations.includes(p.occupation)) failed.push(`Meant for: ${s.occupations.join(", ")}`);
    else reasons.push(`Matches your occupation (${p.occupation})`);
  }
  if (s.education_levels?.length) {
    if (!p.education) missing.push("Education level");
    else if (!s.education_levels.includes(p.education)) failed.push(`Education level: ${s.education_levels.join(", ")}`);
    else reasons.push("Matches your education level");
  }
  if (s.communities?.length) {
    if (!p.community || p.community === "skip") missing.push(`Community (${s.communities.join("/").toUpperCase()})`);
    else if (!s.communities.includes(p.community)) failed.push(`Only for ${s.communities.join("/").toUpperCase()} communities`);
    else reasons.push("Matches your community category");
  }
  if (s.max_income != null) {
    const lim = `₹${(s.max_income / 100000).toLocaleString("en-IN")} lakh`;
    if (p.income == null) missing.push(`Family income (limit ${lim})`);
    else if (p.income > s.max_income) failed.push(`Family income must be within ${lim}`);
    else reasons.push(`Income within ${lim} limit`);
  }
  if (p.purpose && s.purposes?.includes(p.purpose)) reasons.push(`Related to your need: ${p.purpose}`);

  const label: MatchLabel = failed.length ? "not_meet" : missing.length ? "more_info" : "eligible";
  return { label, reasons, missing, failed };
}

export function recommend(schemes: SchemeForMatch[], p: Profile): MatchResult[] {
  const usable = schemes.filter((s) => s.status === "active" || s.status === "needs_verification");
  const texts = usable.map((s) =>
    [s.name, s.summary, s.benefits, s.eligibility_text, (s.tags ?? []).join(" "), s.category, (s.purposes ?? []).join(" ")].join(" "),
  );
  const query = `${PURPOSE_KEYWORDS[p.purpose ?? ""] ?? ""} ${p.occupation ?? ""}`;
  const sims = tfidfSimilarities(query, texts);

  return usable
    .map((s, i) => {
      const ev = evaluate(s, p);
      let score = (sims[i] ?? 0) * 40;
      if (p.purpose && s.purposes?.includes(p.purpose)) score += 40;
      if (p.purpose === "scholarship" && s.is_scholarship) score += 15;
      if (p.occupation && s.occupations?.includes(p.occupation)) score += 20;
      if (s.level === "state" && s.states?.includes(p.state)) score += 5;
      return { scheme: s, score, ...ev };
    })
    .filter((r) => r.score >= 8 || r.label === "eligible")
    .sort((a, b) => {
      const o = { eligible: 0, more_info: 1, not_meet: 2 };
      return o[a.label] - o[b.label] || b.score - a.score;
    });
}
