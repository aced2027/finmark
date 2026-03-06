import TradingViewScreener from "@/components/screener/TradingViewScreener";

export default function ScreenerPage() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden p-4 lg:p-6 custom-scrollbar">
            <div className="max-w-7xl mx-auto w-full h-full space-y-4 flex flex-col">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 flex-shrink-0 mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            India Stock Screener
                        </h1>
                        <p className="text-sm text-slate-400">
                            Filter and search the entire NSE/BSE market. Live fundamental and technical data feeds.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span className="text-xs font-medium text-emerald-400">NSE & BSE Linked</span>
                    </div>
                </div>

                {/* Screener Component Area */}
                <div className="glass-card flex-1 min-h-[500px] border-emerald-500/20 shadow-glow overflow-hidden relative w-full">
                    <TradingViewScreener />
                </div>
            </div>
        </div>
    );
}
