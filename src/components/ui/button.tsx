import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          {
            "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]": variant === "default",
            "border border-white/10 bg-white/5 text-foreground hover:bg-white/10": variant === "outline",
            "hover:bg-white/5 text-foreground": variant === "ghost",
            "bg-destructive/15 text-destructive hover:bg-destructive/25": variant === "destructive",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          },
          {
            "h-9 px-4 py-2 text-sm": size === "default",
            "h-7 px-3 text-xs": size === "sm",
            "h-11 px-6 text-base": size === "lg",
            "h-9 w-9 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
