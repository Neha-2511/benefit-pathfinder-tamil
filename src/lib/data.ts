import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Scheme = Tables<"schemes">;
export type DocumentGuide = Tables<"documents">;
export type SchemeDoc = { reason: string | null; mandatory: boolean; documents: DocumentGuide };

async function fetchAll<T>(table: "schemes" | "documents"): Promise<T[]> {
  const out: T[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from(table).select("*").order("name").range(from, from + 999);
    if (error) throw error;
    out.push(...((data ?? []) as T[]));
    if (!data || data.length < 1000) break;
  }
  return out;
}

export const schemesQuery = () =>
  queryOptions({ queryKey: ["schemes"], queryFn: () => fetchAll<Scheme>("schemes") });

export const documentsQuery = () =>
  queryOptions({ queryKey: ["documents"], queryFn: () => fetchAll<DocumentGuide>("documents") });

export const schemeDetailQuery = (slug: string) =>
  queryOptions({
    queryKey: ["scheme", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("schemes").select("*").eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!data) return null;
      const { data: docs, error: e2 } = await supabase
        .from("scheme_documents")
        .select("reason, mandatory, documents(*)")
        .eq("scheme_id", data.id);
      if (e2) throw e2;
      return { scheme: data, docs: (docs ?? []) as unknown as SchemeDoc[] };
    },
  });
