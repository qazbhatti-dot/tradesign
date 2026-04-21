import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ClientQuoteView } from "./ClientQuoteView";

export default async function ClientQuotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const quote = await prisma.quote.findUnique({
    where: { acceptToken: token },
    include: {
      client: true,
      business: { select: { name: true, email: true, phone: true, address: true } },
      lineItems: { orderBy: { sortOrder: "asc" } },
      contract: true,
    },
  });
  if (!quote) notFound();

  if (quote.status === "SENT") {
    await prisma.quote.update({ where: { id: quote.id }, data: { status: "VIEWED", viewedAt: new Date() } });
  }

  // Serialise all non-plain fields before passing to the Client Component
  const serialised = {
    id: quote.id,
    quoteNumber: quote.quoteNumber,
    title: quote.title,
    description: quote.description,
    scopeOfWork: quote.scopeOfWork,
    terms: quote.terms,
    status: quote.status,
    validUntil: quote.validUntil?.toISOString() ?? null,
    subtotalPence: quote.subtotalPence,
    vatPence: quote.vatPence,
    totalPence: quote.totalPence,
    acceptedByName: quote.acceptedByName,
    acceptedAt: quote.acceptedAt?.toISOString() ?? null,
    client: { name: quote.client.name },
    business: {
      name: quote.business.name,
      email: quote.business.email,
      phone: quote.business.phone,
      address: quote.business.address,
    },
    lineItems: quote.lineItems.map(li => ({
      id: li.id,
      description: li.description,
      quantity: Number(li.quantity),
      unitPence: li.unitPence,
      vatRate: Number(li.vatRate),
      totalPence: li.totalPence,
    })),
    contract: quote.contract
      ? { contractNumber: quote.contract.contractNumber, formedAt: quote.contract.formedAt.toISOString() }
      : null,
  };

  return <ClientQuoteView quote={serialised} token={token} />;
}
