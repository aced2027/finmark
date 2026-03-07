"use client";
import { useEffect, useRef, memo, useState } from 'react';

function TradingViewScreener() {
    const container = useRef<HTMLDivElement>(null);
    const [market, setMarket] = useState<"india" | "america">("india");
    const [screen, setScreen] = useState("general");

    useEffect(() => {
        if (container.current) {
            container.current.innerHTML = "";
        }

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "width": "100%",
        "height": "100%",
        "defaultColumn": "overview",
        "defaultScreen": "${screen}",
        "market": "${market}",
        "showToolbar": true,
        "colorTheme": "dark",
        "locale": "en",
        "isTransparent": true
      }`;
        container.current?.appendChild(script);
    }, [market, screen]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 p-4 border-b border-white/[0.06] bg-slate-900/50">
                {/* Market Selector */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Market:</span>
                    <button
                        onClick={() => setMarket("india")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            market === "india"
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        India (NSE/BSE)
                    </button>
                    <button
                        onClick={() => setMarket("america")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            market === "america"
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        USA
                    </button>
                </div>

                <div className="w-px h-6 bg-white/[0.06]"></div>

                {/* Screen Presets */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Filter:</span>
                    <button
                        onClick={() => setScreen("general")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "general"
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        All Stocks
                    </button>
                    <button
                        onClick={() => setScreen("top_gainers")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "top_gainers"
                                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        Top Gainers
                    </button>
                    <button
                        onClick={() => setScreen("top_losers")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "top_losers"
                                ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        Top Losers
                    </button>
                    <button
                        onClick={() => setScreen("most_capitalized")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "most_capitalized"
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        Large Cap
                    </button>
                    <button
                        onClick={() => setScreen("high_dividend")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "high_dividend"
                                ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        High Dividend
                    </button>
                    <button
                        onClick={() => setScreen("most_volatile")}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                            screen === "most_volatile"
                                ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
                        }`}
                    >
                        Most Volatile
                    </button>
                </div>
            </div>

            {/* Screener Widget */}
            <div className="tradingview-widget-container flex-1 w-full" ref={container}>
                <div className="tradingview-widget-container__widget w-full h-full"></div>
            </div>
        </div>
    );
}

export default memo(TradingViewScreener);
