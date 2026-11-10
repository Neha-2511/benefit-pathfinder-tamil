import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ExternalLink, FileText, Info, ShieldAlert } from "lucide-react";
import { schemeDetailQuery, type SchemeDoc } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/site/badges";
import { useI18n } from "@/lib/i18n";
import { CATEGORIES, label } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/schemes/$slug")({
  loader: async ({ context, params }) => {
    const d = await context.queryClient.ensureQueryData(schemeDetailQuery(params.slug));
    if (!d) throw notFound();
    return { name: d.scheme.name, summary: d.scheme.summary };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.name} — Civic Nexus` },
          { name: "description", content: loaderData.summary ?? "Eligibility, documents and official application link." },
          { property: "og:title", content: loaderData.name },
          { property: "og:description", content: loaderData.summary ?? "" },
        ]
      : [{ title: "Scheme unavailable — Civic Nexus" }, { name: "robots", content: "noindex" }],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-2xl font-bold">Scheme not found</h1>
      <Link to="/schemes" className="mt-4 inline-block text-teal underline">Browse all schemes</Link>
    </div>
  ),
  component: SchemeDetail,
});

type Mark = "available" | "missing" | "unsure";

function SchemeDetail() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(schemeDetailQuery(slug));
  const { t, lang } = useI18n();
  const s = data!.scheme;
  const docs = data!.docs;
  const storeKey = `cn-docs-${slug}`;
  const [marks, setMarks] = useState<Record<string, Mark>>({});
  useEffect(() => {
    try { setMarks(JSON.parse(localStorage.getItem(storeKey) ?? "{}")); } catch { /* ignore */ }
  }, [storeKey]);
  const setMark = (code: string, m: Mark) => {
    const next = { ...marks, [code]: m };
    setMarks(next);
    localStorage.setItem(storeKey, JSON.stringify(next));
  };
  const needHelp = docs.filter((d) => marks[d.documents.code] === "missing" || marks[d.documents.code] === "unsure");
  const ready = docs.filter((d) => marks[d.documents.code] === "available").length;
  const link = s.apply_url || s.official_url;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button onClick={() => history.back()} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>
      <div className="rounded-2xl bg-hero p-6 text-navy-foreground md:p-8">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">{label(CATEGORIES, s.category, lang)}</span>
          <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">{s.level === "state" ? (s.states ?? []).join(", ") : "Central Government"}</span>
          {s.is_scholarship && <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">Scholarship</span>}
          {s.is_sample && <span className="rounded-full bg-destructive px-2 py-0.5 font-bold">SAMPLE DATA — not a real scheme</span>}
        </div>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">{lang === "ta" && s.name_ta ? s.name_ta : s.name}</h1>
        {s.summary && <p className="mt-2 opacity-90">{s.summary}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          {link && (
            <Button asChild variant="teal" size="lg">
              <a href={link} target="_blank" rel="noopener noreferrer">{s.apply_url ? t("apply") : "Official information page"} <ExternalLink /></a>
            </Button>
          )}
        </div>
        <p className="mt-3 text-xs opacity-80">Application, verification and approval are handled only by the government department. Civic Nexus does not process applications.</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Section title="Benefits">{s.benefits ?? <Missing />}</Section>
          <Section title="Eligibility conditions">{s.eligibility_text ?? <Missing />}</Section>
          <Section title="How to apply">
            {s.application_process ?? (
              <span>Detailed steps are not yet recorded in our database. Follow the instructions on the{" "}
                {link ? <a className="text-teal underline" href={link} target="_blank" rel="noopener noreferrer">official website</a> : "official website"}.
              </span>
            )}
          </Section>

          <section className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Required documents checklist</h2>
              <span className="text-sm text-muted-foreground">{ready}/{docs.length} ready</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Mark each document. Your choices are saved only on this device.</p>
            {docs.length === 0 && <p className="mt-4"><Missing /></p>}
            <ul className="mt-4 divide-y">
              {docs.map((d) => (
                <li key={d.documents.code} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4 text-teal" />
                      {lang === "ta" && d.documents.name_ta ? d.documents.name_ta : d.documents.name}
                    </p>
                    {d.reason && <p className="ml-6 text-xs text-muted-foreground">Why: {d.reason}</p>}
                  </div>
                  <div className="flex gap-1">
                    {([["available", t("available"), "bg-success text-navy-foreground"], ["missing", t("notAvailable"), "bg-destructive text-destructive-foreground"], ["unsure", t("notSure"), "bg-warning text-navy-foreground"]] as const).map(([m, txt, cls]) => (
                      <button key={m} onClick={() => setMark(d.documents.code, m)}
                        className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", marks[d.documents.code] === m ? cls + " border-transparent" : "bg-card")}>
                        {txt}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {needHelp.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold">{t("howToObtain")}</h2>
              <div className="mt-3 space-y-4">
                {needHelp.map((d) => <DocGuide key={d.documents.code} d={d} schemeName={s.name} />)}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-5 text-sm">
            <h3 className="font-semibold">Key facts</h3>
            <dl className="mt-3 space-y-2">
              <Row k="Status" v={<StatusPill status={s.status} />} />
              <Row k="Deadline" v={s.deadline ? new Date(s.deadline).toLocaleDateString("en-IN") : s.deadline_note ?? "Not verified — check official site"} />
              <Row k="Last verified" v={s.last_verified ? new Date(s.last_verified).toLocaleDateString("en-IN") : "Not yet verified"} />
              <Row k="Source" v={s.source_url ? <a className="text-teal underline" href={s.source_url} target="_blank" rel="noopener noreferrer">{s.source_name ?? "Official source"}</a> : "—"} />
            </dl>
          </div>
          {s.status === "needs_verification" && (
            <div className="flex gap-2 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 text-warning" />
              Amounts and limits shown here are pending re-verification against the official source. Always confirm on the official website before applying.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-2 text-sm leading-relaxed">{children}</div>
    </section>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between gap-3"><dt className="text-muted-foreground">{k}</dt><dd className="text-right">{v}</dd></div>;
}
function Missing() {
  return <span className="inline-flex items-center gap-1 text-muted-foreground"><Info className="h-4 w-4" /> Not yet recorded in our database — please check the official website.</span>;
}

export function DocGuide({ d, schemeName }: { d: SchemeDoc; schemeName?: string }) {
  const g = d.documents;
  return (
    <div className="rounded-xl border-l-4 border-teal bg-card p-5 shadow-sm">
      <h3 className="font-semibold">{g.name}</h3>
      {schemeName && d.reason && <p className="mt-1 text-sm"><b>Why it's needed for {schemeName}:</b> {d.reason}</p>}
      <dl className="mt-3 grid gap-3 text-sm">
        {g.issuing_authority && <div><dt className="font-semibold">Issued by</dt><dd>{g.issuing_authority}</dd></div>}
        {g.eligibility && <div><dt className="font-semibold">Who can get it</dt><dd>{g.eligibility}</dd></div>}
        {g.supporting_docs.length > 0 && (
          <div><dt className="font-semibold">Supporting documents to keep ready</dt>
            <dd><ul className="ml-5 list-disc">{g.supporting_docs.map((x) => <li key={x}>{x}</li>)}</ul></dd></div>
        )}
        {g.steps.length > 0 && (
          <div><dt className="font-semibold">Steps to apply</dt>
            <dd><ol className="ml-5 list-decimal space-y-1">{g.steps.map((x) => <li key={x}>{x}</li>)}</ol></dd></div>
        )}
        {g.offline_process && <div><dt className="font-semibold">Offline option</dt><dd>{g.offline_process}</dd></div>}
        <div><dt className="font-semibold">Fees & processing time</dt><dd>{g.fees || g.processing_time ? `${g.fees ?? ""} ${g.processing_time ?? ""}` : "Not verified by us — the portal shows the current fee before payment."}</dd></div>
        {g.alternatives && <div><dt className="font-semibold">Officially accepted alternatives</dt><dd>{g.alternatives}</dd></div>}
        {g.after_obtaining && <div><dt className="font-semibold">After you get it</dt><dd>{g.after_obtaining}</dd></div>}
      </dl>
      {g.online_url && (
        <Button asChild size="sm" className="mt-4">
          <a href={g.online_url} target="_blank" rel="noopener noreferrer">Apply online on {g.online_portal_name ?? "official portal"} <ExternalLink /></a>
        </Button>
      )}
      {g.applies_to === "TN" && <p className="mt-2 text-xs text-muted-foreground">This procedure applies to Tamil Nadu residents.</p>}
    </div>
  );
}
