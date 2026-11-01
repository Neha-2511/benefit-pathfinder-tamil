import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Civic Nexus — Team & Data Sources" },
      { name: "description", content: "Civic Nexus is a mini-project by Neha, Sharin and Shreya (AIML-B, Rajalakshmi Institute of Technology)." },
      { property: "og:title", content: "About Civic Nexus" },
      { property: "og:description", content: "Team, methodology and official data sources." },
    ],
  }),
  component: About,
});

function About() {
  const { data: sources } = useQuery({
    queryKey: ["sources"],
    queryFn: async () => (await supabase.from("data_sources").select("*").order("name")).data ?? [],
  });
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">About Civic Nexus</h1>
        <p className="mt-3 text-muted-foreground">Government Scheme & Scholarship Information Gap Detector — helping citizens and students in Tamil Nadu discover benefits, understand documents and reach the official application portal.</p>
      </div>
      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold">Team Civic Nexus</h2>
        <p className="mt-2 text-sm">Neha · Sharin · Shreya<br />Department of AIML-B, Rajalakshmi Institute of Technology</p>
      </div>
      <div className="rounded-xl border bg-card p-5 text-sm">
        <h2 className="font-semibold">How matching works</h2>
        <ul className="mt-2 ml-5 list-disc space-y-1">
          <li>Rule-based checks on state, age, gender, occupation, education, community and income limits.</li>
          <li>TF-IDF text similarity between your stated need and each scheme's description, to rank relevance.</li>
          <li>Results are grouped as Potentially Eligible, More Information Required, or Does Not Meet a Known Eligibility Condition. Nothing here guarantees eligibility.</li>
        </ul>
      </div>
      <div>
        <h2 className="font-semibold">Official data sources & integration status</h2>
        <p className="mt-1 text-sm text-muted-foreground">No live government data integration is active yet. Records are curated manually from these official portals, each with its source link.</p>
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
