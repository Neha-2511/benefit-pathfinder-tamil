import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { importSchemes, collectFromDataGov } from "@/lib/collect.functions";
import { checkSchemeLinks } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Civic Nexus" },
      { name: "description", content: "Manage scheme data collection and view collection reports." },
      { property: "og:title", content: "Admin — Civic Nexus" },
      { property: "og:description", content: "Scheme data collection dashboard." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let cur: string[] = [], f = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { f += '"'; i++; }
      else if (c === '"') q = false;
      else f += c;
    } else if (c === '"') q = true;
    else if (c === ",") { cur.push(f); f = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      cur.push(f); f = ""; if (cur.some((x) => x.trim())) rows.push(cur); cur = [];
    } else f += c;
  }
  cur.push(f); if (cur.some((x) => x.trim())) rows.push(cur);
  const [head, ...body] = rows;
  return (body ?? []).map((r) => Object.fromEntries((head ?? []).map((h, i) => [h, r[i] ?? ""])));
}

type Run = { id: string; source: string; method: string; total_available: number | null; fetched: number; inserted: number; updated: number; unchanged: number; duplicates: number; failed: number; incomplete: number; not_applicable: number; tn_count: number; central_count: number; created_at: string };

function AdminPage() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [runs, setRuns] = useState<Run[]>([]);
  const [counts, setCounts] = useState({ total: 0, tn: 0, central: 0 });
  const [source, setSource] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [level, setLevel] = useState<"central" | "state">("state");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const { data: u } = await supabase.auth.getUser();
    const { data: ok } = await supabase.rpc("has_role", { _user_id: u.user!.id, _role: "admin" });
    setIsAdmin(!!ok);
    const { data } = await supabase.from("collection_runs").select("*").order("created_at", { ascending: false }).limit(50);
    setRuns((data ?? []) as unknown as Run[]);
    const [a, t, c] = await Promise.all([
      supabase.from("schemes").select("id", { count: "exact", head: true }),
      supabase.from("schemes").select("id", { count: "exact", head: true }).eq("level", "state"),
      supabase.from("schemes").select("id", { count: "exact", head: true }).eq("level", "central"),
    ]);
    setCounts({ total: a.count ?? 0, tn: t.count ?? 0, central: c.count ?? 0 });
  };
  useEffect(() => { load(); }, []);

  const onFile = async (file: File) => {
    if (!source.trim()) { toast.error("Enter the official source name first"); return; }
    setBusy(true);
    try {
      const text = await file.text();
      const rows = file.name.endsWith(".json") ? (JSON.parse(text) as any[]) : parseCsv(text);
      if (!Array.isArray(rows)) throw new Error("JSON must be an array of scheme objects");
      const r = await importSchemes({ data: { source: source.trim(), method: "file_import", rows } });
      toast.success(`Imported: ${r.inserted} new, ${r.updated} updated, ${r.failed} failed`);
      await load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const onApi = async () => {
    setBusy(true);
    try {
      const r = await collectFromDataGov({ data: { resourceId: resourceId.trim(), level } });
      toast.success(`Fetched ${r.fetched} of ${r.total_available ?? "?"}: ${r.inserted} new, ${r.updated} updated`);
      await load();
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  const onLinks = async () => {
    setBusy(true);
    try { const r = await checkSchemeLinks(); toast.success(`Checked ${r.checked} links, ${r.broken} broken`); }
    catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };

  if (isAdmin === null) return <div className="mx-auto max-w-5xl px-4 py-12">Loading…</div>;
  if (!isAdmin) return <div className="mx-auto max-w-5xl px-4 py-12">This account is not an administrator.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      <h1 className="text-2xl font-bold">Data collection</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {[["Schemes in database", counts.total], ["Tamil Nadu state", counts.tn], ["Central (applicable to TN)", counts.central]].map(([l, v]) => (
          <div key={l as string} className="rounded-lg border bg-card p-4"><div className="text-sm text-muted-foreground">{l}</div><div className="text-3xl font-bold">{v}</div></div>
        ))}
      </div>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="font-semibold">Import an official dataset (CSV or JSON)</h2>
        <p className="text-sm text-muted-foreground">Use files downloaded from official portals. Existing records are matched by ID, slug or name; empty values never overwrite existing details.</p>
        <div><Label htmlFor="src">Official source name</Label><Input id="src" value={source} onChange={(e) => setSource(e.target.value)} placeholder="e.g. Tamil Nadu e-District / Department of Social Welfare" /></div>
        <Input type="file" accept=".csv,.json" disabled={busy} onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
      </section>

      <section className="rounded-lg border bg-card p-5 space-y-3">
        <h2 className="font-semibold">Collect from data.gov.in (official API)</h2>
        <p className="text-sm text-muted-foreground">Pages through the whole dataset until the API's reported total is reached. Needs a data.gov.in API key.</p>
        <div className="flex flex-wrap gap-2">
          <Input className="max-w-sm" value={resourceId} onChange={(e) => setResourceId(e.target.value)} placeholder="Dataset resource ID" />
          <select className="rounded-md border bg-background px-3" value={level} onChange={(e) => setLevel(e.target.value as any)}>
            <option value="state">Tamil Nadu state</option><option value="central">Central</option>
          </select>
          <Button onClick={onApi} disabled={busy || !resourceId}>Collect</Button>
          <Button variant="outline" onClick={onLinks} disabled={busy}>Check official links</Button>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Collection report</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left"><tr>{["Date", "Source", "Available", "Fetched", "New", "Updated", "Unchanged", "TN", "Central", "Duplicates", "Failed", "Incomplete", "Not TN"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
            <tbody>
              {runs.length === 0 && <tr><td colSpan={13} className="px-3 py-6 text-center text-muted-foreground">No collection runs yet.</td></tr>}
              {runs.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2">{r.source}<div className="text-xs text-muted-foreground">{r.method}</div></td>
                  <td className="px-3 py-2">{r.total_available ?? "Not reported"}</td>
                  {[r.fetched, r.inserted, r.updated, r.unchanged, r.tn_count, r.central_count, r.duplicates, r.failed, r.incomplete, r.not_applicable].map((v, i) => <td key={i} className="px-3 py-2">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">"Available" is the total the source itself reports; collection is only complete when Fetched equals it.</p>
      </section>
    </div>
  );
}
