"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, StarOff, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { WATCHLIST_STOCKS } from "@/lib/mock-data";
import { cn, formatPercent } from "@/lib/utils";

type Stock = (typeof WATCHLIST_STOCKS)[number] & { starred?: boolean };

export function WatchlistPanel() {
    const [stocks, setStocks] = useState<Stock[]>(
        WATCHLIST_STOCKS.map((s, i) => ({ ...s, starred: i < 3 }))
    );
    const [input, setInput] = useState("");

    const toggleStar = (symbol: string) => {
        setStocks((prev) =>
            prev.map((s) => (s.symbol === symbol ? { ...s, starred: !s.starred } : s))
        );
    };

    const removeStock = (symbol: string) => {
        setStocks((prev) => prev.filter((s) => s.symbol !== symbol));
    };

    const addStock = () => {
        const sym = input.trim().toUpperCase();
        if (!sym || stocks.find((s) => s.symbol === sym)) return;
        setStocks((prev) => [
            ...prev,
            {
                symbol: sym,
                name: sym,
                price: Math.random() * 2000 + 500,
                changePct: (Math.random() - 0.5) * 4,
                exchange: "NSE",
                starred: false,
            },
        ]);
        setInput("");
    };

    const starred = stocks.filter((s) => s.starred);
    const rest = stocks.filter((s) => !s.starred);
    const sorted = [...starred, ...rest];

    return (
        <div className="glass-card flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <h2 className="text-sm font-semibold text-white">Watchlist</h2>
                <span className="text-[11px] text-slate-500">{stocks.length}/20</span>
            </div>

            {/* Add stock */}
            <div className="p-3 border-b border-white/[0.06]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addStock()}
                        placeholder="Add symbol..."
                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
                    />
                    <button
                        onClick={addStock}
                        className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/25 transition-all"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Stock list */}
            <div className="flex-1 overflow-y-auto py-1">
                <AnimatePresence>
                    {sorted.map((stock) => (
                        <motion.div
                            key={stock.symbol}
                            layout
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="group flex items-center gap-2 px-3 py-2.5 hover:bg-white/[0.04] transition-colors"
                        >
                            {/* Star */}
                            <button
                                onClick={() => toggleStar(stock.symbol)}
                                className="text-slate-600 hover:text-amber-400 transition-colors flex-shrink-0"
                            >
                                {stock.starred ? (
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ) : (
                                    <Star className="w-3.5 h-3.5" />
                                )}
                            </button>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-xs font-bold text-white">{stock.symbol}</span>
                                    <span className="text-[10px] text-slate-600">{stock.exchange}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 truncate">{stock.name}</p>
                            </div>

                            {/* Price + change */}
                            <div className="text-right flex-shrink-0">
                                <p className="text-xs font-mono font-semibold text-white">
                                    ₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <div
                                    className={cn(
                                        "flex items-center justify-end gap-0.5 text-[11px] font-medium",
                                        stock.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                                    )}
                                >
                                    {stock.changePct >= 0 ? (
                                        <TrendingUp className="w-3 h-3" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3" />
                                    )}
                                    {formatPercent(stock.changePct)}
                                </div>
                            </div>

                            {/* Delete (hover) */}
                            <button
                                onClick={() => removeStock(stock.symbol)}
                                className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all flex-shrink-0"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
