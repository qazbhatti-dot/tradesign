"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs border border-indigo-500/30 rounded-lg px-3 py-1.5 transition-colors whitespace-nowrap"
      style={{ color: copied ? "#10b981" : "#818cf8", background: copied ? "rgba(16,185,129,0.08)" : undefined }}
    >
      {copied ? <><Check className="size-3" /> Copied!</> : <><Copy className="size-3" /> Copy link</>}
    </button>
  );
}
