"use client";
import React, { useEffect, useRef, useState, memo } from 'react';
import { Clock, TrendingUp } from 'lucide-react';

interface NSEIndex {
  symbol: string;
  name: string;
  color: string;
}

const NSE_INDICES: NSEIndex[] = [
  { symbol: "NSE:NIFTY", name: "Nifty 50", color: "emerald" },
  { symbol: "NSE:BANKNIFTY", name: "Bank Nifty", color: "blue" },
  { symbol: "NSE:NIFTYMIDCAP50", name: "Nifty Midcap 50", color: "purple" },
  { symbol: "NSE:NIFTYIT", name: "Nifty IT", color: "cyan" },
  { symbol: "NSE:NIFTYPHARMA", name: "Nifty Pharma", color: "pink" },
  { symbol: "NSE:NIFTYAUTO", name: "Nifty Auto", color: "orange" },
];

function useCandleTimer(intervalStr: string) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    let intervalMs = 0;
    if (intervalStr === "D") {
      setTimeLeft("End of Day");
      return;
    } else if (intervalStr === "W" || intervalStr === "M") {
      setTimeLeft("--:--");
      return;
    }

    const mins = parseInt(intervalStr);
    if (!isNaN(mins)) {
      intervalMs = mins * 60 * 1000;
    } else {
      setTimeLeft("");
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const nowMs = now.getTime();
      let nextClose = Math.ceil(nowMs / intervalMs) * intervalMs;
      const diff = nextClose - nowMs;

      if (diff <= 0) {
        setTimeLeft("00:00");
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (h > 0) {
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      }
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);
    return () => clearInterval(intervalId);
  }, [intervalStr]);

  return timeLeft;
}

function NSENiftyChart({ hideToolbar = false }: { hideToolbar?: boolean }) {
  const container = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState("15");
  const [selectedIndex, setSelectedIndex] = useState<NSEIndex>(NSE_INDICES[0]);

  const timeLeft = useCandleTimer(interval);

  useEffect(() => {
    if (container.current) container.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "${selectedIndex.symbol}",
        "interval": "${interval}",
        "timezone": "Asia/Kolkata",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "backgroundColor": "rgba(8, 11, 18, 1)",
        "gridColor": "rgba(255, 255, 255, 0.06)",
        "hide_legend": false,
        "hide_top_toolbar": ${hideToolbar},
        "save_image": false,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    container.current?.appendChild(script);
  }, [selectedIndex.symbol, hideToolbar, interval]);

  return (
    <div className="flex flex-col w-full h-full bg-[#080b12] rounded-xl overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col gap-3 px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent shrink-0">
        {/* Index Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">NSE Index</span>
          {NSE_INDICES.map((index) => (
            <button
              key={index.symbol}
              onClick={() => setSelectedIndex(index)}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                selectedIndex.symbol === index.symbol
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                  : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-transparent'
              }`}
            >
              {index.name}
            </button>
          ))}
        </div>

        {/* Timeframe and Timer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1 uppercase tracking-wider">Timeframe</span>
            {["1", "5", "15", "60", "D"].map((t) => (
              <button
                key={t}
                onClick={() => setInterval(t)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                  interval === t
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-slate-200 border border-transparent'
                }`}
              >
                {t === "D" ? "1D" : `${t}m`}
              </button>
            ))}
          </div>

          {/* Timer */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 shadow-[inset_0_0_10px_rgba(16,185,129,0.05)]">
            <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-300">Candle Closes In</span>
            <span className="text-sm font-mono font-bold text-emerald-400 min-w-[50px] text-right tracking-tight">
              {timeLeft}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full relative" ref={container}>
        <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      </div>
    </div>
  );
}

export default memo(NSENiftyChart);
