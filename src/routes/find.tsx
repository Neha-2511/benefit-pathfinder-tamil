import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useI18n, type DictKey } from "@/lib/i18n";
import { AGE_GROUPS, COMMUNITIES, EDUCATION, GENDERS, INCOMES, OCCUPATIONS, PURPOSES, STATES, type Opt } from "@/lib/taxonomy";
import { relevantSteps, type ProfileSearch } from "@/lib/profile";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/find")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Find Schemes for Me — Civic Nexus" },
      { name: "description", content: "Answer a few simple questions to find government schemes and scholarships for you." },
      { property: "og:title", content: "Find Schemes for Me — Civic Nexus" },
      { property: "og:description", content: "A short, simple questionnaire to match you with schemes." },
    ],
  }),
  component: FindPage,
});

const STEP_DEF: Record<string, { q: DictKey; opts: Opt[]; optional?: boolean }> = {
  state: { q: "qState", opts: STATES },
  age: { q: "qAge", opts: AGE_GROUPS },
  occ: { q: "qOcc", opts: OCCUPATIONS },
  purpose: { q: "qPurpose", opts: PURPOSES },
  gender: { q: "qGender", opts: GENDERS, optional: true },
  edu: { q: "qEdu", opts: EDUCATION, optional: true },
  comm: { q: "qCommunity", opts: COMMUNITIES, optional: true },
  income: { q: "qIncome", opts: INCOMES, optional: true },
};

function FindPage() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<ProfileSearch>({ state: "Tamil Nadu" });
  const [i, setI] = useState(0);
  const steps = relevantSteps(answers);
  const key = steps[i] as keyof ProfileSearch;
  const def = STEP_DEF[key]!;
  const isLast = i === steps.length - 1;

  const finish = (a: ProfileSearch) => navigate({ to: "/results", search: a });
  const choose = (v: string) => {
    const next = { ...answers, [key]: v };
    setAnswers(next);
    const nextSteps = relevantSteps(next);
    if (i >= nextSteps.length - 1) finish(next);
    else setTimeout(() => setI(i + 1), 120);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {i + 1} of {steps.length}</span>
        {def.optional && <span>Optional</span>}
      </div>
      <Progress value={((i + 1) / steps.length) * 100} className="mb-8 h-2" />
      <h1 className="text-2xl font-bold md:text-3xl">{t(def.q)}</h1>
      <div className={cn("mt-6 grid gap-3", def.opts.length > 4 ? "sm:grid-cols-2" : "")}>
        {def.opts.map((o) => {
          const sel = answers[key] === o.value;
          return (
            <button
              key={o.value}
              onClick={() => choose(o.value)}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 bg-card px-5 py-4 text-left font-semibold transition-colors hover:border-teal",
                sel ? "border-teal bg-accent" : "border-border",
              )}
            >
              {o[lang]}
              {sel && <Check className="h-5 w-5 text-teal" />}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
          <ArrowLeft /> {t("back")}
        </Button>
        <div className="flex gap-2">
          {def.optional && !isLast && (
            <Button variant="outline" onClick={() => setI(i + 1)}>{t("skip")}</Button>
          )}
          {(isLast || answers[key]) && (
            <Button onClick={() => (isLast ? finish(answers) : setI(i + 1))} disabled={!def.optional && !answers[key]}>
              {isLast ? t("showResults") : t("next")} <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
