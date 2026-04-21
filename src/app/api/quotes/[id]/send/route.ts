import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await prisma.quote.updateMany({
    where: { id, businessId: biz.id, status: "DRAFT" },
    data: { status: "SENT", sentAt: new Date() },
  });
  return NextResponse.json({ ok: true });
}
