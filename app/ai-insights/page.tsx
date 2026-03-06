"use client";

import { useState } from "react";
import { Zap, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const SAMPLE_QUERIES = [
    "Why is NIFTY falling today?",
    "Analyze Reliance Q3 earnings",
    "Is Bitcoin in a bull market?",
    "Show me top dividend stocks",
];

export default function AIInsightsPage() {
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResult(null);

        // Mock simulation of API response
        setTimeout(() => {
            setResult("NIFTY 50 is experiencing downward pressure today (-0.55%) due to a mix of global headwinds and profit-booking in IT and FMCG sectors. The US Fed signaled a 'higher for longer' rate path which led to foreign institutional outflows. However, Bank Nifty is outperforming on hopes of RBI policy divergence.\n\nKey Support: 22,350\nKey Resistance: 22,600");
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar h-[calc(100vh-5.5rem)]">
            <div className="max-w-3xl mx-auto mt-8 lg:mt-16 text-center">
                {/* Header */}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 mb-6 shadow-glow relative">
                    <Zap className="w-8 h-8 text-violet-400 relative z-10" />
                    <motion.div
                        className="absolute inset-0 rounded-2xl bg-violet-500/20"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4">
                    finmark <span className="text-violet-400">AI</span>
                </h1>
                <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
                    Ask complex financial questions in plain English. Powered by real-time market data and advanced LLMs.
                </p>

                {/* Input Form */}
                <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 blur-xl opacity-30 rounded-full" />
                    <div className="relative flex items-center bg-white/[0.04] border border-white/10 rounded-full p-2 backdrop-blur-md shadow-2xl transition-all focus-within:border-violet-500/50 focus-within:bg-white/[0.06]">
                        <Sparkles className="w-5 h-5 text-violet-400 ml-4 flex-shrink-0" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ask anything about the markets..."
                            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-white placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            disabled={!query.trim() || isLoading}
                            className="w-10 h-10 rounded-full bg-violet-500 hover:bg-violet-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                </form>

                {/* Sample Queries */}
                {!isLoading && !result && (
                    <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
                        {SAMPLE_QUERIES.map((q) => (
                            <button
                                key={q}
                                onClick={() => setQuery(q)}
                                className="px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.02] text-xs text-slate-400 hover:text-white hover:bg-white/[0.06] hover:border-violet-500/30 transition-all font-medium"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {/* Result Area */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="glass-card max-w-2xl mx-auto p-6 text-left mt-8 border-violet-500/20"
                        >
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                                    <Zap className="w-4 h-4 text-violet-400" />
                                </div>
                                <div className="flex-1 space-y-3 pt-2">
                                    <div className="h-4 bg-white/5 rounded w-3/4 animate-pulse" />
                                    <div className="h-4 bg-white/5 rounded w-full animate-pulse" />
                                    <div className="h-4 bg-white/5 rounded w-5/6 animate-pulse" />
                                    <p className="text-xs text-slate-500 font-medium pt-2">Analyzing 10+ news sources and live TICK data...</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {result && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card max-w-2xl mx-auto p-6 text-left mt-8 border-violet-500/30 shadow-[0_0_30px_rgba(139,92,246,0.1)]"
                        >
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                                        {result}
                                    </p>

                                    {/* Citations Mock */}
                                    <div className="mt-5 pt-4 border-t border-white/[0.06]">
                                        <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Sources</h4>
                                        <div className="flex gap-2">
                                            <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded border border-violet-400/20">
                                                Economic Times
                                            </span>
                                            <span className="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded border border-violet-400/20">
                                                NSE Live Data
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
}
