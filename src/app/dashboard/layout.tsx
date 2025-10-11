// app/dashboard/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
    redirect("/auth/login");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
        {/* Sidebar (Desktop) & Drawer (Mobile) */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header Space for Mobile (agar content tidak tertutup tombol menu) */}
          <div className="lg:hidden h-16" />
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  );
}