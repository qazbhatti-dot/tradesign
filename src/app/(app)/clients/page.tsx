import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) redirect("/login");
  const clients = await prisma.client.findMany({
    where: { businessId: biz.id },
    include: { _count: { select: { quotes: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <p className="text-sm text-slate-400">{clients.length} client{clients.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
        {clients.length === 0 ? (
          <div className="py-20 text-center">
            <Users className="size-12 mx-auto mb-4 text-slate-700" />
            <p className="text-slate-400">No clients yet. They are added when you create a quote.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {clients.map(c => (
              <div key={c.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="font-medium text-white">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.company || c.email || "No details"}</p>
                </div>
                <Link href={`/quotes?client=${c.id}`} className="text-xs text-emerald-400 hover:underline">
                  {c._count.quotes} quote{c._count.quotes !== 1 ? "s" : ""}
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
