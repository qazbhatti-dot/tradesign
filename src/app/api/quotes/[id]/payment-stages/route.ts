import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quote = await prisma.quote.findFirst({ where: { id, businessId: biz.id } });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { stages } = await req.json();
  await prisma.paymentStage.deleteMany({ where: { quoteId: id } });
  if (stages?.length) {
    await prisma.paymentStage.createMany({
      data: stages.map((s: { description: string; amountPence: number; dueDate?: string }, i: number) => ({
        quoteId: id,
        description: s.description,
        amountPence: s.amountPence,
        dueDate: s.dueDate ? new Date(s.dueDate) : null,
        sortOrder: i,
      })),
    });
  }
  return NextResponse.json({ ok: true });
}
