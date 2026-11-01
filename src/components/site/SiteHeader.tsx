import { Link } from "@tanstack/react-router";
import { Landmark, Languages, Menu } from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/", label: t("home") },
    { to: "/schemes", label: t("browse") },
    { to: "/documents", label: t("docs") },
    { to: "/about", label: t("about") },
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-primary">Civic Nexus</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "text-primary bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "en" ? "ta" : "en")} aria-label="Switch language">
            <Languages /> {lang === "en" ? "தமிழ்" : "English"}
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            <Menu />
          </Button>
        </div>
      </div>
      {open && (
        <nav className="border-t px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-2 text-sm font-medium">
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm md:grid-cols-3">
        <div>
          <p className="font-display font-bold text-primary">Civic Nexus</p>
          <p className="mt-1 text-muted-foreground">Government Scheme & Scholarship Information Gap Detector</p>
          <p className="mt-3 text-muted-foreground">Neha · Sharin · Shreya — AIML-B, Rajalakshmi Institute of Technology</p>
        </div>
        <p className="text-muted-foreground md:col-span-2">{t("disclaimer")}</p>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        <Link to="/admin" className="hover:text-foreground">{t("admin")}</Link>
      </div>
    </footer>
  );
}
