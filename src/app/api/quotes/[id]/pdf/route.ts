import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ReactPDF from "@react-pdf/renderer";
import { QuotePDF } from "@/components/pdf/QuotePDF";
import React from "react";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const quote = await prisma.quote.findFirst({
    where: { id, businessId: biz.id },
    include: { client: true, lineItems: { orderBy: { sortOrder: "asc" } } },
  });
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data = {
    quoteNumber: quote.quoteNumber,
    title: quote.title,
    description: quote.description,
    scopeOfWork: quote.scopeOfWork,
    terms: quote.terms,
    validUntil: quote.validUntil?.toLocaleDateString("en-GB") ?? null,
    createdAt: quote.createdAt.toLocaleDateString("en-GB"),
    subtotalPence: quote.subtotalPence,
    vatPence: quote.vatPence,
    totalPence: quote.totalPence,
    client: { name: quote.client.name, email: quote.client.email, phone: quote.client.phone, address: quote.client.address, company: quote.client.company },
    business: { name: biz.name, email: biz.email, phone: biz.phone, address: biz.address, vatNumber: biz.vatNumber },
    lineItems: quote.lineItems.map(li => ({
      description: li.description,
      quantity: Number(li.quantity),
      unitPence: li.unitPence,
      vatRate: Number(li.vatRate),
      totalPence: li.totalPence,
    })),
  };

  const stream = await ReactPDF.renderToStream(React.createElement(QuotePDF, { quote: data }));

  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const pdf = Buffer.concat(chunks);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${quote.quoteNumber}.pdf"`,
    },
  });
}
