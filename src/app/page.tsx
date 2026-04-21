import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2, Users, BookCheck, Zap, Shield, Clock } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#030812] text-white flex flex-col">
      {/* Glow */}
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 50% -10%,#6366f1 0%,transparent 55%)" }} />

      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#030812]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>TS</div>
            <span className="text-lg font-bold">TradeSign</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/register"
              className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)", boxShadow: "0 0 30px rgba(99,102,241,0.2)" }}>
              Get started free <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-400 mb-8">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-400" />
            For builders, plumbers, electricians &amp; all service trades
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
            Quote the job.{" "}
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg,#10b981 0%,#6366f1 60%,#a78bfa 100%)" }}>
              Get it agreed.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400 leading-relaxed">
            Send professional quotes with a full scope of works. Your client clicks one link,
            reviews everything, and signs off. A legally-formed agreement is created instantly.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register"
              className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)", boxShadow: "0 0 50px rgba(99,102,241,0.25)" }}>
              Start sending quotes free <ArrowRight className="size-4" />
            </Link>
            <Link href="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10">
              Sign in
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            {["No credit card", "Client agrees in one click", "Instant contract formed"].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-500" />{t}
              </span>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-y border-white/[0.05] bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-emerald-400">How it works</div>
            <h2 className="mb-16 text-center text-3xl font-bold">Three steps from quote to contract</h2>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { step: "01", icon: <FileText className="size-6" />, title: "Create your quote", desc: "Add line items, a scope of works, your payment terms, and any conditions. Looks professional — no design skills needed." },
                { step: "02", icon: <Zap className="size-6" />, title: "Client reviews & agrees", desc: "Send a secure link. Your client reads the full quote and scope on any device, then clicks Accept. No account needed on their end." },
                { step: "03", icon: <BookCheck className="size-6" />, title: "Contract formed instantly", desc: "On acceptance, a timestamped, binding agreement is created with their name, date, and IP recorded. Download as PDF." },
              ].map(s => (
                <div key={s.step} className="relative rounded-2xl border border-white/[0.07] p-6"
                  style={{ background: "rgba(255,255,255,0.03)" }}>
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400">{s.icon}</div>
                    <span className="text-3xl font-black text-white/5">{s.step}</span>
                  </div>
                  <h3 className="font-semibold text-white">{s.title}</h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-24">
          <div className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-indigo-400">Features</div>
          <h2 className="mb-4 text-center text-3xl font-bold">Built for the trades</h2>
          <p className="mx-auto mb-16 max-w-xl text-center text-slate-400">Everything a service professional needs to quote, agree, and get paid — without the paperwork headache.</p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <FileText className="size-5"/>, title: "Professional Quotes", desc: "Branded quotes with your business name, logo, itemised costs, VAT, and a detailed scope of works.", color: "#10b981" },
              { icon: <BookCheck className="size-5"/>, title: "Digital Sign-Off", desc: "Client accepts with a single click. Their name, timestamp, and IP address are recorded as evidence of agreement.", color: "#6366f1" },
              { icon: <Shield className="size-5"/>, title: "Binding Contracts", desc: "Automatically generated contract document with full terms. Downloadable PDF for both parties.", color: "#a78bfa" },
              { icon: <Clock className="size-5"/>, title: "Quote Expiry", desc: "Set a validity date on quotes. Expired quotes are flagged automatically so nothing gets lost.", color: "#38bdf8" },
              { icon: <Users className="size-5"/>, title: "Client Management", desc: "Store client details, see all quotes per client, and track the relationship over time.", color: "#f59e0b" },
              { icon: <Zap className="size-5"/>, title: "Quote Status Tracking", desc: "Know exactly where every quote stands — Draft, Sent, Viewed, Accepted, or Declined.", color: "#f43f5e" },
            ].map(f => (
              <div key={f.title} className="rounded-2xl border border-white/[0.07] p-6 transition-all hover:border-white/[0.14]"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: f.color + "20", color: f.color }}>{f.icon}</div>
                <h3 className="font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-32">
          <div className="relative overflow-hidden rounded-3xl p-12 text-center"
            style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.12),rgba(99,102,241,0.12))", border: "1px solid rgba(99,102,241,0.2)", boxShadow: "0 0 80px rgba(99,102,241,0.08)" }}>
            <div className="pointer-events-none absolute inset-0 opacity-25"
              style={{ background: "radial-gradient(ellipse at 50% -20%,#6366f1 0%,transparent 60%)" }} />
            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold">Stop chasing verbal agreements</h2>
              <p className="mx-auto mt-4 max-w-lg text-slate-400">Send your first quote in minutes. Get it signed off properly. Build trust with every job.</p>
              <Link href="/register"
                className="mt-10 inline-flex items-center gap-2 rounded-xl px-8 py-4 text-base font-semibold text-white"
                style={{ background: "linear-gradient(135deg,#10b981,#6366f1)", boxShadow: "0 0 50px rgba(99,102,241,0.3)" }}>
                Create your free account <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/[0.05]">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
              style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>TS</div>
            <span className="font-semibold text-sm">TradeSign</span>
          </div>
          <p className="text-xs text-slate-600">© {new Date().getFullYear()} TradeSign. Quote. Agree. Build.</p>
        </div>
      </footer>
    </div>
  );
}
