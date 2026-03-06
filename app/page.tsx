import { INDICES } from "@/lib/mock-data";
import { IndexCard } from "@/components/dashboard/IndexCard";
import { MarketSummary } from "@/components/dashboard/MarketSummary";
import { PredictionCards } from "@/components/dashboard/PredictionCards";
import { WatchlistPanel } from "@/components/watchlist/WatchlistPanel";
import TradingViewChart from "@/components/dashboard/TradingViewChart";
import TradingViewMarketOverview from "@/components/dashboard/TradingViewMarketOverview";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col xl:flex-row h-[calc(100vh-5.5rem)] overflow-hidden">
      {/* Main scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
        <div className="max-w-6xl mx-auto space-y-6">
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

          {/* Top Live Market Overview Instead of Fake Cards */}
          <div className="h-[400px]">
            <TradingViewMarketOverview />
          </div>

          {/* Two column layout for bottom section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Col (Market Summary, etc.) */}
            <div className="lg:col-span-2 space-y-6">
              <MarketSummary />

              {/* Massive Live Charting Area */}
              <div className="glass-card p-1 min-h-[400px] border-emerald-500/20 shadow-glow relative overflow-hidden">
                <TradingViewChart symbol="BSE:NIFTY" hideToolbar={false} />
              </div>
            </div>

            {/* Right Col (Predictions) */}
            <div className="space-y-6">
              <PredictionCards />
            </div>
          </div>

          {/* Bottom: AdSense + Weekly Blog */}
          <div className="space-y-6 pb-8">
            <AdBanner variant="leaderboard" />
            <WeeklyBlog market="India Markets" />
          </div>
        </div>
      </div>

      {/* Right Sidebar (Watchlist) */}
      <div className="hidden xl:block w-80 flex-shrink-0 border-l border-white/[0.06] bg-[#080b12]/50">
        <WatchlistPanel />
      </div>
    </div>
  );
}
