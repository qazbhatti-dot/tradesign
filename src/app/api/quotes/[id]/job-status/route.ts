import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { jobStatus } = await req.json();
  const contract = await prisma.contract.findFirst({ where: { quote: { id, businessId: biz.id } } });
  if (!contract) return NextResponse.json({ error: "No contract" }, { status: 404 });

  await prisma.contract.update({
    where: { id: contract.id },
    data: {
      jobStatus,
      startedAt: jobStatus === "STARTED" && !contract.startedAt ? new Date() : undefined,
      completedAt: jobStatus === "COMPLETE" && !contract.completedAt ? new Date() : undefined,
    },
  });
  return NextResponse.json({ ok: true });
}
