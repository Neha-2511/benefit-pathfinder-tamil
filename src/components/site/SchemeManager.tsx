import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CATEGORIES } from "@/lib/taxonomy";
import { slugify } from "@/lib/ingest";
import { findDuplicates, outdatedReasons } from "@/lib/quality";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type S = Tables<"schemes">;
const PAGE = 25;
const FIELDS: [keyof S, string, "text" | "area"][] = [
  ["name", "Scheme name", "text"], ["description", "Description", "area"], ["eligibility_text", "Eligibility criteria", "area"],
  ["benefits", "Benefits", "area"], ["application_process", "Application procedure", "area"],
  ["apply_url", "Official application URL", "text"], ["official_url", "Official website", "text"], ["source_url", "Source URL", "text"],
  ["source_name", "Source name", "text"], ["department", "Department", "text"], ["last_verified", "Last verified (YYYY-MM-DD)", "text"],
];

export function SchemeManager() {
  const [all, setAll] = useState<S[]>([]);
  const [q, setQ] = useState("");
  const [view, setView] = useState<"all" | "dupes" | "outdated">("all");
  const [page, setPage] = useState(0);
  const [edit, setEdit] = useState<Partial<S> | null>(null);

  const load = async () => {
    const out: S[] = [];
    for (let from = 0; ; from += 1000) {
      const { data } = await supabase.from("schemes").select("*").order("name").range(from, from + 999);
      out.push(...(data ?? []));
      if (!data || data.length < 1000) break;
    }
    setAll(out);
  };
  useEffect(() => { load(); }, []);

  const dupeIds = useMemo(() => new Set(findDuplicates(all).flat().map((s) => s.id)), [all]);
  const list = all.filter((s) =>
    (view === "all" || (view === "dupes" ? dupeIds.has(s.id) : outdatedReasons(s).length > 0)) &&
    (!q || s.name.toLowerCase().includes(q.toLowerCase())));
  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const shown = list.slice(page * PAGE, page * PAGE + PAGE);

  const update = async (id: string, patch: Partial<S>, msg: string) => {
    const { error } = await supabase.from("schemes").update(patch).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(msg); load();
  };

  const save = async () => {
    if (!edit?.name?.trim()) { toast.error("Scheme name is required"); return; }
    const row: any = { ...edit };
    for (const k of Object.keys(row)) if (row[k] === "") row[k] = null;
    row.states = row.level === "state" ? ["Tamil Nadu"] : null;
    const { error } = edit.id
      ? await supabase.from("schemes").update(row).eq("id", edit.id)
      : await supabase.from("schemes").insert({ ...row, slug: `${slugify(row.name)}-${Math.random().toString(36).slice(2, 6)}` });
    if (error) { toast.error(error.message); return; }
    toast.success("Saved"); setEdit(null); load();
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold">Manage schemes ({all.length})</h2>
        <Button onClick={() => setEdit({ level: "central", category: "other", status: "needs_verification" })}>Add scheme</Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Input className="max-w-xs" placeholder="Search by name" value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} />
        {([["all", "All"], ["dupes", `Possible duplicates (${dupeIds.size})`], ["outdated", "Outdated"]] as const).map(([v, l]) => (
          <Button key={v} variant={view === v ? "default" : "outline"} size="sm" onClick={() => { setView(v); setPage(0); }}>{l}</Button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Name", "Level", "Status", "Last verified", "Issues", ""].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No schemes here.</td></tr>}
            {shown.map((s) => {
              const issues = [...(dupeIds.has(s.id) ? ["Possible duplicate"] : []), ...outdatedReasons(s)];
              return (
                <tr key={s.id} className="border-t align-top">
                  <td className="px-3 py-2 font-medium">{s.name}{s.is_sample && <div className="text-xs text-muted-foreground">Sample</div>}</td>
                  <td className="px-3 py-2">{s.level === "state" ? "Tamil Nadu" : "Central"}</td>
                  <td className="px-3 py-2">{s.status}</td>
                  <td className="px-3 py-2">{s.last_verified ?? "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{issues.join(", ") || "—"}</td>
                  <td className="space-x-1 whitespace-nowrap px-3 py-2">
                    <Button size="sm" variant="outline" onClick={() => setEdit(s)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => update(s.id, { status: "active", last_verified: new Date().toISOString().slice(0, 10) }, "Marked verified")}>Verify</Button>
                    {s.status !== "discontinued"
                      ? <Button size="sm" variant="outline" onClick={() => update(s.id, { status: "discontinued" }, "Deactivated")}>Deactivate</Button>
                      : <Button size="sm" variant="outline" onClick={() => update(s.id, { status: "needs_verification" }, "Reactivated")}>Reactivate</Button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
        <span>Page {page + 1} of {pages}</span>
        <Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Next</Button>
      </div>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader><DialogTitle>{edit?.id ? "Edit scheme" : "Add scheme"}</DialogTitle></DialogHeader>
          {edit && (
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div><Label>Category</Label>
                  <select className="h-9 w-full rounded-md border bg-background px-2" value={edit.category ?? "other"} onChange={(e) => setEdit({ ...edit, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.en}</option>)}<option value="other">Other</option>
                  </select></div>
                <div><Label>State</Label>
                  <select className="h-9 w-full rounded-md border bg-background px-2" value={edit.level ?? "central"} onChange={(e) => setEdit({ ...edit, level: e.target.value })}>
                    <option value="central">Central (all India)</option><option value="state">Tamil Nadu</option>
                  </select></div>
                <div><Label>Status</Label>
                  <select className="h-9 w-full rounded-md border bg-background px-2" value={edit.status ?? "needs_verification"} onChange={(e) => setEdit({ ...edit, status: e.target.value as S["status"] })}>
                    {["active", "needs_verification", "expired", "discontinued"].map((v) => <option key={v} value={v}>{v}</option>)}
                  </select></div>
              </div>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!edit.is_scholarship} onChange={(e) => setEdit({ ...edit, is_scholarship: e.target.checked })} /> Scholarship</label>
              {FIELDS.map(([k, l, t]) => (
                <div key={k}><Label>{l}</Label>
                  {t === "area"
                    ? <Textarea rows={3} value={(edit[k] as string) ?? ""} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />
                    : <Input value={(edit[k] as string) ?? ""} onChange={(e) => setEdit({ ...edit, [k]: e.target.value })} />}
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Only enter details copied from an official government source. Required documents are linked through bulk import (a "documents" column).</p>
              <Button onClick={save}>Save</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
