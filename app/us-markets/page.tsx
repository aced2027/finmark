import TradingViewChart from "@/components/dashboard/TradingViewChart";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function USMarketsPage() {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar h-[calc(100vh-5.5rem)]">
            <div className="max-w-7xl mx-auto space-y-4 flex flex-col">
                {/* Header */}
                <div className="flex items-end justify-between flex-shrink-0 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            US Markets
                        </h1>
                        <p className="text-sm text-slate-400">
                            Live automated data feed for S&P 500, NASDAQ, and top equities.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-emerald-400">Live API Connected</span>
                    </div>
                </div>

                {/* Charting Area */}
                <div className="glass-card h-[520px] p-1 border-blue-500/20 shadow-glow overflow-hidden relative">
                    <TradingViewChart symbol="FOREXCOM:SPXUSD" />
                </div>

                {/* Bottom: AdSense + Weekly Blog */}
                <div className="space-y-6 pb-8">
                    <AdBanner variant="leaderboard" />
                    <WeeklyBlog market="US Markets" />
                </div>
            </div>
        </div>
    );
}
