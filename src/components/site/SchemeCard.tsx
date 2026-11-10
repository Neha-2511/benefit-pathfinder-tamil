import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import type { Scheme } from "@/lib/data";
import type { MatchResult } from "@/lib/matching";
import { MatchBadge, StatusPill } from "./badges";
import { CATEGORIES, label } from "@/lib/taxonomy";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SchemeCard({ scheme, match }: { scheme: Scheme; match?: MatchResult }) {
  const { lang } = useI18n();
  return (
    <article className="flex min-w-0 flex-col rounded-lg border bg-card p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        {match && <MatchBadge label={match.label} />}
        <span className="rounded-md bg-primary px-2.5 py-1 text-sm font-semibold text-primary-foreground">
          {label(CATEGORIES, scheme.category, lang)}
        </span>
        <span className="inline-flex max-w-full items-center gap-1.5 rounded-md border bg-secondary px-2.5 py-1 text-sm font-semibold text-primary">
          {scheme.level === "state" ? <MapPin className="h-4 w-4 shrink-0" /> : <Building2 className="h-4 w-4 shrink-0" />}
          {scheme.level === "state" ? (scheme.states ?? []).join(", ") : (lang === "ta" ? "மத்திய அரசு" : "Central")}
        </span>
        {scheme.is_scholarship && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">Scholarship</span>}
        {scheme.is_sample && <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-bold text-destructive">SAMPLE DATA</span>}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{lang === "ta" && scheme.name_ta ? scheme.name_ta : scheme.name}</h3>
      <div className="mt-2"><StatusPill status={scheme.status} /></div>
      {scheme.benefits && <p className="mt-3 text-base leading-relaxed"><span className="font-semibold">Benefit: </span>{scheme.benefits}</p>}
      {match && match.reasons.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm text-success">
          {match.reasons.slice(0, 3).map((r) => <li key={r}>✓ {r}</li>)}
        </ul>
      )}
      {match && match.missing.length > 0 && (
        <p className="mt-2 text-sm text-warning">Need to confirm: {match.missing.join(", ")}</p>
      )}
      {match && match.failed.length > 0 && (
        <p className="mt-2 text-sm text-destructive">{match.failed.join("; ")}</p>
      )}
      <div className="mt-auto pt-4">
        <Button asChild className="w-full justify-between">
          <Link to="/schemes/$slug" params={{ slug: scheme.slug }}>
            {lang === "ta" ? "விவரங்களைக் காண்க" : "View Details"} <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}
