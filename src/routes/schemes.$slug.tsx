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
  notFoundComponent: () => {
    const { t } = useI18n();
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">{t("schemeNotFound")}</h1>
        <Link to="/schemes" className="mt-4 inline-block text-teal underline">{t("browseAll")}</Link>
      </div>
    );
  },
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

  // Scheme name: prefer translated field for language, fall back to English name
  const schemeName =
    lang === "ta" && (s as any).name_ta ? (s as any).name_ta :
    lang === "ml" && (s as any).name_ml ? (s as any).name_ml :
    lang === "hi" && (s as any).name_hi ? (s as any).name_hi :
    s.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <button onClick={() => history.back()} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {t("backBtn")}
      </button>
      <div className="rounded-2xl bg-hero p-6 text-navy-foreground md:p-8">
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">{label(CATEGORIES, s.category, lang)}</span>
          <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">
            {s.level === "state" ? (s.states ?? []).join(", ") : t("centralGovt")}
          </span>
          {s.is_scholarship && <span className="rounded-full bg-navy-foreground/15 px-2 py-0.5">{t("scholarship")}</span>}
          {s.is_sample && <span className="rounded-full bg-destructive px-2 py-0.5 font-bold">SAMPLE DATA — not a real scheme</span>}
        </div>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">{schemeName}</h1>
        {s.summary && <p className="mt-2 opacity-90">{s.summary}</p>}
        <div className="mt-5 flex flex-wrap gap-3">
          {link && (
            <Button asChild variant="teal" size="lg">
              <a href={link} target="_blank" rel="noopener noreferrer">
                {s.apply_url ? t("apply") : t("officialInfo")} <ExternalLink />
              </a>
            </Button>
          )}
        </div>
        <p className="mt-3 text-xs opacity-80">{t("schemeNoticeSmall")}</p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <Section title={t("benefits")}>{s.benefits ?? <Missing />}</Section>
          <Section title={t("eligibility")}>{s.eligibility_text ?? <Missing />}</Section>
          <Section title={t("howToApply")}>
            {s.application_process ?? (
              <span>
                {t("applyFallback")}
                {link
                  ? <a className="text-teal underline" href={link} target="_blank" rel="noopener noreferrer">{t("officialWebsite")}</a>
                  : t("officialWebsite")}
                {t("applyFallbackSuffix")}
              </span>
            )}
          </Section>

          <section className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{t("docsChecklist")}</h2>
              <span className="text-sm text-muted-foreground">{ready}/{docs.length} {t("docsReady")}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t("docsNote")}</p>
            {docs.length === 0 && <p className="mt-4"><Missing /></p>}
            <ul className="mt-4 divide-y">
              {docs.map((d) => {
                const docName =
                  lang === "ta" && (d.documents as any).name_ta ? (d.documents as any).name_ta :
                  lang === "ml" && (d.documents as any).name_ml ? (d.documents as any).name_ml :
                  lang === "hi" && (d.documents as any).name_hi ? (d.documents as any).name_hi :
                  d.documents.name;
                return (
                  <li key={d.documents.code} className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="flex items-center gap-2 font-medium">
                        <FileText className="h-4 w-4 text-teal" />
                        {docName}
                      </p>
                      {d.reason && <p className="ml-6 text-xs text-muted-foreground">{t("docWhy")} {d.reason}</p>}
                    </div>
                    <div className="flex gap-1">
                      {([
                        ["available", t("available"), "bg-success text-navy-foreground"],
                        ["missing",   t("notAvailable"), "bg-destructive text-destructive-foreground"],
                        ["unsure",    t("notSure"), "bg-warning text-navy-foreground"],
                      ] as const).map(([m, txt, cls]) => (
                        <button key={m} onClick={() => setMark(d.documents.code, m)}
                          className={cn("rounded-md border px-2.5 py-1 text-xs font-semibold", marks[d.documents.code] === m ? cls + " border-transparent" : "bg-card")}>
                          {txt}
                        </button>
                      ))}
                    </div>
                  </li>
                );
              })}
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
            <h3 className="font-semibold">{t("keyFacts")}</h3>
            <dl className="mt-3 space-y-2">
              <Row k={t("statusLabel")} v={<StatusPill status={s.status} />} />
              <Row k={t("deadlineLabel")} v={s.deadline ? new Date(s.deadline).toLocaleDateString("en-IN") : s.deadline_note ?? t("checkOfficial")} />
              <Row k={t("lastVerified")} v={s.last_verified ? new Date(s.last_verified).toLocaleDateString("en-IN") : t("notVerified")} />
              <Row k={t("sourceLabel")} v={s.source_url
                ? <a className="text-teal underline" href={s.source_url} target="_blank" rel="noopener noreferrer">{s.source_name ?? t("officialSource")}</a>
                : "—"} />
            </dl>
          </div>
          {s.status === "needs_verification" && (
            <div className="flex gap-2 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm">
              <ShieldAlert className="h-5 w-5 shrink-0 text-warning" />
              {t("pendingVerify")}
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
  const { t } = useI18n();
  return <span className="inline-flex items-center gap-1 text-muted-foreground"><Info className="h-4 w-4" /> {t("notInDb")}</span>;
}

export function DocGuide({ d, schemeName }: { d: SchemeDoc; schemeName?: string }) {
  const { t, lang } = useI18n();
  const g = d.documents;
  const docName =
    lang === "ta" && (g as any).name_ta ? (g as any).name_ta :
    lang === "ml" && (g as any).name_ml ? (g as any).name_ml :
    lang === "hi" && (g as any).name_hi ? (g as any).name_hi :
    g.name;
  return (
    <div className="rounded-xl border-l-4 border-teal bg-card p-5 shadow-sm">
      <h3 className="font-semibold">{docName}</h3>
      {schemeName && d.reason && (
        <p className="mt-1 text-sm"><b>{t("whyNeeded")} {schemeName}:</b> {d.reason}</p>
      )}
      <dl className="mt-3 grid gap-3 text-sm">
        {g.issuing_authority && <div><dt className="font-semibold">{t("issuedBy")}</dt><dd>{g.issuing_authority}</dd></div>}
        {g.eligibility && <div><dt className="font-semibold">{t("whoCanGet")}</dt><dd>{g.eligibility}</dd></div>}
        {g.supporting_docs.length > 0 && (
          <div><dt className="font-semibold">{t("supportingDocs")}</dt>
            <dd><ul className="ml-5 list-disc">{g.supporting_docs.map((x) => <li key={x}>{x}</li>)}</ul></dd>
          </div>
        )}
        {g.steps.length > 0 && (
          <div><dt className="font-semibold">{t("stepsToApply")}</dt>
            <dd><ol className="ml-5 list-decimal space-y-1">{g.steps.map((x) => <li key={x}>{x}</li>)}</ol></dd>
          </div>
        )}
        {g.offline_process && <div><dt className="font-semibold">{t("offlineOption")}</dt><dd>{g.offline_process}</dd></div>}
        <div>
          <dt className="font-semibold">{t("feesTime")}</dt>
          <dd>{g.fees || g.processing_time ? `${g.fees ?? ""} ${g.processing_time ?? ""}` : t("feesDefault")}</dd>
        </div>
        {g.alternatives && <div><dt className="font-semibold">{t("alternatives")}</dt><dd>{g.alternatives}</dd></div>}
        {g.after_obtaining && <div><dt className="font-semibold">{t("afterObtaining")}</dt><dd>{g.after_obtaining}</dd></div>}
      </dl>
      {g.online_url && (
        <Button asChild size="sm" className="mt-4">
          <a href={g.online_url} target="_blank" rel="noopener noreferrer">
            {t("applyOnline")} {g.online_portal_name ?? t("officialPortal")} <ExternalLink />
          </a>
        </Button>
      )}
      {g.applies_to === "TN" && <p className="mt-2 text-xs text-muted-foreground">{t("tnOnly")}</p>}
    </div>
  );
}
