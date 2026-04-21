"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LogOut, ChevronDown } from "lucide-react";

interface TopNavProps { userName: string; userEmail: string }

function initials(name: string) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

export function TopNav({ userName, userEmail }: TopNavProps) {
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/login");
  };

  return (
    <header className="flex h-14 items-center justify-end border-b border-white/[0.07] bg-[#030812] px-6 gap-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: "linear-gradient(135deg,#10b981,#6366f1)" }}>
          {initials(userName)}
        </div>
        <div className="hidden sm:flex flex-col">
          <span className="text-sm font-medium text-white leading-none">{userName}</span>
          <span className="text-xs text-slate-500">{userEmail}</span>
        </div>
      </div>
      <button onClick={logout}
        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors rounded-lg px-2 py-1.5 hover:bg-white/5">
        <LogOut className="size-4" /> Sign out
      </button>
    </header>
  );
}
