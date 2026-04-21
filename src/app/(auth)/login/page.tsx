"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error || "Login failed"); setLoading(false); return; }
    toast.success("Welcome back!");
    router.push("/dashboard");
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] p-7" style={{ background: "rgba(255,255,255,0.03)" }}>
      <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
      <p className="text-sm text-slate-400 mb-6">Access your TradeSign account</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full mt-1" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/register" className="text-emerald-400 hover:underline">Create one free</Link>
        </p>
      </form>

      <div className="mt-6 rounded-xl border border-dashed border-white/10 bg-white/[0.02] p-4">
        <p className="text-xs font-medium text-slate-500 mb-2">Demo account</p>
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => { setEmail("demo@tradesign.app"); setPassword("Demo1234!"); }}
            className="text-left text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            demo@tradesign.app
          </button>
          <span className="text-xs font-mono text-slate-500">Demo1234!</span>
        </div>
      </div>
    </div>
  );
}
