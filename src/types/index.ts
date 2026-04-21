import type { QuoteStatus } from "@prisma/client";

export type { QuoteStatus };

export interface QuoteWithRelations {
  id: string;
  quoteNumber: string;
  title: string;
  status: QuoteStatus;
  totalPence: number;
  createdAt: Date;
  validUntil: Date | null;
  client: { id: string; name: string; email: string | null; company: string | null };
  _count?: { lineItems: number };
}

export interface LineItemInput {
  description: string;
  quantity: number;
  unitPence: number;
  vatRate: number;
  totalPence: number;
  sortOrder: number;
}
