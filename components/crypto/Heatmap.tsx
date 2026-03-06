"use client";

import { motion } from "framer-motion";
import { HEATMAP_DATA } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

export function Heatmap() {
    // Sort by market cap logically (mocking sizes)
    const sortedData = useMemo(() => {
        return [...HEATMAP_DATA].sort((a, b) => b.pe - a.pe);
    }, []);

    const getHeatmapColor = (pct: number) => {
        if (pct > 2) return "bg-emerald-500 text-white";
        if (pct > 0.5) return "bg-emerald-600/80 text-emerald-50";
        if (pct > 0) return "bg-emerald-800/60 text-emerald-100";
        if (pct === 0) return "bg-slate-700 text-slate-300";
        if (pct > -0.5) return "bg-red-800/60 text-red-100";
        if (pct > -2) return "bg-red-600/80 text-red-50";
        return "bg-red-500 text-white";
    };

    return (
        <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h2 className="text-base font-semibold text-white">Market Heatmap</h2>
                    <p className="text-xs text-slate-400">S&P BSE Sensex components sized by Market Cap</p>
                </div>
                <div className="flex gap-1 text-[10px] uppercase font-bold text-slate-500">
                    <div className="flex gap-0.5 items-center mr-2">
                        <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                        <span>-2%</span>
                    </div>
                    <div className="flex gap-0.5 items-center mr-2">
                        <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
                        <span>0%</span>
                    </div>
                    <div className="flex gap-0.5 items-center">
                        <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
                        <span>+2%</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1 h-[400px]">
                {sortedData.map((stock, i) => {
                    // Calculate span based on mock criteria just to simulate tree-map look
                    const isLarge = i < 3;
                    const isMedium = i >= 3 && i < 8;

                    return (
                        <motion.div
                            key={stock.symbol}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.02, duration: 0.3 }}
                            className={cn(
                                "relative group cursor-pointer overflow-hidden rounded flex flex-col items-center justify-center p-2 transition-all hover:ring-2 hover:ring-white/50 z-0 hover:z-10",
                                getHeatmapColor(stock.changePct),
                                isLarge ? "col-span-2 row-span-2 text-xl" : isMedium ? "col-span-1 row-span-2" : "col-span-1 row-span-1 text-xs"
                            )}
                        >
                            <span className="font-bold tracking-tight">{stock.symbol}</span>
                            <span className={cn(
                                "font-medium opacity-90",
                                isLarge ? "text-base" : "text-[10px]"
                            )}>
                                {stock.changePct > 0 ? "+" : ""}
                                {stock.changePct}%
                            </span>

                            {/* Tooltip Hover */}
                            <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-2 backdrop-blur-sm z-20">
                                <p className="text-xs font-bold text-white mb-1">{stock.symbol}</p>
                                <p className="text-[10px] text-slate-300">Sector: {stock.sector}</p>
                                <p className="text-[10px] text-slate-300">M.Cap: ₹{stock.marketCap}</p>
                                <p className="text-[10px] text-slate-300">P/E: {stock.pe}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
