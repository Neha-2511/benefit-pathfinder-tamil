import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { schemesQuery } from "@/lib/data";
import { recommend, type MatchLabel } from "@/lib/matching";
import { toProfile, validateProfileSearch } from "@/lib/profile";
import { SchemeCard } from "@/components/site/SchemeCard";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { AGE_GROUPS, OCCUPATIONS, PURPOSES, label } from "@/lib/taxonomy";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/results")({
  validateSearch: validateProfileSearch,
  loader: ({ context }) => context.queryClient.ensureQueryData(schemesQuery()),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Your Matching Schemes — Civic Nexus" },
      { name: "description", content: "Government schemes and scholarships that may match your profile." },
      { property: "og:title", content: "Your Matching Schemes — Civic Nexus" },
      { property: "og:description", content: "Personalised list of potentially relevant schemes." },
    ],
  }),
  component: Results,
});

function Results() {
  const search = Route.useSearch();
  const { t, lang } = useI18n();
  const { data: schemes } = useSuspenseQuery(schemesQuery());
  const profile = toProfile(search);
  const results = useMemo(() => recommend(schemes, profile), [schemes, JSON.stringify(profile)]);
  const [tab, setTab] = useState<MatchLabel>("eligible");
  const logged = useRef(false);

  useEffect(() => {
    if (logged.current) return;
    logged.current = true;
    supabase.from("profile_submissions").insert({
      state: profile.state, age: profile.age ?? null, occupation: profile.occupation ?? null, purpose: profile.purpose ?? null,
      income: profile.income ?? null, education: profile.education ?? null, gender: profile.gender ?? null, community: profile.community ?? null,
      result_count: results.filter((r) => r.label !== "not_meet").length,
    }).then(() => {});
  }, []);

  const groups = {
    eligible: results.filter((r) => r.label === "eligible"),
    more_info: results.filter((r) => r.label === "more_info"),
    not_meet: results.filter((r) => r.label === "not_meet"),
  };
  const tabs: { k: MatchLabel; txt: string }[] = [
    { k: "eligible", txt: t("potentially") },
    { k: "more_info", txt: t("moreInfo") },
    { k: "not_meet", txt: t("notMeet") },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Schemes that may suit you</h1>
          <p className="mt-2 text-muted-foreground">
            {profile.state} · {label(AGE_GROUPS, search.age, lang)} · {label(OCCUPATIONS, search.occ, lang)} · {label(PURPOSES, search.purpose, lang)}
          </p>
        </div>
        <Button asChild variant="outline"><Link to="/find"><Pencil /> Change answers</Link></Button>
      </div>
      <p className="mt-4 rounded-lg border border-warning/30 bg-warning-soft p-3 text-sm">{t("disclaimer")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((x) => (
          <button key={x.k} onClick={() => setTab(x.k)}
            className={cn("rounded-full border px-4 py-2 text-sm font-semibold", tab === x.k ? "border-primary bg-primary text-primary-foreground" : "bg-card")}>
            {x.txt} ({groups[x.k].length})
          </button>
        ))}
      </div>

      {groups[tab].length === 0 ? (
        <p className="mt-10 text-center text-muted-foreground">No schemes in this group. Try another tab or change your answers.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups[tab].map((r) => (
            <SchemeCard key={r.scheme.id} scheme={schemes.find((s) => s.id === r.scheme.id)!} match={r} />
          ))}
        </div>
      )}
    </div>
  );
}
