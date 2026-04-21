"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface LineItem { description: string; quantity: string; unitPrice: string; vatRate: string }
interface Client { id: string; name: string; company: string | null }

const emptyLine = (): LineItem => ({ description: "", quantity: "1", unitPrice: "", vatRate: "20" });

function calcLine(l: LineItem) {
  const qty = parseFloat(l.quantity) || 0;
  const unit = parseFloat(l.unitPrice) || 0;
  const vat = parseFloat(l.vatRate) || 0;
  const net = qty * unit;
  return { net, vatAmt: net * (vat / 100), total: net + net * (vat / 100) };
}

export default function NewQuotePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [lines, setLines] = useState<LineItem[]>([emptyLine()]);
  const [form, setForm] = useState({
    clientId: "", title: "", description: "", scopeOfWork: "",
    terms: "Payment is due within 30 days of invoice. All work is subject to our standard terms and conditions.",
    validUntil: "", notes: "", newClientName: "", newClientEmail: "",
  });

  useEffect(() => {
    fetch("/api/clients").then(r => r.json()).then(setClients);
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const setLine = (i: number, k: keyof LineItem) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setLines(ls => ls.map((l, idx) => idx === i ? { ...l, [k]: e.target.value } : l));

  const totals = lines.reduce((acc, l) => {
    const c = calcLine(l);
    return { net: acc.net + c.net, vat: acc.vat + c.vatAmt, total: acc.total + c.total };
  }, { net: 0, vat: 0, total: 0 });

  const fmt = (n: number) => "£" + n.toFixed(2);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientId && !form.newClientName) { toast.error("Select a client or enter a new one"); return; }
    if (lines.every(l => !l.description || !l.unitPrice)) { toast.error("Add at least one line item"); return; }
    setLoading(true);
    const res = await fetch("/api/quotes", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, lineItems: lines }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error || "Failed"); setLoading(false); return; }
    toast.success("Quote created!");
    router.push(`/quotes/${json.id}`);
  };

  return (
    <form onSubmit={submit} className="max-w-4xl mx-auto flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <Link href="/quotes" className="text-slate-400 hover:text-white transition-colors"><ArrowLeft className="size-5" /></Link>
        <div>
          <h1 className="text-2xl font-bold text-white">New Quote</h1>
          <p className="text-sm text-slate-400">Fill in the details below and send to your client</p>
        </div>
      </div>

      {/* Client */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-white text-sm uppercase tracking-wider text-slate-400">Client</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Existing client</Label>
            <Select value={form.clientId} onChange={set("clientId")}>
              <option value="">— Select or create new —</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` (${c.company})` : ""}</option>)}
            </Select>
          </div>
          {!form.clientId && (
            <div className="grid gap-4 md:grid-cols-2 col-span-full">
              <div className="flex flex-col gap-1.5">
                <Label>New client name <span className="text-emerald-400">*</span></Label>
                <Input placeholder="John Builder" value={form.newClientName} onChange={set("newClientName")} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Client email</Label>
                <Input type="email" placeholder="client@example.com" value={form.newClientEmail} onChange={set("newClientEmail")} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Quote details */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Quote Details</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label>Job title <span className="text-emerald-400">*</span></Label>
            <Input required placeholder="Kitchen Extension – 12 Oak Street" value={form.title} onChange={set("title")} />
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <Label>Short description</Label>
            <Textarea rows={2} placeholder="Brief overview for the client…" value={form.description} onChange={set("description")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Valid until</Label>
            <Input type="date" value={form.validUntil} onChange={set("validUntil")} />
          </div>
        </div>
      </section>

      {/* Line items */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Line Items</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-white/[0.06]">
                <th className="text-left pb-2 pr-3 font-medium">Description</th>
                <th className="text-right pb-2 px-3 font-medium w-20">Qty</th>
                <th className="text-right pb-2 px-3 font-medium w-28">Unit Price (£)</th>
                <th className="text-right pb-2 px-3 font-medium w-20">VAT %</th>
                <th className="text-right pb-2 px-3 font-medium w-28">Total</th>
                <th className="pb-2 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {lines.map((l, i) => {
                const { total } = calcLine(l);
                return (
                  <tr key={i}>
                    <td className="py-2 pr-3">
                      <Input placeholder="Labour, materials, etc." value={l.description} onChange={setLine(i, "description")} />
                    </td>
                    <td className="py-2 px-3">
                      <Input type="number" min="0" step="0.01" className="text-right w-20" value={l.quantity} onChange={setLine(i, "quantity")} />
                    </td>
                    <td className="py-2 px-3">
                      <Input type="number" min="0" step="0.01" placeholder="0.00" className="text-right w-28" value={l.unitPrice} onChange={setLine(i, "unitPrice")} />
                    </td>
                    <td className="py-2 px-3">
                      <Select className="w-20 text-right" value={l.vatRate} onChange={setLine(i, "vatRate")}>
                        <option value="0">0%</option>
                        <option value="5">5%</option>
                        <option value="20">20%</option>
                      </Select>
                    </td>
                    <td className="py-2 px-3 text-right font-medium text-white">{fmt(total)}</td>
                    <td className="py-2 pl-2">
                      {lines.length > 1 && (
                        <button type="button" onClick={() => setLines(ls => ls.filter((_, idx) => idx !== i))}
                          className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 className="size-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <button type="button" onClick={() => setLines(ls => [...ls, emptyLine()])}
          className="flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
          <Plus className="size-4" /> Add line
        </button>

        {/* Totals */}
        <div className="ml-auto w-64 flex flex-col gap-1 border-t border-white/[0.06] pt-3">
          <div className="flex justify-between text-sm text-slate-400"><span>Subtotal</span><span>{fmt(totals.net)}</span></div>
          <div className="flex justify-between text-sm text-slate-400"><span>VAT</span><span>{fmt(totals.vat)}</span></div>
          <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-white/[0.06]">
            <span>Total</span><span>{fmt(totals.total)}</span>
          </div>
        </div>
      </section>

      {/* Scope of works */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Scope of Works</h2>
        <p className="text-xs text-slate-500">Describe exactly what is and isn't included. This becomes part of the contract.</p>
        <Textarea rows={8} placeholder={"Work included:\n• Remove existing kitchen units\n• Supply and install new units (customer supply)\n• Plumbing connections\n\nWork NOT included:\n• Electrical work\n• Decoration"} value={form.scopeOfWork} onChange={set("scopeOfWork")} className="min-h-[180px]" />
      </section>

      {/* Terms */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Terms &amp; Conditions</h2>
        <Textarea rows={5} value={form.terms} onChange={set("terms")} className="min-h-[120px]" />
      </section>

      {/* Notes */}
      <section className="rounded-xl border border-white/[0.07] p-5 flex flex-col gap-4" style={{ background: "rgba(255,255,255,0.02)" }}>
        <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-400">Internal Notes (not shown to client)</h2>
        <Textarea rows={3} placeholder="e.g. Customer wants start date of 10 Feb" value={form.notes} onChange={set("notes")} />
      </section>

      <div className="flex justify-end gap-3 pb-8">
        <Link href="/quotes"><Button type="button" variant="outline">Cancel</Button></Link>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save Quote"}
        </Button>
      </div>
    </form>
  );
}
