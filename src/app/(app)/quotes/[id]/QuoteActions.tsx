"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { QuoteStatus } from "@/generated/prisma/client";

interface QuoteActionsProps {
  quoteId: string;
  status: QuoteStatus;
}

export function QuoteActions({ quoteId, status }: QuoteActionsProps) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const markSent = async () => {
    setSending(true);
    const res = await fetch(`/api/quotes/${quoteId}/send`, { method: "POST" });
    if (res.ok) { toast.success("Quote marked as sent"); router.refresh(); }
    else toast.error("Failed to update");
    setSending(false);
  };

  const deleteQuote = async () => {
    if (!confirm("Delete this quote?")) return;
    setDeleting(true);
    const res = await fetch(`/api/quotes/${quoteId}`, { method: "DELETE" });
    if (res.ok) { toast.success("Quote deleted"); router.push("/quotes"); }
    else toast.error("Failed to delete");
    setDeleting(false);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link href="/quotes"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" />Back</Button></Link>
      {status === "DRAFT" && (
        <Button size="sm" onClick={markSent} disabled={sending}>
          <Send className="size-4 mr-1.5" />{sending ? "Saving…" : "Mark as Sent"}
        </Button>
      )}
      {(status === "DRAFT" || status === "EXPIRED") && (
        <Button size="sm" variant="destructive" onClick={deleteQuote} disabled={deleting}>
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
