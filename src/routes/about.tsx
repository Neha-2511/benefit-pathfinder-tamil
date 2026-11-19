import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About Civic Nexus — Team & Data Sources" },
      { name: "description", content: "Civic Nexus is a mini-project by Neha, Sharin and Shreya (AIML-B, Rajalakshmi Institute of Technology)." },
      { property: "og:title", content: "About Civic Nexus" },
      { property: "og:description", content: "Team, methodology and official data sources." },
    ],
  }),
  component: About,
});

function About() {
  const { t } = useI18n();
  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => (await supabase.from("data_sources").select("*").order("name")).data ?? [],
  });
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">{t("aboutTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{t("aboutSub")}</p>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">{t("teamTitle")}</h2>
        <p className="mt-2 text-sm">Neha · Sharin · Shreya<br />Department of AIML-B, Rajalakshmi Institute of Technology</p>
      </div>
      <div className="rounded-xl border bg-card p-5 text-sm">
        <h2 className="font-semibold">{t("howMatchWorks")}</h2>
        <ul className="mt-2 ml-5 list-disc space-y-1">
          <li>{t("matchPoint1")}</li>
          <li>{t("matchPoint2")}</li>
          <li>{t("matchPoint3")}</li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">{t("officialDataSources")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("noLiveIntegration")}</p>
        <div className="mt-3 divide-y rounded-xl border bg-card">
          {sources?.map((s) => (
            <div key={s.id} className="p-4 text-sm">
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-teal underline">{s.name}</a>
              <p className="mt-1 text-muted-foreground">{s.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
