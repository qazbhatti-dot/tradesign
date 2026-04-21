"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "" });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) { toast.error(json.error || "Registration failed"); setLoading(false); return; }
    toast.success("Account created!");
    router.push("/dashboard");
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] p-7" style={{ background: "rgba(255,255,255,0.03)" }}>
      <h1 className="text-xl font-bold text-white mb-1">Create your account</h1>
      <p className="text-sm text-slate-400 mb-6">Start sending professional quotes today</p>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        {[
          { key: "name", label: "Your name", type: "text", placeholder: "Jane Smith" },
          { key: "businessName", label: "Business name", type: "text", placeholder: "Smith Building Ltd" },
          { key: "email", label: "Email", type: "email", placeholder: "you@example.com" },
          { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
        ].map(f => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input id={f.key} type={f.type} placeholder={f.placeholder}
              value={form[f.key as keyof typeof form]} onChange={set(f.key)} required />
          </div>
        ))}
        <Button type="submit" className="w-full mt-1" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
