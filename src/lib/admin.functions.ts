import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Checks official links of all schemes (HEAD, falling back to GET) and stores the HTTP status.
export const checkSchemeLinks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (!isAdmin) throw new Error("Forbidden");
    const { data: schemes, error } = await supabase.from("schemes").select("id, apply_url, official_url");
    if (error) throw new Error(error.message);

    const probe = async (url: string) => {
      for (const method of ["HEAD", "GET"]) {
        try {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 8000);
          const r = await fetch(url, { method, redirect: "follow", signal: ctrl.signal, headers: { "user-agent": "CivicNexusLinkChecker/1.0" } });
          clearTimeout(t);
          if (r.status < 400 || method === "GET") return r.status;
        } catch {
          if (method === "GET") return 0;
        }
      }
      return 0;
    };

    let broken = 0;
    const list = schemes ?? [];
    for (let i = 0; i < list.length; i += 8) {
      await Promise.all(
        list.slice(i, i + 8).map(async (s) => {
          const url = s.apply_url || s.official_url;
          if (!url) return;
          const status = await probe(url);
          if (status === 0 || status >= 400) broken++;
          await supabase.from("schemes").update({ link_status: status, link_checked_at: new Date().toISOString() }).eq("id", s.id);
        }),
      );
    }
    return { checked: list.length, broken };
  });
