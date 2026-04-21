"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { QuoteStatus } from "@prisma/client";

interface Quote { id: string; status: QuoteStatus }

export function QuoteActions({ quote, clientLink }: { quote: Quote; clientLink: string }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const markSent = async () => {
    setSending(true);
    const res = await fetch(`/api/quotes/${quote.id}/send`, { method: "POST" });
    if (res.ok) { toast.success("Quote marked as sent"); router.refresh(); }
    else toast.error("Failed");
    setSending(false);
  };

  const deleteQuote = async () => {
    if (!confirm("Delete this quote?")) return;
    setDeleting(true);
    const res = await fetch(`/api/quotes/${quote.id}`, { method: "DELETE" });
    if (res.ok) { toast.success("Deleted"); router.push("/quotes"); }
    else toast.error("Failed");
    setDeleting(false);
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Link href="/quotes"><Button variant="ghost" size="sm"><ArrowLeft className="size-4 mr-1" /> Back</Button></Link>
      {quote.status === "DRAFT" && (
        <Button size="sm" onClick={markSent} disabled={sending}>
          <Send className="size-4 mr-1.5" />{sending ? "Sending…" : "Mark as Sent"}
        </Button>
      )}
      {(quote.status === "DRAFT" || quote.status === "EXPIRED") && (
        <Button size="sm" variant="destructive" onClick={deleteQuote} disabled={deleting}>
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
