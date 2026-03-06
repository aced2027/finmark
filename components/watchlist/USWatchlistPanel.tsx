"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Plus, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stock {
    symbol: string;
    name: string;
    price: number;
    changePct: number;
    exchange: string;
}

const DEFAULT_US_STOCKS: Stock[] = [
    { symbol: "AAPL", name: "Apple Inc.", price: 178.25, changePct: 0.85, exchange: "NASDAQ" },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 425.50, changePct: 1.12, exchange: "NASDAQ" },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.30, changePct: -0.45, exchange: "NASDAQ" },
    { symbol: "TSLA", name: "Tesla Inc.", price: 245.67, changePct: -1.23, exchange: "NASDAQ" },
];

export function USWatchlistPanel() {
    const [stocks, setStocks] = useState<Stock[]>(DEFAULT_US_STOCKS);
    const [input, setInput] = useState("");
    const [showInput, setShowInput] = useState(false);

    const addStock = () => {
        const sym = input.trim().toUpperCase();
        if (!sym || stocks.find((s) => s.symbol === sym)) return;
        setStocks((prev) => [
            ...prev,
            {
                symbol: sym,
                name: sym,
                price: Math.random() * 500 + 100,
                changePct: (Math.random() - 0.5) * 4,
                exchange: "NASDAQ",
            },
        ]);
        setInput("");
        setShowInput(false);
    };

    return (
        <div className="rounded-xl border border-white/10 bg-[#1a1d29] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
                <h2 className="text-base font-semibold text-white">Watchlist</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{stocks.length}/20</span>
                    <button className="text-slate-500 hover:text-slate-300 transition-colors">
                        <Settings2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {showInput && (
                <div className="p-3 border-b border-white/10">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addStock()}
                            placeholder="Add symbol..."
                            autoFocus
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                        />
                        <button
                            onClick={addStock}
                            className="px-4 py-2 rounded-lg bg-blue-500/15 border border-blue-500/20 text-blue-400 hover:bg-blue-500/25 transition-all text-sm font-medium"
                        >
                            Add
                        </button>
                    </div>
                </div>
            )}

            <div className="divide-y divide-white/10">
                <AnimatePresence>
                    {stocks.map((stock) => (
                        <motion.div
                            key={stock.symbol}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="group flex items-center gap-3 p-4 hover:bg-white/[0.02] transition-colors"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                    {stock.symbol.substring(0, 2)}
                                </span>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-medium text-white truncate">
                                    {stock.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {stock.symbol} · {stock.exchange}
                                </p>
                            </div>

                            <div className="text-right flex-shrink-0">
                                <p className="text-sm font-semibold text-white">
                                    ${stock.price.toLocaleString("en-US", { 
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2 
                                    })}
                                </p>
                                <p className={cn(
                                    "text-xs font-medium",
                                    stock.changePct >= 0 ? "text-emerald-400" : "text-red-400"
                                )}>
                                    {stock.changePct >= 0 ? "+" : ""}
                                    {stock.changePct.toFixed(2)}%
                                </p>
                            </div>

                            <button className="text-slate-600 hover:text-amber-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                                <Star className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>

                <button
                    onClick={() => setShowInput(!showInput)}
                    className="w-full flex items-center justify-center gap-2 p-4 text-slate-500 hover:text-blue-400 hover:bg-white/[0.02] transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm font-medium">Add symbol</span>
                </button>
            </div>
        </div>
    );
}
