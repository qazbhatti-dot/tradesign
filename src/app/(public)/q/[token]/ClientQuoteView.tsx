"use client";
import { useState } from "react";
import { toast } from "sonner";
import { formatMoney } from "@/lib/money";
import { StatusBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, BookCheck, Building2, Calendar } from "lucide-react";
import type { QuoteStatus } from "@/generated/prisma/client";

interface Props {
  quote: {
    id: string; quoteNumber: string; title: string; description: string | null;
    scopeOfWork: string | null; terms: string | null; status: QuoteStatus;
    validUntil: string | null; subtotalPence: number; vatPence: number; totalPence: number;
    acceptedByName: string | null; acceptedAt: string | null;
    contract: { contractNumber: string; formedAt: string } | null;
    client: { name: string };
    business: { name: string; email: string | null; phone: string | null; address: string | null };
    lineItems: { id: string; description: string; quantity: number; unitPence: number; vatRate: number; totalPence: number }[];
  };
  token: string;
}

export function ClientQuoteView({ quote, token }: Props) {
  const [status, setStatus] = useState(quote.status);
  const [contractNum, setContractNum] = useState(quote.contract?.contractNumber || "");
  const [accepting, setAccepting] = useState(false);
  const [declining, setDeclining] = useState(false);
  const [showAccept, setShowAccept] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const accept = async () => {
    if (!name.trim()) { toast.error("Please enter your full name"); return; }
    setAccepting(true);
    const res = await fetch(`/api/quotes/${quote.id}/accept`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), token }),
    });
    const json = await res.json();
    if (res.ok) { setStatus("ACCEPTED"); setContractNum(json.contractNumber); toast.success("Agreement confirmed!"); }
    else toast.error(json.error || "Failed");
    setAccepting(false); setShowAccept(false);
  };

  const decline = async () => {
    setDeclining(true);
    const res = await fetch(`/api/quotes/${quote.id}/decline`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason, token }),
    });
    if (res.ok) { setStatus("DECLINED"); toast.success("Quote declined"); }
    else toast.error("Failed");
    setDeclining(false); setShowDecline(false);
  };

  const canAct = status === "SENT" || status === "VIEWED";

  return (
    <div className="min-h-screen bg-[#030812] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-15"
        style={{ background: "radial-gradient(ellipse at 50% -10%,#6366f1 0%,transparent 55%)" }} />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030812]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>TS</div>
            <span className="text-sm font-bold">TradeSign</span>
          </div>
          <StatusBadge status={status} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 relative z-10 flex flex-col gap-6">
        {/* Accepted banner */}
        {status === "ACCEPTED" && (
          <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <BookCheck className="size-6 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-emerald-300 text-lg">Agreement Confirmed</p>
              <p className="text-sm text-emerald-400/80">Contract {contractNum} has been formed.</p>
              <p className="text-sm text-emerald-400/80 mt-1">
                Accepted by {quote.acceptedByName || name} · {new Date().toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
        )}
        {status === "DECLINED" && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-5">
            <XCircle className="size-6 text-red-400 flex-shrink-0" />
            <p className="text-red-300 font-medium">This quote has been declined.</p>
          </div>
        )}

        {/* Quote header */}
        <div className="rounded-xl border border-white/[0.07] p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">{quote.quoteNumber}</p>
              <h1 className="text-2xl font-bold text-white">{quote.title}</h1>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-3xl font-black text-white">{formatMoney(quote.totalPence)}</p>
              <p className="text-xs text-slate-500">inc. VAT</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Building2 className="size-4 text-slate-600" />
              <div><p className="text-xs text-slate-600">From</p><p className="text-white font-medium">{quote.business.name}</p></div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Calendar className="size-4 text-slate-600" />
              <div><p className="text-xs text-slate-600">Valid until</p>
                <p className="text-white font-medium">{quote.validUntil ? new Date(quote.validUntil).toLocaleDateString("en-GB") : "No expiry"}</p></div>
            </div>
          </div>
          {quote.description && <p className="mt-4 text-sm text-slate-300 leading-relaxed">{quote.description}</p>}
        </div>

        {/* Line items */}
        <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <div className="px-5 py-3.5 border-b border-white/[0.06]">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Price Breakdown</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.05]">
              <tr className="text-xs text-slate-500">
                <th className="text-left px-5 py-2.5 font-medium">Item</th>
                <th className="text-right px-3 py-2.5 font-medium">Qty</th>
                <th className="text-right px-3 py-2.5 font-medium">Unit</th>
                <th className="text-right px-5 py-2.5 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {quote.lineItems.map(li => (
                <tr key={li.id}>
                  <td className="px-5 py-3 text-slate-300">{li.description}</td>
                  <td className="px-3 py-3 text-right text-slate-400">{li.quantity}</td>
                  <td className="px-3 py-3 text-right text-slate-400">{formatMoney(li.unitPence)}</td>
                  <td className="px-5 py-3 text-right font-medium text-white">{formatMoney(li.totalPence)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-white/[0.08]">
              <tr><td colSpan={3} className="px-5 py-2 text-right text-sm text-slate-500">Subtotal</td><td className="px-5 py-2 text-right text-sm">{formatMoney(quote.subtotalPence)}</td></tr>
              <tr><td colSpan={3} className="px-5 py-2 text-right text-sm text-slate-500">VAT</td><td className="px-5 py-2 text-right text-sm">{formatMoney(quote.vatPence)}</td></tr>
              <tr className="border-t border-white/[0.06]"><td colSpan={3} className="px-5 py-3 text-right font-bold text-white">Total</td><td className="px-5 py-3 text-right font-bold text-white text-base">{formatMoney(quote.totalPence)}</td></tr>
            </tfoot>
          </table>
        </div>

        {/* Scope */}
        {quote.scopeOfWork && (
          <div className="rounded-xl border border-white/[0.07] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Scope of Works</h2>
            <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{quote.scopeOfWork}</pre>
          </div>
        )}

        {/* Terms */}
        {quote.terms && (
          <div className="rounded-xl border border-white/[0.07] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Terms &amp; Conditions</h2>
            <pre className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap font-sans">{quote.terms}</pre>
          </div>
        )}

        {/* CTA */}
        {canAct && !showAccept && !showDecline && (
          <div className="sticky bottom-6 flex gap-3 rounded-2xl border border-white/[0.08] p-4"
            style={{ background: "rgba(3,8,18,0.9)", backdropFilter: "blur(20px)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
            <button onClick={() => setShowAccept(true)}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
              <CheckCircle2 className="size-5" /> Accept &amp; Agree
            </button>
            <button onClick={() => setShowDecline(true)}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-3.5 text-sm font-semibold text-red-400 hover:bg-red-500/15 transition-colors">
              <XCircle className="size-4" /> Decline
            </button>
          </div>
        )}

        {/* Accept form */}
        {showAccept && (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="size-5" /> Confirm your agreement
            </div>
            <p className="text-sm text-slate-400">By entering your full name below, you are agreeing to the quote, scope of works, and terms above. This forms a binding agreement.</p>
            <div className="flex flex-col gap-1.5">
              <Label>Your full name <span className="text-emerald-400">*</span></Label>
              <Input placeholder="e.g. John Smith" value={name} onChange={e => setName(e.target.value)} className="bg-white/5" />
            </div>
            <div className="flex gap-3">
              <button onClick={accept} disabled={accepting}
                className="flex-1 rounded-xl py-3 text-sm font-semibold text-white hover:opacity-90 transition-all"
                style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
                {accepting ? "Confirming…" : "Confirm Agreement"}
              </button>
              <button onClick={() => setShowAccept(false)} className="px-4 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}

        {/* Decline form */}
        {showDecline && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 text-red-400 font-semibold"><XCircle className="size-5" /> Decline this quote</div>
            <div className="flex flex-col gap-1.5">
              <Label>Reason (optional)</Label>
              <Textarea placeholder="e.g. Price too high, not proceeding at this time" value={reason} onChange={e => setReason(e.target.value)} rows={3} />
            </div>
            <div className="flex gap-3">
              <button onClick={decline} disabled={declining}
                className="flex-1 rounded-xl border border-red-500/30 bg-red-500/15 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-colors">
                {declining ? "Declining…" : "Decline Quote"}
              </button>
              <button onClick={() => setShowDecline(false)} className="px-4 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
