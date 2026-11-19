import { Link } from "@tanstack/react-router";
import { ChevronDown, Landmark, Menu } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useI18n, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "ta", label: "தமிழ்" },
  { value: "ml", label: "മലയാളം" },
  { value: "hi", label: "हिन्दी" },
];

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // close lang dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const links = [
    { to: "/",         label: t("home") },
    { to: "/schemes",  label: t("browse") },
    { to: "/documents",label: t("docs") },
    { to: "/about",    label: t("about") },
  ] as const;

  const currentLang = LANG_OPTIONS.find((o) => o.value === lang)!;

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Landmark className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold text-primary">Civic Nexus</span>
        </Link>

        {/* Desktop nav */}
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

        {/* Right side: lang selector + mobile menu */}
        <div className="flex items-center gap-2">
          {/* Language dropdown */}
          <div ref={langRef} className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Select language"
              className="flex items-center gap-1"
            >
              {currentLang.label}
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </Button>
            {langOpen && (
              <div className="absolute right-0 mt-1 min-w-[8rem] rounded-lg border bg-card shadow-lg z-50">
                {LANG_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setLang(opt.value); setLangOpen(false); }}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-sm text-left hover:bg-accent ${
                      lang === opt.value ? "font-semibold text-primary" : "text-foreground"
                    }`}
                  >
                    {opt.label}
                    {lang === opt.value && <span className="ml-auto text-teal">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <Menu />
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="border-t px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium"
            >
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
          <p className="mt-1 text-muted-foreground">{t("footerDesc")}</p>
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
