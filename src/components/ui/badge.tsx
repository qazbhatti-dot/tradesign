import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "destructive" | "outline" | "indigo";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-white/10 text-slate-300": variant === "default",
          "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20": variant === "success",
          "bg-amber-500/15 text-amber-400 border border-amber-500/20": variant === "warning",
          "bg-red-500/15 text-red-400 border border-red-500/20": variant === "destructive",
          "border border-white/10 text-slate-400": variant === "outline",
          "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20": variant === "indigo",
        },
        className
      )}
      {...props}
    />
  );
}
