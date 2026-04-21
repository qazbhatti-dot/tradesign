"use client";
import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

export function DownloadPDFButton({ quoteId, quoteNumber }: { quoteId: string; quoteNumber: string }) {
  const [loading, setLoading] = useState(false);

  const download = async () => {
    setLoading(true);
    const res = await fetch(`/api/quotes/${quoteId}/pdf`);
    if (res.ok) {
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${quoteNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={download}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/[0.07] transition-colors disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <FileDown className="size-4" />}
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
