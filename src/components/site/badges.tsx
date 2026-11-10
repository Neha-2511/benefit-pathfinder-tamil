import { cn } from "@/lib/utils";
import type { MatchLabel } from "@/lib/matching";
import { GAP_LABEL, type GapStatus } from "@/lib/gaps";
import { useI18n } from "@/lib/i18n";
import { CheckCircle2, HelpCircle, XCircle } from "lucide-react";

export function MatchBadge({ label }: { label: MatchLabel }) {
  const { t } = useI18n();
  const map = {
    eligible: { cls: "bg-success-soft text-success", icon: CheckCircle2, txt: t("potentially") },
    more_info: { cls: "bg-warning-soft text-warning", icon: HelpCircle, txt: t("moreInfo") },
    not_meet: { cls: "bg-danger-soft text-destructive", icon: XCircle, txt: t("notMeet") },
  }[label];
  const Icon = map.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", map.cls)}>
      <Icon className="h-3.5 w-3.5" /> {map.txt}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-success-soft text-success",
    needs_verification: "bg-warning-soft text-warning",
    expired: "bg-danger-soft text-destructive",
    discontinued: "bg-muted text-muted-foreground",
  };
  const txt: Record<string, string> = {
    active: "Active",
    needs_verification: "Details pending re-verification",
    expired: "Expired",
    discontinued: "Discontinued",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", map[status])}>{txt[status] ?? status}</span>;
}

export function GapPill({ status }: { status: GapStatus }) {
  const map: Record<GapStatus, string> = {
    complete: "bg-success-soft text-success",
    incomplete: "bg-warning-soft text-warning",
    needs_verification: "bg-accent text-accent-foreground",
    outdated: "bg-danger-soft text-destructive",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", map[status])}>{GAP_LABEL[status]}</span>;
}
