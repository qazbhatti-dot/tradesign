import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
import { BookCheck } from "lucide-react";
import Link from "next/link";

export default async function ContractsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) redirect("/login");
  const contracts = await prisma.contract.findMany({
    where: { quote: { businessId: biz.id } },
    include: { quote: { include: { client: true } } },
    orderBy: { formedAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contracts</h1>
        <p className="text-sm text-slate-400">{contracts.length} formed agreement{contracts.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        {contracts.length === 0 ? (
          <div className="py-20 text-center">
            <BookCheck className="size-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400">No contracts yet. Accepted quotes will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {contracts.map(c => (
              <Link key={c.id} href={`/quotes/${c.quote.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                <div>
                  <div className="flex items-center gap-2">
                    <BookCheck className="size-4 text-emerald-400" />
                    <span className="font-medium text-white">{c.quote.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{c.contractNumber} · {c.quote.client.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-white">{formatMoney(c.quote.totalPence)}</p>
                  <p className="text-xs text-slate-500">{c.formedAt.toLocaleDateString("en-GB")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
