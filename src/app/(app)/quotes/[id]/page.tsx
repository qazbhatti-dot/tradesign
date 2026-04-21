import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import { StatusBadge } from "@/components/ui/status-badge";
import { QuoteActions } from "./QuoteActions";
import { BookCheck, Calendar, User } from "lucide-react";

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) redirect("/login");
  const quote = await prisma.quote.findFirst({
    where: { id, businessId: biz.id },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } }, contract: true },
  });
  if (!quote) notFound();

  const clientLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/q/${quote.acceptToken}`;

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">{quote.title}</h1>
            <StatusBadge status={quote.status} />
          </div>
          <p className="text-sm text-slate-400">{quote.quoteNumber} · Created {quote.createdAt.toLocaleDateString("en-GB")}</p>
        </div>
        <QuoteActions quote={quote} clientLink={clientLink} />
      </div>

      {/* Contract formed banner */}
      {quote.status === "ACCEPTED" && quote.contract && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
          <BookCheck className="size-5 text-emerald-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">Contract formed — {quote.contract.contractNumber}</p>
            <p className="text-xs text-emerald-400/70">
              Accepted by {quote.acceptedByName} on {quote.acceptedAt?.toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
      )}

      {/* Meta */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: <User className="size-4" />, label: "Client", value: quote.client.name, sub: quote.client.company || quote.client.email || "" },
          { icon: <Calendar className="size-4" />, label: "Valid Until", value: quote.validUntil ? quote.validUntil.toLocaleDateString("en-GB") : "No expiry", sub: "" },
          { icon: <BookCheck className="size-4" />, label: "Total Value", value: formatMoney(quote.totalPence), sub: `ex VAT: ${formatMoney(quote.subtotalPence)}` },
        ].map(m => (
          <div key={m.label} className="rounded-xl border border-white/[0.07] p-4" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">{m.icon} {m.label}</div>
            <p className="font-semibold text-white">{m.value}</p>
            {m.sub && <p className="text-xs text-slate-500 mt-0.5">{m.sub}</p>}
          </div>
        ))}
      </div>

      {/* Description */}
      {quote.description && (
        <div className="rounded-xl border border-white/[0.07] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Description</h2>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">{quote.description}</p>
        </div>
      )}

      {/* Line items */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="px-5 py-3.5 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Line Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="border-b border-white/[0.05]">
            <tr className="text-xs text-slate-500">
              <th className="text-left px-5 py-2.5 font-medium">Description</th>
              <th className="text-right px-3 py-2.5 font-medium">Qty</th>
              <th className="text-right px-3 py-2.5 font-medium">Unit</th>
              <th className="text-right px-3 py-2.5 font-medium">VAT</th>
              <th className="text-right px-5 py-2.5 font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {quote.lineItems.map(li => (
              <tr key={li.id}>
                <td className="px-5 py-3 text-slate-300">{li.description}</td>
                <td className="px-3 py-3 text-right text-slate-400">{Number(li.quantity)}</td>
                <td className="px-3 py-3 text-right text-slate-400">{formatMoney(li.unitPence)}</td>
                <td className="px-3 py-3 text-right text-slate-400">{Number(li.vatRate)}%</td>
                <td className="px-5 py-3 text-right font-medium text-white">{formatMoney(li.totalPence)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t border-white/[0.08]">
            <tr><td colSpan={4} className="px-5 py-2 text-right text-sm text-slate-500">Subtotal</td><td className="px-5 py-2 text-right text-sm text-white">{formatMoney(quote.subtotalPence)}</td></tr>
            <tr><td colSpan={4} className="px-5 py-2 text-right text-sm text-slate-500">VAT</td><td className="px-5 py-2 text-right text-sm text-white">{formatMoney(quote.vatPence)}</td></tr>
            <tr className="border-t border-white/[0.06]"><td colSpan={4} className="px-5 py-3 text-right font-bold text-white">Total</td><td className="px-5 py-3 text-right font-bold text-white text-base">{formatMoney(quote.totalPence)}</td></tr>
          </tfoot>
        </table>
      </div>

      {/* Scope of works */}
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

      {/* Client link */}
      {quote.status !== "ACCEPTED" && quote.status !== "DECLINED" && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-5">
          <p className="text-sm font-medium text-indigo-300 mb-2">Client agreement link</p>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-xs bg-white/5 rounded-lg px-3 py-2 text-slate-300 truncate">{clientLink}</code>
            <CopyButton text={clientLink} />
          </div>
          <p className="text-xs text-indigo-400/60 mt-2">Share this link with your client. They can review and accept without creating an account.</p>
        </div>
      )}
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  "use client";
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); }}
      className="text-xs text-indigo-400 hover:text-white border border-indigo-500/30 rounded-lg px-3 py-1.5 hover:bg-indigo-500/10 transition-colors whitespace-nowrap"
    >
      Copy link
    </button>
  );
}
