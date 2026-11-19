import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { documentsQuery } from "@/lib/data";
import { DocGuide } from "./schemes.$slug";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/documents")({
  loader: ({ context }) => context.queryClient.ensureQueryData(documentsQuery()),
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "How to Get Certificates & Documents — Civic Nexus" },
      { name: "description", content: "Step-by-step help to obtain income, community, nativity and other certificates in Tamil Nadu." },
      { property: "og:title", content: "Document Help — Civic Nexus" },
      { property: "og:description", content: "Where and how to apply for the documents schemes ask for." },
    ],
  }),
  component: DocsPage,
});

function DocsPage() {
  const { data } = useSuspenseQuery(documentsQuery());
  const { lang, t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold">{t("documentHelp")}</h1>
      <p className="mt-2 text-muted-foreground">{t("documentHelpSub")}</p>
      <Accordion type="single" collapsible className="mt-6 rounded-xl border bg-card px-4">
        {data.map((d) => {
          const docName =
            lang === "ta" && (d as any).name_ta ? `${(d as any).name_ta} (${d.name})` :
            lang === "ml" && (d as any).name_ml ? `${(d as any).name_ml} (${d.name})` :
            lang === "hi" && (d as any).name_hi ? `${(d as any).name_hi} (${d.name})` :
            d.name;
          return (
            <AccordionItem key={d.id} value={d.code}>
              <AccordionTrigger className="text-left font-semibold">{docName}</AccordionTrigger>
              <AccordionContent><DocGuide d={{ reason: null, mandatory: true, documents: d }} /></AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
