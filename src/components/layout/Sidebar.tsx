"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Users, BookCheck, Settings, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps { businessName: string }

export function Sidebar({ businessName }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  const item = (href: string, icon: React.ReactNode, label: string) => (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all border",
        isActive(href)
          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
          : "text-slate-400 hover:bg-white/5 hover:text-white border-transparent"
      )}
    >
      <span className="[&_svg]:size-4">{icon}</span>
      {label}
    </Link>
  );

  return (
    <aside className="flex h-full w-60 flex-col border-r border-white/[0.07] bg-[#030812]">
      <div className="flex h-14 items-center border-b border-white/[0.07] px-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>TS</div>
          <span className="font-semibold text-sm text-white truncate">{businessName}</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {item("/dashboard", <LayoutDashboard />, "Dashboard")}
        {item("/quotes", <FileText />, "Quotes")}
        {item("/contracts", <BookCheck />, "Contracts")}
        {item("/clients", <Users />, "Clients")}
        {item("/settings", <Settings />, "Settings")}
      </nav>
      <div className="border-t border-white/[0.07] px-4 py-3">
        <p className="text-[10px] text-slate-600">TradeSign · Quote &amp; Agree</p>
      </div>
    </aside>
  );
}
