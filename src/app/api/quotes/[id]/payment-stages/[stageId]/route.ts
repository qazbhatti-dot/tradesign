import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; stageId: string }> }) {
  const { id, stageId } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { paid } = await req.json();
  await prisma.paymentStage.updateMany({
    where: { id: stageId, quote: { businessId: biz.id } },
    data: { paidAt: paid ? new Date() : null },
  });
  return NextResponse.json({ ok: true });
}
