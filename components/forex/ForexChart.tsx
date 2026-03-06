"use client";
import React, { useEffect, useRef, useState, memo } from "react";
import { Clock } from "lucide-react";

const TIMEFRAMES = [
    { label: "1m", value: "1" },
    { label: "5m", value: "5" },
    { label: "15m", value: "15" },
    { label: "1H", value: "60" },
    { label: "4H", value: "240" },
    { label: "1D", value: "D" },
];

function useCandleTimer(intervalStr: string) {
    const [timeLeft, setTimeLeft] = useState<string>("");

    useEffect(() => {
        if (intervalStr === "D" || intervalStr === "W" || intervalStr === "M") {
            setTimeLeft("--:--");
            return;
        }

        const mins = parseInt(intervalStr);
        if (isNaN(mins)) { setTimeLeft(""); return; }

        const intervalMs = mins * 60 * 1000;

        const updateTimer = () => {
            const now = Date.now();
            const nextClose = Math.ceil(now / intervalMs) * intervalMs;
            const diff = nextClose - now;
            if (diff <= 0) { setTimeLeft("00:00"); return; }
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(
                h > 0
                    ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
                    : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
            );
        };

        updateTimer();
        const id = setInterval(updateTimer, 1000);
        return () => clearInterval(id);
    }, [intervalStr]);

    return timeLeft;
}

interface ForexChartProps {
    symbol?: string;
}

function ForexChart({ symbol = "FOREXCOM:EURUSD" }: ForexChartProps) {
    const container = useRef<HTMLDivElement>(null);
    const [interval, setIntervalState] = useState("15");
    const timeLeft = useCandleTimer(interval);

    useEffect(() => {
        if (!container.current) return;
        container.current.innerHTML = "";

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: "UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            enable_publishing: false,
            backgroundColor: "rgba(8, 11, 18, 1)",
            gridColor: "rgba(255, 255, 255, 0.05)",
            hide_legend: false,
            hide_top_toolbar: false,
            save_image: false,
            calendar: false,
            support_host: "https://www.tradingview.com",
        });

        container.current.appendChild(script);
    }, [symbol, interval]);

    return (
        <div className="flex flex-col w-full h-full bg-[#080b12] rounded-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent shrink-0">
                <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 mr-1.5 uppercase tracking-wider">
                        Timeframe
                    </span>
                    {TIMEFRAMES.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setIntervalState(tf.value)}
                            className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${interval === tf.value
                                    ? "bg-teal-500/15 text-teal-400 border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]"
                                    : "bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-transparent"
                                }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-teal-500/5 border border-teal-500/20">
                    <Clock className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
                    <span className="text-xs font-medium text-slate-300">Candle Closes In</span>
                    <span className="text-sm font-mono font-bold text-teal-400 min-w-[50px] text-right tracking-tight">
                        {timeLeft}
                    </span>
                </div>
            </div>

            {/* Chart */}
            <div className="flex-1 w-full relative" ref={container}>
                <div
                    className="tradingview-widget-container__widget"
                    style={{ height: "100%", width: "100%" }}
                />
            </div>
        </div>
    );
}

export default memo(ForexChart);
