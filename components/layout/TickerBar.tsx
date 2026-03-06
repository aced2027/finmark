"use client";

import { useEffect, useRef } from "react";
import { INDICES } from "@/lib/mock-data";
import { cn, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export function TickerBar() {
    const tickerItems = [...INDICES, ...INDICES]; // duplicate for seamless loop

    return (
        <div className="h-8 ticker-bg flex items-center overflow-hidden flex-shrink-0 relative">
            <div className="flex-shrink-0 px-3 text-[10px] font-bold text-emerald-400 border-r border-white/10 h-full flex items-center uppercase tracking-widest">
                Live
            </div>
            <div className="flex-1 overflow-hidden">
                <div
                    className="flex gap-6 whitespace-nowrap"
                    style={{
                        animation: "ticker 35s linear infinite",
                    }}
                >
                    {tickerItems.map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-xs">
                            <span className="font-semibold text-white/80">{item.symbol}</span>
                            <span className="text-slate-400 font-mono">
                                {item.currency === "INR"
                                    ? `₹${item.price.toLocaleString("en-IN")}`
                                    : `$${item.price.toLocaleString("en-US")}`}
                            </span>
                            <span
                                className={cn(
                                    "flex items-center gap-0.5 font-medium",
                                    item.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                                )}
                            >
                                {item.changePct >= 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                ) : (
                                    <TrendingDown className="w-3 h-3" />
                                )}
                                {formatPercent(item.changePct)}
                            </span>
                            <span className="text-white/10 mx-1">|</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
