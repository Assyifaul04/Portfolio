// src/app/providers.tsx

"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { DownloadNotificationProvider } from "@/components/DownloadNotificationContext";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {/* 2. Bungkus children dengan provider notifikasi */}
        <DownloadNotificationProvider>
          {children}
        </DownloadNotificationProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}