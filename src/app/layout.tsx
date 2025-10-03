import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syn_Taxx | Portfolio & Dashboard",
  description: "Portfolio dan Dashboard Admin Syn_Taxx",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      {/* <body className={`${inter.className} bg-background text-foreground`}> */}
      <body className="font-sans bg-background text-foreground">
        <Providers>{children}</Providers> {/* ← pakai wrapper client */}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
