"use client";
import { useEffect, useRef, memo } from 'react';

function Nifty50Heatmap() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current) {
            container.current.innerHTML = "";
        }
        
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-screener.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "width": "100%",
            "height": "600",
            "defaultColumn": "overview",
            "defaultScreen": "general",
            "market": "india",
            "showToolbar": true,
            "colorTheme": "dark",
            "locale": "en",
            "isTransparent": false
        });
        
        if (container.current) {
            container.current.appendChild(script);
        }
    }, []);

    return (
        <div className="glass-card p-1 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                        NSE Stock Screener
                        <span className="text-xs font-normal text-slate-400">Live Market Data</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Real-time data for Indian stocks with advanced filtering
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1 text-[10px] uppercase font-bold text-slate-500">
                        <div className="flex gap-1 items-center">
                            <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
                            <span>Loss</span>
                        </div>
                        <div className="flex gap-1 items-center ml-2">
                            <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
                            <span>Flat</span>
                        </div>
                        <div className="flex gap-1 items-center ml-2">
                            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
                            <span>Gain</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div 
                className="tradingview-widget-container" 
                ref={container} 
                style={{ height: "600px", width: "100%" }}
            >
                <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
            </div>
        </div>
    );
}

export default memo(Nifty50Heatmap);
