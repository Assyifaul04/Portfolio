"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = useSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}
