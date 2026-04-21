import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#030812] px-4">
      <div className="pointer-events-none fixed inset-0 -z-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 50% 0%,#6366f1 0%,transparent 55%)" }} />
      <div className="relative z-10 mb-8 flex flex-col items-center gap-2">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>TS</div>
          <span className="text-xl font-bold text-white">TradeSign</span>
        </Link>
        <p className="text-sm text-slate-500">Quote. Agree. Build.</p>
      </div>
      <div className="relative z-10 w-full max-w-md">{children}</div>
    </div>
  );
}
