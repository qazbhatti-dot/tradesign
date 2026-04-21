import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const fmt = (pence: number) => "£" + (pence / 100).toFixed(2);

const s = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#1e293b", padding: 40, backgroundColor: "#ffffff" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28 },
  logo: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#10b981" },
  bizName: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 2 },
  muted: { color: "#64748b", fontSize: 8 },
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 4 },
  quoteNum: { fontSize: 9, color: "#64748b", marginBottom: 12 },
  section: { marginBottom: 16 },
  sectionTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#64748b", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  grid2: { flexDirection: "row", gap: 16 },
  card: { flex: 1, backgroundColor: "#f8fafc", borderRadius: 4, padding: 10 },
  cardLabel: { fontSize: 7, color: "#94a3b8", marginBottom: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  cardValue: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  cardSub: { fontSize: 8, color: "#64748b" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f1f5f9", borderRadius: 3, padding: "5 8", marginBottom: 2 },
  tableRow: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#f1f5f9", padding: "5 8" },
  colDesc: { flex: 3, color: "#334155" },
  colRight: { flex: 1, textAlign: "right", color: "#334155" },
  colHeaderRight: { flex: 1, textAlign: "right", color: "#64748b", fontSize: 8, fontFamily: "Helvetica-Bold" },
  colHeader: { flex: 3, color: "#64748b", fontSize: 8, fontFamily: "Helvetica-Bold" },
  totalsRow: { flexDirection: "row", justifyContent: "flex-end", padding: "3 8" },
  totalsLabel: { width: 80, textAlign: "right", color: "#64748b" },
  totalsValue: { width: 70, textAlign: "right" },
  totalsBold: { width: 70, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#0f172a", fontSize: 10 },
  totalsBoldLabel: { width: 80, textAlign: "right", fontFamily: "Helvetica-Bold", color: "#0f172a", fontSize: 10 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginBottom: 4, marginTop: 4 },
  pre: { fontFamily: "Courier", fontSize: 8, color: "#334155", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 28, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7, color: "#94a3b8" },
  accentBar: { height: 3, backgroundColor: "#10b981", borderRadius: 2, marginBottom: 24 },
});

interface QuoteData {
  quoteNumber: string; title: string; description: string | null;
  scopeOfWork: string | null; terms: string | null;
  validUntil: string | null; createdAt: string;
  subtotalPence: number; vatPence: number; totalPence: number;
  client: { name: string; email: string | null; phone: string | null; address: string | null; company: string | null };
  business: { name: string; email: string | null; phone: string | null; address: string | null; vatNumber: string | null };
  lineItems: { description: string; quantity: number; unitPence: number; vatRate: number; totalPence: number }[];
}

export function QuotePDF({ quote }: { quote: QuoteData }) {
  return (
    <Document title={`${quote.quoteNumber} – ${quote.title}`}>
      <Page size="A4" style={s.page}>
        <View style={s.accentBar} />

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>TradeSign</Text>
            <Text style={[s.muted, { marginTop: 2 }]}>Professional quoting &amp; contracting</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.bizName}>{quote.business.name}</Text>
            {quote.business.address && <Text style={s.muted}>{quote.business.address}</Text>}
            {quote.business.phone && <Text style={s.muted}>{quote.business.phone}</Text>}
            {quote.business.email && <Text style={s.muted}>{quote.business.email}</Text>}
            {quote.business.vatNumber && <Text style={s.muted}>VAT: {quote.business.vatNumber}</Text>}
          </View>
        </View>

        {/* Title */}
        <Text style={s.h1}>{quote.title}</Text>
        <Text style={s.quoteNum}>{quote.quoteNumber} · Issued {quote.createdAt}</Text>

        {/* Client + Meta */}
        <View style={[s.grid2, s.section]}>
          <View style={s.card}>
            <Text style={s.cardLabel}>Prepared for</Text>
            <Text style={s.cardValue}>{quote.client.name}</Text>
            {quote.client.company && <Text style={s.cardSub}>{quote.client.company}</Text>}
            {quote.client.email && <Text style={s.cardSub}>{quote.client.email}</Text>}
            {quote.client.phone && <Text style={s.cardSub}>{quote.client.phone}</Text>}
            {quote.client.address && <Text style={s.cardSub}>{quote.client.address}</Text>}
          </View>
          <View style={s.card}>
            <Text style={s.cardLabel}>Quote total</Text>
            <Text style={[s.cardValue, { fontSize: 14, color: "#10b981" }]}>{fmt(quote.totalPence)}</Text>
            <Text style={s.cardSub}>inc. VAT</Text>
            {quote.validUntil && (
              <>
                <Text style={[s.cardLabel, { marginTop: 8 }]}>Valid until</Text>
                <Text style={s.cardValue}>{quote.validUntil}</Text>
              </>
            )}
          </View>
        </View>

        {quote.description && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Description</Text>
            <Text style={{ color: "#334155", lineHeight: 1.5 }}>{quote.description}</Text>
          </View>
        )}

        {/* Line items */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Price Breakdown</Text>
          <View style={s.tableHeader}>
            <Text style={s.colHeader}>Item</Text>
            <Text style={s.colHeaderRight}>Qty</Text>
            <Text style={s.colHeaderRight}>Unit</Text>
            <Text style={s.colHeaderRight}>VAT</Text>
            <Text style={s.colHeaderRight}>Total</Text>
          </View>
          {quote.lineItems.map((li, i) => (
            <View key={i} style={s.tableRow}>
              <Text style={s.colDesc}>{li.description}</Text>
              <Text style={s.colRight}>{li.quantity}</Text>
              <Text style={s.colRight}>{fmt(li.unitPence)}</Text>
              <Text style={s.colRight}>{li.vatRate}%</Text>
              <Text style={[s.colRight, { fontFamily: "Helvetica-Bold" }]}>{fmt(li.totalPence)}</Text>
            </View>
          ))}
          <View style={s.divider} />
          <View style={s.totalsRow}><Text style={s.totalsLabel}>Subtotal</Text><Text style={s.totalsValue}>{fmt(quote.subtotalPence)}</Text></View>
          <View style={s.totalsRow}><Text style={s.totalsLabel}>VAT</Text><Text style={s.totalsValue}>{fmt(quote.vatPence)}</Text></View>
          <View style={s.divider} />
          <View style={s.totalsRow}><Text style={s.totalsBoldLabel}>Total</Text><Text style={s.totalsBold}>{fmt(quote.totalPence)}</Text></View>
        </View>

        {quote.scopeOfWork && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Scope of Works</Text>
            <Text style={s.pre}>{quote.scopeOfWork}</Text>
          </View>
        )}

        {quote.terms && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Terms &amp; Conditions</Text>
            <Text style={s.pre}>{quote.terms}</Text>
          </View>
        )}

        <View style={s.footer}>
          <Text style={s.footerText}>Generated by TradeSign · tradesign.app</Text>
          <Text style={s.footerText}>{quote.quoteNumber}</Text>
        </View>
      </Page>
    </Document>
  );
}
