import { Badge } from "./badge";
import type { QuoteStatus } from "@prisma/client";

const config: Record<QuoteStatus, { label: string; variant: "default" | "success" | "warning" | "destructive" | "outline" | "indigo" }> = {
  DRAFT:    { label: "Draft",    variant: "outline"     },
  SENT:     { label: "Sent",     variant: "indigo"      },
  VIEWED:   { label: "Viewed",   variant: "warning"     },
  ACCEPTED: { label: "Accepted", variant: "success"     },
  DECLINED: { label: "Declined", variant: "destructive" },
  EXPIRED:  { label: "Expired",  variant: "default"     },
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
