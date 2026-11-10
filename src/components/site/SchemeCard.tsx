import { Link } from "@tanstack/react-router";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import type { Scheme } from "@/lib/data";
import type { MatchResult } from "@/lib/matching";
import { MatchBadge, StatusPill } from "./badges";
import { CATEGORIES, label } from "@/lib/taxonomy";
import { useI18n } from "@/lib/i18n";

export function SchemeCard({ scheme, match }: { scheme: Scheme; match?: MatchResult }) {
  const { lang } = useI18n();
  return (
    <article className="flex flex-col rounded-xl border bg-card p-5">
      <div className="flex flex-wrap items-center gap-2">
        {match && <MatchBadge label={match.label} />}
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
          {label(CATEGORIES, scheme.category, lang)}
        </span>
        {scheme.is_scholarship && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">Scholarship</span>}
        {scheme.is_sample && <span className="rounded-full bg-danger-soft px-2 py-0.5 text-xs font-bold text-destructive">SAMPLE DATA</span>}
      </div>
      <h3 className="mt-3 text-lg font-semibold leading-snug">{lang === "ta" && scheme.name_ta ? scheme.name_ta : scheme.name}</h3>
      <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        {scheme.level === "state" ? <MapPin className="h-3.5 w-3.5" /> : <Building2 className="h-3.5 w-3.5" />}
        {scheme.level === "state" ? `State: ${(scheme.states ?? []).join(", ")}` : "Central Government"}
        <span className="ml-2"><StatusPill status={scheme.status} /></span>
      </p>
      {scheme.benefits && <p className="mt-3 text-sm"><span className="font-semibold">Benefit: </span>{scheme.benefits}</p>}
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
        <Link to="/schemes/$slug" params={{ slug: scheme.slug }} className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline">
          Details, documents & apply <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
