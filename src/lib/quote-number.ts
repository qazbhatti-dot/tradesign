import { prisma } from "@/lib/prisma";

export async function generateQuoteNumber(businessId: string): Promise<string> {
  const count = await prisma.quote.count({ where: { businessId } });
  const year = new Date().getFullYear().toString().slice(2);
  return `Q${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function generateContractNumber(businessId: string): Promise<string> {
  const count = await prisma.contract.count({
    where: { quote: { businessId } },
  });
  const year = new Date().getFullYear().toString().slice(2);
  return `C${year}-${String(count + 1).padStart(4, "0")}`;
}
