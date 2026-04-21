import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const biz = await prisma.business.findFirst({ where: { userId: session.id } });
  if (!biz) return NextResponse.json([]);
  const clients = await prisma.client.findMany({
    where: { businessId: biz.id },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(clients);
}
