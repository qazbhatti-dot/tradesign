import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  const biz = await prisma.business.findFirst({
    where: { userId: session.id },
    select: { name: true },
  });
  if (!biz) redirect("/login");
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar businessName={biz.name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav userName={session.name} userEmail={session.email} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#030812]">{children}</main>
      </div>
    </div>
  );
}
