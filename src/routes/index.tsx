import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ClipboardCheck, FileSearch, GraduationCap, Landmark, ShieldCheck, Sprout, Briefcase, HeartPulse, Home as HomeIcon, Users, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { schemesQuery } from "@/lib/data";
import { CATEGORIES } from "@/lib/taxonomy";
import hero from "@/assets/hero-civic.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Civic Nexus — Government Benefits Made Simple" },
      { name: "description", content: "Discover Central and Tamil Nadu government schemes and scholarships, check required documents and apply on official portals." },
      { property: "og:title", content: "Civic Nexus — Government Benefits Made Simple" },
      { property: "og:description", content: "Find schemes and scholarships you may be eligible for, with document checklists and official links." },
    ],
  }),
  component: Index,
});

const CAT_ICONS: Record<string, typeof Landmark> = {
  education: GraduationCap, agriculture: Sprout, business: Briefcase, employment: Users,
  women: Users, housing: HomeIcon, health: HeartPulse, pension: Users, financial: Wallet, other: Landmark,
};

function Index() {
  const { t, lang } = useI18n();
  const { data } = useQuery(schemesQuery());
  const counts = new Map<string, number>();
  data?.forEach((s) => counts.set(s.category, (counts.get(s.category) ?? 0) + 1));

  return (
    <>
      <section className="bg-hero text-navy-foreground">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-navy-foreground/10 px-3 py-1 text-sm">
              <ShieldCheck className="h-4 w-4" /> Central & Tamil Nadu schemes · Official links only
            </p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">{t("heroTitle")}</h1>
            <p className="mt-5 max-w-xl text-lg opacity-90">{t("heroSub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="teal" size="xl">
                <Link to="/find">{t("findCta")} <ArrowRight /></Link>
              </Button>
              <Button asChild variant="heroOutline" size="xl">
                <Link to="/schemes">{t("browse")}</Link>
              </Button>
            </div>
            {data && <p className="mt-6 text-sm opacity-80">{data.length} schemes & scholarships in the database</p>}
          </div>
          <img src={hero} alt="Citizens with documents near a government office" className="w-full rounded-2xl shadow-2xl" width={1200} height={912} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold">How it works</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, title: "Answer a few questions", body: "Age, occupation and what you need. Takes about a minute." },
            { icon: FileSearch, title: "See matching schemes", body: "We check every scheme's conditions and explain why it fits." },
            { icon: ClipboardCheck, title: "Prepare documents & apply", body: "Tick the documents you have, learn how to get the rest, then apply on the official portal." },
          ].map((s, i) => (
            <div key={s.title} className="rounded-xl border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground"><s.icon className="h-5 w-5" /></span>
                <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="text-2xl font-bold">Browse by category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {CATEGORIES.filter((c) => counts.get(c.value)).map((c) => {
            const Icon = CAT_ICONS[c.value] ?? Landmark;
            return (
              <Link key={c.value} to="/schemes" search={{ category: c.value }} className="rounded-xl border bg-card p-4 hover:border-teal">
                <Icon className="h-6 w-6 text-teal" />
                <p className="mt-3 text-sm font-semibold">{c[lang]}</p>
                <p className="text-xs text-muted-foreground">{counts.get(c.value)} schemes</p>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
