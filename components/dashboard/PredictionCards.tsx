"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Volume2 } from "lucide-react";
import { PREDICTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PredictionCards() {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-semibold text-white">Prediction Markets</h2>
                <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                    View all →
                </button>
            </div>

            {PREDICTIONS.map((pred, i) => (
                <motion.div
                    key={pred.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4 }}
                    whileHover={{ y: -1 }}
                    className="glass-card p-4 cursor-pointer hover:border-white/[0.12] transition-all group"
                >
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wide bg-white/[0.06] text-slate-400 font-medium">
                                    {pred.category}
                                </span>
                                {pred.trending && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 border border-orange-500/20 font-medium">
                                        🔥 Hot
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-slate-200 font-medium leading-snug">
                                {pred.question}
                            </p>
                        </div>
                    </div>

                    {/* Probability bar */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-emerald-400 font-semibold">YES {pred.yesProb}%</span>
                            <span className="text-red-400 font-semibold">NO {100 - pred.yesProb}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${pred.yesProb}%` }}
                                transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                                className={cn(
                                    "h-full rounded-full",
                                    pred.yesProb >= 50
                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                                        : "bg-gradient-to-r from-red-500 to-orange-400"
                                )}
                            />
                        </div>
                    </div>

                    {/* Volume + trend */}
                    <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                            <Volume2 className="w-3 h-3" />
                            <span>Vol: {pred.volume}</span>
                        </div>
                        {pred.yesProb >= 50 ? (
                            <div className="flex items-center gap-1 text-emerald-500">
                                <TrendingUp className="w-3 h-3" />
                                <span>Bullish</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-red-500">
                                <TrendingDown className="w-3 h-3" />
                                <span>Bearish</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
