import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Providers from "./providers";
import FloatingButtons from "@/components/floating-buttons";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Syn_Taxx | Portfolio",
  description: "Portfolio Izza",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans bg-background text-foreground">
        <Providers>
          {children}
          <FloatingButtons />
        </Providers>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}