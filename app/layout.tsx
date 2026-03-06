import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import TradingViewTicker from "@/components/layout/TradingViewTicker";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "finmark – Finance Intelligence Platform",
  description:
    "Professional finance intelligence platform for India markets, crypto, AI insights, and predictions.",
  keywords: ["finmark", "India markets", "NIFTY", "crypto", "finance", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} bg-background text-foreground`}>
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />
          {/* Main content */}
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            <Header />
            <TradingViewTicker />
            <main className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="grid-bg min-h-full">{children}</div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
