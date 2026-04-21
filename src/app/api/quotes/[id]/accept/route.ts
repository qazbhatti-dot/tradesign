import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateContractNumber } from "@/lib/quote-number";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, token } = await req.json();
  if (!name || !token) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote || quote.acceptToken !== token)
    return NextResponse.json({ error: "Invalid quote or token" }, { status: 404 });
  if (quote.status !== "SENT" && quote.status !== "VIEWED")
    return NextResponse.json({ error: "Quote cannot be accepted in its current state" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "unknown";
  const contractNumber = await generateContractNumber(quote.businessId);

  await prisma.$transaction([
    prisma.quote.update({
      where: { id },
      data: { status: "ACCEPTED", acceptedAt: new Date(), acceptedByName: name, acceptedByIp: ip },
    }),
    prisma.contract.create({ data: { quoteId: id, contractNumber } }),
  ]);

  return NextResponse.json({ ok: true, contractNumber });
}
