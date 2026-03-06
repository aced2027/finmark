import { CryptoTable } from "@/components/crypto/CryptoTable";
import { Heatmap } from "@/components/crypto/Heatmap";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function CryptoDashboard() {
    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar h-[calc(100vh-5.5rem)]">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            Crypto Markets
                        </h1>
                        <p className="text-sm text-slate-400">
                            Live crypto prices, volume, and funding rates.
                        </p>
                    </div>
                    <div className="hidden sm:flex text-xs font-medium text-slate-500 bg-white/[0.03] px-3 py-1.5 rounded-lg border border-white/[0.06] items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Real-time Sync Active
                    </div>
                </div>

                {/* Top Stats / Heatmap */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <CryptoTable />
                    </div>
                    <div className="space-y-6">
                        <div className="glass-card p-5 border-l-4 border-l-emerald-500">
                            <h3 className="text-sm font-semibold text-white mb-2">Crypto Fear & Greed</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-3xl font-bold text-emerald-400 tracking-tighter">74</span>
                                <span className="text-sm text-emerald-500 font-medium mb-1">Greed</span>
                            </div>
                            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-[74%] rounded-full shadow-glow"></div>
                            </div>
                        </div>

                        <div className="glass-card p-5 border-l-4 border-l-cyan-500">
                            <h3 className="text-sm font-semibold text-white mb-2">BTC Dominance</h3>
                            <div className="flex items-end gap-3 mb-4">
                                <span className="text-3xl font-bold text-cyan-400 tracking-tighter">54.2%</span>
                                <span className="text-sm text-cyan-500 font-medium mb-1">+0.4%</span>
                            </div>
                            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500 w-[54.2%] rounded-full shadow-glow-blue"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Heatmap Section */}
                <div className="mt-8">
                    <Heatmap />
                </div>

                {/* Bottom: AdSense + Weekly Blog */}
                <div className="space-y-6 pb-8">
                    <AdBanner variant="leaderboard" />
                    <WeeklyBlog market="Crypto" />
                </div>
            </div>
        </div>
    );
}
