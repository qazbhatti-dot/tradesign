import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateQuoteNumber } from "@/lib/quote-number";
import { poundsToPence } from "@/lib/money";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "No business" }, { status: 404 });
  const quotes = await prisma.quote.findMany({
    where: { businessId: biz.id },
    include: { client: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(quotes);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "No business" }, { status: 404 });

  const body = await req.json();
  const { clientId, newClientName, newClientEmail, title, description, scopeOfWork,
    terms, validUntil, notes, lineItems } = body;

  let resolvedClientId = clientId;
  if (!clientId && newClientName) {
    const c = await prisma.client.create({
      data: { businessId: biz.id, name: newClientName, email: newClientEmail || null },
    });
    resolvedClientId = c.id;
  }
  if (!resolvedClientId) return NextResponse.json({ error: "Client required" }, { status: 400 });

  let subtotal = 0, vatTotal = 0;
  const items = (lineItems || []).filter((l: { description: string; unitPrice: string }) => l.description && l.unitPrice);
  const preparedItems = items.map((l: { description: string; quantity: string; unitPrice: string; vatRate: string }, i: number) => {
    const qty = parseFloat(l.quantity) || 1;
    const unit = poundsToPence(l.unitPrice);
    const vat = parseFloat(l.vatRate) || 0;
    const net = Math.round(qty * unit);
    const vatAmt = Math.round(net * (vat / 100));
    subtotal += net;
    vatTotal += vatAmt;
    return { description: l.description, quantity: qty, unitPence: unit, vatRate: vat, totalPence: net + vatAmt, sortOrder: i };
  });

  const quote = await prisma.quote.create({
    data: {
      businessId: biz.id,
      clientId: resolvedClientId,
      quoteNumber: await generateQuoteNumber(biz.id),
      title, description: description || null,
      scopeOfWork: scopeOfWork || null,
      terms: terms || null,
      validUntil: validUntil ? new Date(validUntil) : null,
      notes: notes || null,
      subtotalPence: subtotal,
      vatPence: vatTotal,
      totalPence: subtotal + vatTotal,
      lineItems: { create: preparedItems },
    },
  });
  return NextResponse.json(quote);
}
