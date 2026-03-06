"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ExternalLink, Zap, RefreshCw } from "lucide-react";
import { NEWS_ITEMS } from "@/lib/mock-data";
import { cn, timeAgo } from "@/lib/utils";

const AI_SUMMARY =
    "Indian equities closed mixed on Tuesday amid diverging global cues. The Sensex slipped 387 points dragged by IT heavyweights, while Bank Nifty bucked the trend rising 0.49% on expectations of an RBI rate cut. FII activity remained cautious ahead of US Fed minutes. Bitcoin held above $67K with ETF inflow momentum intact. Key watch: HDFC Bank Q3 results due Wednesday.";

const sentimentColors: Record<string, string> = {
    positive: "text-emerald-400 bg-emerald-400/10",
    negative: "text-red-400 bg-red-400/10",
    neutral: "text-slate-400 bg-slate-400/10",
};

export function MarketSummary() {
    const [expanded, setExpanded] = useState(true);
    const [newsOpen, setNewsOpen] = useState(false);

    return (
        <div className="glass-card p-5">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-violet-500/20 flex items-center justify-center">
                        <Zap className="w-3.5 h-3.5 text-violet-400" />
                    </div>
                    <h2 className="text-sm font-semibold text-white">AI Market Summary</h2>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/20 font-medium">
                        AI
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5">
                        <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                    >
                        <ChevronDown
                            className={cn(
                                "w-3.5 h-3.5 transition-transform",
                                !expanded && "-rotate-90"
                            )}
                        />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                    >
                        {/* AI summary text */}
                        <p className="text-sm text-slate-300 leading-relaxed mb-4 border-l-2 border-violet-500/40 pl-3">
                            {AI_SUMMARY}
                        </p>

                        {/* News toggle */}
                        <button
                            onClick={() => setNewsOpen(!newsOpen)}
                            className="flex items-center justify-between w-full py-2 px-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] transition-all text-sm"
                        >
                            <span className="text-slate-300 font-medium text-xs">
                                Top Headlines ({NEWS_ITEMS.length})
                            </span>
                            <ChevronDown
                                className={cn(
                                    "w-3.5 h-3.5 text-slate-500 transition-transform",
                                    newsOpen && "rotate-180"
                                )}
                            />
                        </button>

                        <AnimatePresence>
                            {newsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden mt-2 space-y-1"
                                >
                                    {NEWS_ITEMS.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                        >
                                            <span
                                                className={cn(
                                                    "text-[10px] font-medium px-1.5 py-0.5 rounded uppercase tracking-wide flex-shrink-0 mt-0.5",
                                                    sentimentColors[item.sentiment]
                                                )}
                                            >
                                                {item.category}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-slate-300 group-hover:text-white transition-colors leading-relaxed">
                                                    {item.headline}
                                                </p>
                                                <p className="text-[11px] text-slate-600 mt-0.5">
                                                    {item.source} · {item.time}
                                                </p>
                                            </div>
                                            <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 transition-colors" />
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
