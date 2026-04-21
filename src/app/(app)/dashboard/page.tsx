import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import { StatusBadge } from "@/components/ui/status-badge";
import { FileText, BookCheck, Users, TrendingUp, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) redirect("/login");

  const [quotes, acceptedCount, clientCount, recentQuotes] = await Promise.all([
    prisma.quote.count({ where: { businessId: biz.id } }),
    prisma.quote.count({ where: { businessId: biz.id, status: "ACCEPTED" } }),
    prisma.client.count({ where: { businessId: biz.id } }),
    prisma.quote.findMany({
      where: { businessId: biz.id },
      include: { client: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  const totalAcceptedValue = await prisma.quote.aggregate({
    where: { businessId: biz.id, status: "ACCEPTED" },
    _sum: { totalPence: true },
  });

  const stats = [
    { label: "Total Quotes", value: quotes, icon: <FileText className="size-5" />, color: "#6366f1" },
    { label: "Accepted", value: acceptedCount, icon: <BookCheck className="size-5" />, color: "#10b981" },
    { label: "Clients", value: clientCount, icon: <Users className="size-5" />, color: "#38bdf8" },
    { label: "Agreed Value", value: formatMoney(totalAcceptedValue._sum.totalPence ?? 0), icon: <TrendingUp className="size-5" />, color: "#f59e0b" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">Welcome back, {session.name.split(" ")[0]}</p>
        </div>
        <Link href="/quotes/new"
          className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
          <Plus className="size-4" /> New Quote
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-xl border border-white/[0.07] p-5"
            style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-500 font-medium">{s.label}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg"
                style={{ backgroundColor: s.color + "20", color: s.color }}>{s.icon}</div>
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Recent quotes */}
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="font-semibold text-white">Recent Quotes</h2>
          <Link href="/quotes" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
            View all <ArrowRight className="size-3" />
          </Link>
        </div>
        {recentQuotes.length === 0 ? (
          <div className="py-16 text-center">
            <FileText className="size-10 mx-auto mb-3 text-slate-700" />
            <p className="text-slate-500 mb-4">No quotes yet</p>
            <Link href="/quotes/new"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
              <Plus className="size-4" /> Create your first quote
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentQuotes.map(q => (
              <Link key={q.id} href={`/quotes/${q.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-medium text-white">{q.title}</span>
                  <span className="text-xs text-slate-500">{q.quoteNumber} · {q.client.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-white">{formatMoney(q.totalPence)}</span>
                  <StatusBadge status={q.status} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
