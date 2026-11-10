import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search } from "lucide-react";
import { schemesQuery } from "@/lib/data";
import { SchemeCard } from "@/components/site/SchemeCard";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/taxonomy";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/schemes/")({
  validateSearch: (s: Record<string, unknown>): { category?: string | undefined } => ({ category: typeof s["category"] === "string" ? s["category"] : undefined }),
  loader: ({ context }) => context.queryClient.ensureQueryData(schemesQuery()),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "All Government Schemes & Scholarships — Civic Nexus" },
      { name: "description", content: "Browse Central and Tamil Nadu government schemes and scholarships by category." },
      { property: "og:title", content: "All Schemes — Civic Nexus" },
      { property: "og:description", content: "Search the full scheme database." },
    ],
  }),
  component: Browse,
});

const PER_PAGE = 12;

function Browse() {
  const { category } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { lang } = useI18n();
  const { data } = useSuspenseQuery(schemesQuery());
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [level, setLevel] = useState<"all" | "central" | "state">("all");
  const list = data.filter((s) =>
    s.status !== "discontinued" &&
    (!category || s.category === category) &&
    (level === "all" || s.level === level) &&
    (!q || `${s.name} ${s.summary} ${(s.tags ?? []).join(" ")}`.toLowerCase().includes(q.toLowerCase())),
  );
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  const cur = Math.min(page, pages - 1);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold">All schemes & scholarships</h1>
      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by name or keyword" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        </div>
        <div className="flex gap-1">
          {(["all", "central", "state"] as const).map((l) => (
            <Button key={l} variant={level === l ? "default" : "outline"} aria-pressed={level === l} onClick={() => { setLevel(l); setPage(0); }} className="capitalize">
              {l === "state" ? "Tamil Nadu" : l}
            </Button>
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Chip active={!category} onClick={() => { setPage(0); navigate({ search: { category: undefined } }); }}>All</Chip>
        {CATEGORIES.map((c) => (
          <Chip key={c.value} active={category === c.value} onClick={() => { setPage(0); navigate({ search: { category: c.value } }); }}>{c[lang]}</Chip>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{list.length} results</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.slice(cur * PER_PAGE, cur * PER_PAGE + PER_PAGE).map((s) => <SchemeCard key={s.id} scheme={s} />)}
      </div>
      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3 text-sm">
          <Button variant="outline" disabled={cur === 0} onClick={() => setPage(cur - 1)}>Previous</Button>
          <span>Page {cur + 1} of {pages}</span>
          <Button variant="outline" disabled={cur + 1 >= pages} onClick={() => setPage(cur + 1)}>Next</Button>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <Button variant={active ? "default" : "outline"} size="sm" aria-pressed={active} onClick={onClick}>
      {children}
    </Button>
  );
}
