import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { reason, token } = await req.json();
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote || quote.acceptToken !== token)
    return NextResponse.json({ error: "Invalid" }, { status: 404 });
  await prisma.quote.update({
    where: { id },
    data: { status: "DECLINED", declinedAt: new Date(), declineReason: reason || null },
  });
  return NextResponse.json({ ok: true });
}
