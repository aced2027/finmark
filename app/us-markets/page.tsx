import USTradingViewChart from "@/components/dashboard/USTradingViewChart";
import USMarketOverview from "@/components/dashboard/USMarketOverview";
import LiveStockBar from "@/components/dashboard/LiveStockBar";
import USIndices from "@/components/dashboard/USIndices";
import USPredictionMarkets from "@/components/dashboard/USPredictionMarkets";
import { USWatchlistPanel } from "@/components/watchlist/USWatchlistPanel";
import SP500Heatmap from "@/components/dashboard/SP500Heatmap";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function USMarketsPage() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <LiveStockBar />
                
                <div className="p-4 lg:p-6">
                    <div className="max-w-[1600px] mx-auto space-y-3">
                        {/* Header */}
                        <div className="flex items-end justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                                    US Markets
                                </h1>
                                <p className="text-sm text-slate-400">
                                    Live indices, AI analysis, and predictions.
                                </p>
                            </div>
                            <div className="hidden sm:flex text-xs font-medium text-slate-500 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06]">
                                {new Date().toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>

                        {/* US Market Indices Cards */}
                        <USIndices />

                        {/* Live Market Overview Chart */}
                        <div className="h-[250px] -mt-2 -mb-12">
                            <USMarketOverview />
                        </div>

                        {/* Main Content Grid */}
                        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                            {/* Left Column - Main Charts */}
                            <div className="xl:col-span-8 space-y-6">
                                {/* US Markets Chart with Index Selector */}
                                <div className="glass-card p-1 h-[600px] border-blue-500/20 shadow-glow relative overflow-hidden">
                                    <USTradingViewChart hideToolbar={false} />
                                </div>

                                {/* S&P 500 Heatmap */}
                                <SP500Heatmap />

                                {/* Bottom Ad */}
                                <AdBanner variant="leaderboard" />
                            </div>

                            {/* Right Sidebar */}
                            <div className="xl:col-span-4 space-y-6">
                                <USWatchlistPanel />
                                <USPredictionMarkets />
                            </div>
                        </div>

                        {/* Bottom Section */}
                        <div className="space-y-6 pb-8">
                            <WeeklyBlog market="US Markets" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
