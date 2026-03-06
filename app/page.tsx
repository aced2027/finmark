import { INDICES } from "@/lib/mock-data";
import { IndexCard } from "@/components/dashboard/IndexCard";
import { PredictionCards } from "@/components/dashboard/PredictionCards";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import TradingViewChart from "@/components/dashboard/TradingViewChart";
import NSENiftyChart from "@/components/dashboard/NSENiftyChart";
import TradingViewMarketOverview from "@/components/dashboard/TradingViewMarketOverview";
import LiveStockBar from "@/components/dashboard/LiveStockBar";
import NSEHeatmap from "@/components/dashboard/NSEHeatmap";
import IndianIndices from "@/components/dashboard/IndianIndices";
import PredictionMarkets from "@/components/dashboard/PredictionMarkets";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden">
      {/* Main scrollable area - Full Width */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Live Stock Bar - Top Assets */}
        <LiveStockBar />
        
        <div className="p-4 lg:p-6">
          <div className="max-w-[1600px] mx-auto space-y-3">
            {/* Header */}
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                  India Markets
                </h1>
                <p className="text-sm text-slate-400">
                  Live indices, AI analysis, and predictions.
                </p>
              </div>
              <div className="hidden sm:flex text-xs font-medium text-slate-500 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* Indian Market Indices Cards */}
            <IndianIndices />

            {/* Live Market Overview Chart - Full Width */}
            <div className="h-[250px] -mt-2 -mb-12">
              <TradingViewMarketOverview />
            </div>

            {/* Main Content Grid - 3 columns */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Left Column - Main Charts (8 cols) */}
              <div className="xl:col-span-8 space-y-6">
                {/* NSE Live Charting Area with Index Selector */}
                <div className="glass-card p-1 h-[600px] border-emerald-500/20 shadow-glow relative overflow-hidden">
                  <NSENiftyChart hideToolbar={false} />
                </div>

                {/* Nifty 50 Heatmap */}
                <NSEHeatmap />

                {/* Bottom Ads */}
                <AdBanner variant="leaderboard" />
              </div>

              {/* Right Sidebar (4 cols) */}
              <div className="xl:col-span-4 space-y-6">
                {/* Watchlist Panel */}
                <WatchlistPanel />

                {/* Prediction Markets */}
                <PredictionMarkets />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="space-y-6 pb-8">
              <WeeklyBlog market="India Markets" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
