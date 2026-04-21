import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import { StatusBadge } from "@/components/ui/status-badge";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";

export default async function QuotesPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) redirect("/login");
  const quotes = await prisma.quote.findMany({
    where: { businessId: biz.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quotes</h1>
          <p className="text-sm text-slate-400">{quotes.length} quote{quotes.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/quotes/new"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white hover:opacity-90 transition-all"
          style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
          <Plus className="size-4" /> New Quote
        </Link>
      </div>

      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        {quotes.length === 0 ? (
          <div className="py-20 text-center">
            <FileText className="size-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400 mb-4">No quotes yet. Create your first one.</p>
            <Link href="/quotes/new"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
              <Plus className="size-4" /> New Quote
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-0 border-b border-white/[0.06] px-5 py-2.5">
              {["Job", "Client", "Total", "Status", "Date"].map(h => (
                <span key={h} className="text-xs font-medium text-slate-500">{h}</span>
              ))}
            </div>
            <div className="divide-y divide-white/[0.04]">
              {quotes.map(q => (
                <Link key={q.id} href={`/quotes/${q.id}`}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-0 items-center px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <p className="text-sm font-medium text-white">{q.title}</p>
                    <p className="text-xs text-slate-500">{q.quoteNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-300">{q.client.name}</p>
                    {q.client.company && <p className="text-xs text-slate-500">{q.client.company}</p>}
                  </div>
                  <span className="text-sm font-semibold text-white pr-6">{formatMoney(q.totalPence)}</span>
                  <span className="pr-6"><StatusBadge status={q.status} /></span>
                  <span className="text-xs text-slate-500">{q.createdAt.toLocaleDateString("en-GB")}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
