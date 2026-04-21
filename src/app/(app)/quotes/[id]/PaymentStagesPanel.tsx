"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Banknote } from "lucide-react";
import { formatMoney } from "@/lib/money";

interface Stage {
  id: string;
  description: string;
  amountPence: number;
  dueDate: string | null;
  paidAt: string | null;
  sortOrder: number;
}

interface Props {
  quoteId: string;
  stages: Stage[];
  totalPence: number;
}

export function PaymentStagesPanel({ quoteId, stages: initial, totalPence }: Props) {
  const [stages, setStages] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);

  const togglePaid = async (stage: Stage) => {
    const newPaid = !stage.paidAt;
    setLoading(stage.id);
    const res = await fetch(`/api/quotes/${quoteId}/payment-stages/${stage.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paid: newPaid }),
    });
    if (res.ok) {
      setStages(prev =>
        prev.map(s => s.id === stage.id ? { ...s, paidAt: newPaid ? new Date().toISOString() : null } : s)
      );
      toast.success(newPaid ? "Stage marked as paid" : "Stage marked as unpaid");
    } else {
      toast.error("Failed to update");
    }
    setLoading(null);
  };

  const paidTotal = stages.filter(s => s.paidAt).reduce((sum, s) => sum + s.amountPence, 0);
  const stageTotal = stages.reduce((sum, s) => sum + s.amountPence, 0);
  const progress = totalPence > 0 ? (paidTotal / totalPence) * 100 : 0;

  return (
    <div className="rounded-xl border border-white/[0.07] overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="px-5 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Banknote className="size-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Payment Stages</h2>
        </div>
        <span className="text-xs text-slate-500">{formatMoney(paidTotal)} of {formatMoney(stageTotal)} received</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/[0.05]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(progress, 100)}%`, background: "linear-gradient(90deg,#10b981,#6366f1)" }}
        />
      </div>

      <div className="divide-y divide-white/[0.04]">
        {stages.map(stage => {
          const isPaid = !!stage.paidAt;
          const isOverdue = stage.dueDate && !isPaid && new Date(stage.dueDate) < new Date();

          return (
            <div key={stage.id} className="flex items-center gap-4 px-5 py-3.5">
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${isPaid ? "text-slate-400 line-through" : "text-white"}`}>
                  {stage.description}
                </p>
                {stage.dueDate && (
                  <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-400" : "text-slate-600"}`}>
                    Due {new Date(stage.dueDate).toLocaleDateString("en-GB")}
                    {isOverdue && " · Overdue"}
                    {isPaid && stage.paidAt && ` · Paid ${new Date(stage.paidAt).toLocaleDateString("en-GB")}`}
                  </p>
                )}
                {!stage.dueDate && isPaid && stage.paidAt && (
                  <p className="text-xs mt-0.5 text-slate-600">
                    Paid {new Date(stage.paidAt).toLocaleDateString("en-GB")}
                  </p>
                )}
              </div>
              <span className={`text-sm font-semibold flex-shrink-0 ${isPaid ? "text-emerald-400" : "text-white"}`}>
                {formatMoney(stage.amountPence)}
              </span>
              <button
                onClick={() => togglePaid(stage)}
                disabled={loading === stage.id}
                className="flex-shrink-0 focus:outline-none"
                title={isPaid ? "Mark as unpaid" : "Mark as paid"}
              >
                {isPaid ? (
                  <CheckCircle2 className="size-5 text-emerald-400 hover:text-slate-400 transition-colors" />
                ) : (
                  <Circle className={`size-5 transition-colors ${isOverdue ? "text-red-500 hover:text-red-400" : "text-slate-600 hover:text-emerald-400"}`} />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
