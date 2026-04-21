import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function seed() {
  await prisma.contract.deleteMany();
  await prisma.quoteLineItem.deleteMany();
  await prisma.quote.deleteMany();
  await prisma.client.deleteMany();
  await prisma.business.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("Demo1234!", 12);
  const user = await prisma.user.create({
    data: {
      name: "James Smith",
      email: "demo@tradesign.app",
      passwordHash: hash,
      businesses: {
        create: {
          name: "Smith Building Services",
          email: "james@smithbuilding.co.uk",
          phone: "07700 900123",
          address: "14 Builder Way, Manchester M1 2AB",
          defaultTerms: "50% deposit required before works commence. Balance due within 14 days of completion.\nAll materials remain property of Smith Building Services until paid in full.\nVariations must be agreed in writing.",
          clients: {
            create: [
              { name: "Mr & Mrs Johnson", email: "johnson@example.com", phone: "07700 900456", address: "22 Oak Avenue, Manchester M14 5HQ" },
              { name: "Greenfield Developments", email: "info@greenfield.co.uk", phone: "0161 234 5678", company: "Greenfield Developments Ltd" },
              { name: "Sarah Thompson", email: "sarah.t@example.com", phone: "07700 900789", address: "8 Maple Close, Stockport SK1 3AA" },
            ],
          },
        },
      },
    },
    include: { businesses: { include: { clients: true } } },
  });

  const biz = user.businesses[0];
  const [c1, c2, c3] = biz.clients;

  // Quote 1 – Accepted → Contract formed
  await prisma.quote.create({
    data: {
      businessId: biz.id, clientId: c1.id,
      quoteNumber: "Q25-0001", title: "Kitchen Extension – 22 Oak Avenue",
      description: "Full rear kitchen extension including structural works, roofing, windows, and finishing.",
      scopeOfWork: "Work included:\n• Strip out existing rear wall and foundations\n• New brick extension 4m x 3m\n• Flat roof with EPDM membrane\n• 3x double-glazed windows + 1x bi-fold door\n• Plastering, screed floor\n• First fix electrics and plumbing\n\nWork NOT included:\n• Kitchen units and fitting\n• Electrical second fix\n• Decoration",
      terms: biz.defaultTerms,
      status: "ACCEPTED",
      validUntil: new Date("2025-03-31"),
      subtotalPence: 1875000, vatPence: 375000, totalPence: 2250000,
      sentAt: new Date("2025-01-10"), viewedAt: new Date("2025-01-12"),
      acceptedAt: new Date("2025-01-15"), acceptedByName: "David Johnson", acceptedByIp: "82.45.123.67",
      lineItems: {
        create: [
          { description: "Demolition & groundworks", quantity: 1, unitPence: 350000, vatRate: 20, totalPence: 420000, sortOrder: 0 },
          { description: "Brickwork & blockwork (materials + labour)", quantity: 1, unitPence: 680000, vatRate: 20, totalPence: 816000, sortOrder: 1 },
          { description: "Flat roof – EPDM membrane", quantity: 1, unitPence: 280000, vatRate: 20, totalPence: 336000, sortOrder: 2 },
          { description: "Windows & bi-fold door (supply + fit)", quantity: 1, unitPence: 420000, vatRate: 20, totalPence: 504000, sortOrder: 3 },
          { description: "Plastering & screed floor", quantity: 1, unitPence: 145000, vatRate: 20, totalPence: 174000, sortOrder: 4 },
        ],
      },
      contract: { create: { contractNumber: "C25-0001", formedAt: new Date("2025-01-15") } },
    },
  });

  // Quote 2 – Sent (awaiting client)
  await prisma.quote.create({
    data: {
      businessId: biz.id, clientId: c2.id,
      quoteNumber: "Q25-0002", title: "Commercial Roof Repair – Business Park Units 3 & 4",
      description: "Repair and waterproofing of flat roof sections on units 3 and 4.",
      scopeOfWork: "Work included:\n• Inspect and map all defective areas\n• Remove failing felt sections\n• Apply new 3-layer felt system with torch-on finish\n• Replace all lead flashings\n• Clear gutters and downpipes\n\nWork NOT included:\n• Internal water damage repairs\n• Structural repairs to roof deck",
      terms: biz.defaultTerms,
      status: "SENT",
      validUntil: new Date("2025-05-30"),
      subtotalPence: 540000, vatPence: 108000, totalPence: 648000,
      sentAt: new Date("2025-04-18"),
      lineItems: {
        create: [
          { description: "Scaffolding & access (2 days)", quantity: 1, unitPence: 85000, vatRate: 20, totalPence: 102000, sortOrder: 0 },
          { description: "Strip and relay felt – Unit 3 (180m²)", quantity: 180, unitPence: 1200, vatRate: 20, totalPence: 259200, sortOrder: 1 },
          { description: "Strip and relay felt – Unit 4 (120m²)", quantity: 120, unitPence: 1200, vatRate: 20, totalPence: 172800, sortOrder: 2 },
          { description: "Lead flashings (supply + fit)", quantity: 1, unitPence: 114000, vatRate: 20, totalPence: 114000, sortOrder: 3 },
        ],
      },
    },
  });

  // Quote 3 – Draft
  await prisma.quote.create({
    data: {
      businessId: biz.id, clientId: c3.id,
      quoteNumber: "Q25-0003", title: "Bathroom Renovation – 8 Maple Close",
      description: "Full bathroom strip-out and refit including tiling, sanitaryware, and wet room.",
      scopeOfWork: "Work included:\n• Full strip out of existing bathroom\n• Waterproofing/tanking of wet room area\n• Supply and install sanitaryware (customer choice, up to £1,200 budget)\n• Wall and floor tiling\n• Plumbing connections\n• Heated towel rail installation\n\nWork NOT included:\n• Electrical works\n• Plastering\n• Decoration",
      terms: biz.defaultTerms,
      status: "DRAFT",
      validUntil: new Date("2025-05-15"),
      subtotalPence: 320000, vatPence: 64000, totalPence: 384000,
      lineItems: {
        create: [
          { description: "Strip out and disposal", quantity: 1, unitPence: 45000, vatRate: 20, totalPence: 54000, sortOrder: 0 },
          { description: "Wet room tanking", quantity: 1, unitPence: 65000, vatRate: 20, totalPence: 78000, sortOrder: 1 },
          { description: "Sanitaryware supply & fit", quantity: 1, unitPence: 120000, vatRate: 20, totalPence: 144000, sortOrder: 2 },
          { description: "Wall & floor tiling (materials + labour)", quantity: 1, unitPence: 90000, vatRate: 20, totalPence: 108000, sortOrder: 3 },
        ],
      },
    },
  });

  console.log("✅  Demo account seeded");
  console.log("    Email:    demo@tradesign.app");
  console.log("    Password: Demo1234!");
  await prisma.$disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
