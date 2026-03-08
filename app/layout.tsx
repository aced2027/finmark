import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import TradingViewTicker from "@/components/layout/TradingViewTicker";
import Script from "next/script";

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
      <head>
        {/* Suppress TradingView iframe errors */}
        <Script id="suppress-tradingview-errors" strategy="beforeInteractive">
          {`
            window.addEventListener('error', function(e) {
              if (e.message && e.message.includes('contentWindow')) {
                e.preventDefault();
                e.stopPropagation();
                return false;
              }
            }, true);
          `}
        </Script>
      </head>
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
