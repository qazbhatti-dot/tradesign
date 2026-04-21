import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/money";
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

  return (
    <ClientQuoteView
      quote={{ ...quote, lineItems: quote.lineItems.map(li => ({ ...li, quantity: Number(li.quantity), vatRate: Number(li.vatRate) })) }}
      token={token}
    />
  );
}
