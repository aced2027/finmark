"use client";
import { useState, memo } from "react";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

interface Pair {
  symbol: string;   // FOREXCOM: prefixed
  label: string;    // Display name e.g. "EUR/USD"
  base: string;
  quote: string;
  flag: string;     // emoji flags
  pip: string;      // indicative spread / pip val
  change: number;   // static mock % change for display
}

const MAJOR_PAIRS: Pair[] = [
  { symbol: "FOREXCOM:EURUSD", label: "EUR/USD", base: "EUR", quote: "USD", flag: "🇪🇺🇺🇸", pip: "0.1 pip", change: 0.12 },
  { symbol: "FOREXCOM:GBPUSD", label: "GBP/USD", base: "GBP", quote: "USD", flag: "🇬🇧🇺🇸", pip: "0.3 pip", change: -0.08 },
  { symbol: "FOREXCOM:USDJPY", label: "USD/JPY", base: "USD", quote: "JPY", flag: "🇺🇸🇯🇵", pip: "0.4 pip", change: 0.22 },
  { symbol: "FOREXCOM:USDCHF", label: "USD/CHF", base: "USD", quote: "CHF", flag: "🇺🇸🇨🇭", pip: "0.5 pip", change: -0.05 },
  { symbol: "FOREXCOM:AUDUSD", label: "AUD/USD", base: "AUD", quote: "USD", flag: "🇦🇺🇺🇸", pip: "0.4 pip", change: 0.31 },
  { symbol: "FOREXCOM:USDCAD", label: "USD/CAD", base: "USD", quote: "CAD", flag: "🇺🇸🇨🇦", pip: "0.5 pip", change: -0.15 },
  { symbol: "FOREXCOM:NZDUSD", label: "NZD/USD", base: "NZD", quote: "USD", flag: "🇳🇿🇺🇸", pip: "0.7 pip", change: 0.09 },
];

const MINOR_PAIRS: Pair[] = [
  { symbol: "FOREXCOM:EURGBP", label: "EUR/GBP", base: "EUR", quote: "GBP", flag: "🇪🇺🇬🇧", pip: "0.5 pip", change: -0.11 },
  { symbol: "FOREXCOM:EURJPY", label: "EUR/JPY", base: "EUR", quote: "JPY", flag: "🇪🇺🇯🇵", pip: "0.6 pip", change: 0.41 },
  { symbol: "FOREXCOM:GBPJPY", label: "GBP/JPY", base: "GBP", quote: "JPY", flag: "🇬🇧🇯🇵", pip: "0.9 pip", change: 0.18 },
  { symbol: "FOREXCOM:AUDJPY", label: "AUD/JPY", base: "AUD", quote: "JPY", flag: "🇦🇺🇯🇵", pip: "0.8 pip", change: -0.27 },
  { symbol: "FOREXCOM:EURAUD", label: "EUR/AUD", base: "EUR", quote: "AUD", flag: "🇪🇺🇦🇺", pip: "0.9 pip", change: 0.06 },
  { symbol: "FOREXCOM:CADJPY", label: "CAD/JPY", base: "CAD", quote: "JPY", flag: "🇨🇦🇯🇵", pip: "0.9 pip", change: 0.33 },
  { symbol: "FOREXCOM:GBPAUD", label: "GBP/AUD", base: "GBP", quote: "AUD", flag: "🇬🇧🇦🇺", pip: "1.2 pip", change: -0.14 },
  { symbol: "FOREXCOM:EURCAD", label: "EUR/CAD", base: "EUR", quote: "CAD", flag: "🇪🇺🇨🇦", pip: "1.1 pip", change: 0.07 },
];

interface ForexWatchlistProps {
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

function PairRow({
  pair,
  isSelected,
  onSelect,
}: {
  pair: Pair;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const isUp = pair.change >= 0;

  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group relative overflow-hidden ${isSelected
          ? "bg-teal-500/10 border border-teal-500/30"
          : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/[0.08]"
        }`}
    >
      {/* Active indicator */}
      {isSelected && (
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-teal-400 rounded-r-full" />
      )}

      {/* Flag + Label */}
      <div className="flex items-center gap-2.5">
        <span className="text-base leading-none">{pair.flag}</span>
        <div className="flex flex-col items-start">
          <span className={`text-[13px] font-bold leading-tight ${isSelected ? "text-teal-400" : "text-white group-hover:text-teal-300"}`}>
            {pair.label}
          </span>
          <span className="text-[10px] text-slate-500 mt-0.5">{pair.pip}</span>
        </div>
      </div>

      {/* Change + Arrow */}
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center gap-0.5 text-xs font-semibold ${isUp ? "text-emerald-400" : "text-rose-400"}`}>
          {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isUp ? "+" : ""}{pair.change.toFixed(2)}%
        </div>
        <ChevronRight className={`w-3.5 h-3.5 transition-all ${isSelected ? "text-teal-400 translate-x-0.5" : "text-slate-600 group-hover:text-slate-400"}`} />
      </div>
    </button>
  );
}

function ForexWatchlist({ selectedSymbol, onSelectSymbol }: ForexWatchlistProps) {
  const [activeTab, setActiveTab] = useState<"major" | "minor">("major");
  const pairs = activeTab === "major" ? MAJOR_PAIRS : MINOR_PAIRS;

  return (
    <div
      className="flex flex-col w-full h-full bg-[#080b12] rounded-xl overflow-hidden border"
      style={{ borderColor: "rgba(20,184,166,0.2)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent shrink-0">
        <h3 className="text-sm font-semibold text-white">Forex Pairs</h3>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          FOREXCOM
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-3 pt-2.5 pb-1 shrink-0">
        {(["major", "minor"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[11px] font-bold rounded-md capitalize transition-all ${activeTab === tab
                ? "bg-teal-500/15 text-teal-400 border border-teal-500/30"
                : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-300 border border-transparent"
              }`}
          >
            {tab === "major" ? "Major Pairs" : "Minor Pairs"}
          </button>
        ))}
      </div>

      {/* Pair List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1.5 custom-scrollbar">
        {pairs.map((pair) => (
          <PairRow
            key={pair.symbol}
            pair={pair}
            isSelected={selectedSymbol === pair.symbol}
            onSelect={() => onSelectSymbol(pair.symbol)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/[0.05] shrink-0">
        <p className="text-[10px] text-slate-500 text-center">
          Chart data via TradingView · Source: forex.com
        </p>
      </div>
    </div>
  );
}

export default memo(ForexWatchlist);
