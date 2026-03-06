"use client";

import { useState } from "react";
import ForexWatchlist from "@/components/forex/ForexWatchlist";
import ForexSignals from "@/components/forex/ForexSignals";
import ForexChart from "@/components/forex/ForexChart";
import AdBanner from "@/components/shared/AdBanner";
import WeeklyBlog from "@/components/shared/WeeklyBlog";

export default function ForexPage() {
    const [selectedSymbol, setSelectedSymbol] = useState("FOREXCOM:EURUSD");

    // Derive a display label from the symbol
    const displayLabel = selectedSymbol.replace("FOREXCOM:", "").replace(/([A-Z]{3})([A-Z]{3})/, "$1/$2");

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar h-[calc(100vh-5.5rem)]">
            <div className="max-w-7xl mx-auto space-y-4 flex flex-col">
                {/* Header */}
                <div className="flex items-end justify-between flex-shrink-0 mb-2">
                    <div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                            Forex Markets
                        </h1>
                        <p className="text-sm text-slate-400">
                            Live currency pair exchanges · Data source:{" "}
                            <span className="text-teal-400 font-medium">forex.com</span>
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                        <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                        <span className="text-xs font-medium text-teal-400">
                            {displayLabel} · Live
                        </span>
                    </div>
                </div>

                {/* Main: Watchlist + Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-[540px]">
                    {/* Watchlist */}
                    <div className="lg:col-span-3 h-[420px] lg:h-full">
                        <ForexWatchlist
                            selectedSymbol={selectedSymbol}
                            onSelectSymbol={setSelectedSymbol}
                        />
                    </div>

                    {/* Chart */}
                    <div className="glass-card lg:col-span-9 h-[520px] lg:h-full p-1 border-teal-500/20 shadow-glow overflow-hidden relative">
                        <ForexChart symbol={selectedSymbol} />
                    </div>
                </div>

                {/* Bottom: Signals + AdSense + Weekly Blog */}
                <div className="space-y-6 pb-8">
                    <ForexSignals />
                    <AdBanner variant="leaderboard" />
                    <WeeklyBlog market="Forex" />
                </div>
            </div>
        </div>
    );
}
