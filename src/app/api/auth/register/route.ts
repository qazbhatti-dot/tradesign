import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { name, email, password, businessName } = await req.json();
  if (!name || !email || !password || !businessName)
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  const user = await prisma.user.create({
    data: {
      name, email: email.toLowerCase(),
      passwordHash: await hashPassword(password),
      businesses: { create: { name: businessName } },
    },
  });
  await createSession(user.id);
  return NextResponse.json({ ok: true });
}
