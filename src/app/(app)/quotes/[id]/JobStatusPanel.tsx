"use client";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { JobStatus } from "@/generated/prisma/client";

const STEPS: { value: JobStatus; label: string; desc: string }[] = [
  { value: "NOT_STARTED", label: "Not Started", desc: "Contract formed, awaiting start" },
  { value: "STARTED",     label: "Started",     desc: "Work has begun on site" },
  { value: "IN_PROGRESS", label: "In Progress", desc: "Active works underway" },
  { value: "SNAGGING",    label: "Snagging",    desc: "Final checks and fixes" },
  { value: "COMPLETE",    label: "Complete",    desc: "All works finished" },
];

const ORDER: JobStatus[] = ["NOT_STARTED", "STARTED", "IN_PROGRESS", "SNAGGING", "COMPLETE"];

interface Props {
  quoteId: string;
  initialStatus: JobStatus;
  startedAt: string | null;
  completedAt: string | null;
}

export function JobStatusPanel({ quoteId, initialStatus, startedAt, completedAt }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);

  const currentIdx = ORDER.indexOf(status);

  const updateStatus = async (newStatus: JobStatus) => {
    if (newStatus === status) return;
    setSaving(true);
    const res = await fetch(`/api/quotes/${quoteId}/job-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobStatus: newStatus }),
    });
    if (res.ok) {
      setStatus(newStatus);
      toast.success("Job status updated");
    } else {
      toast.error("Failed to update status");
    }
    setSaving(false);
  };

  return (
    <div className="rounded-xl border border-white/[0.07] p-5" style={{ background: "rgba(255,255,255,0.02)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Job Progress</h2>
        {saving && <Loader2 className="size-4 text-slate-500 animate-spin" />}
      </div>

      <div className="flex flex-col gap-0">
        {STEPS.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.value} className="flex gap-4">
              {/* Track */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => updateStatus(step.value)}
                  disabled={saving}
                  className="flex-shrink-0 focus:outline-none"
                  title={`Set to ${step.label}`}
                >
                  {done || active ? (
                    <CheckCircle2
                      className={`size-6 transition-colors ${done ? "text-emerald-500" : "text-emerald-400"}`}
                    />
                  ) : (
                    <Circle className="size-6 text-slate-700 hover:text-slate-500 transition-colors" />
                  )}
                </button>
                {!isLast && (
                  <div className={`w-0.5 h-8 my-0.5 rounded-full ${i < currentIdx ? "bg-emerald-500/50" : "bg-white/[0.06]"}`} />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${isLast ? "pb-0" : ""} flex flex-col justify-start pt-0.5`}>
                <button
                  onClick={() => updateStatus(step.value)}
                  disabled={saving}
                  className="text-left focus:outline-none group"
                >
                  <p className={`text-sm font-semibold transition-colors ${active ? "text-white" : done ? "text-emerald-400" : "text-slate-600 group-hover:text-slate-400"}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${active ? "text-slate-400" : done ? "text-slate-500" : "text-slate-700"}`}>
                    {step.desc}
                    {step.value === "STARTED" && startedAt && done && (
                      <> · {new Date(startedAt).toLocaleDateString("en-GB")}</>
                    )}
                    {step.value === "COMPLETE" && completedAt && done && (
                      <> · {new Date(completedAt).toLocaleDateString("en-GB")}</>
                    )}
                  </p>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
