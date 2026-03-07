"use client";
import { Calendar, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

export default function PredictionsPage() {
    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden">
            {/* Main scrollable area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 lg:p-6">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Header */}
                        <div className="glass-card p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                                    <span className="text-2xl">🔮</span>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white tracking-tight">
                                        Weekly Trading Predictions
                                    </h1>
                                    <p className="text-sm text-slate-400">
                                        Expert analysis and market forecasts
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date().toLocaleDateString("en-US", { 
                                        weekday: "long", 
                                        year: "numeric", 
                                        month: "long", 
                                        day: "numeric" 
                                    })}</span>
                                </div>
                                <span>•</span>
                                <span>Week {Math.ceil((new Date().getDate()) / 7)}, {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
                            </div>
                        </div>

                        {/* Market Overview */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-400" />
                                Market Overview
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Write your market overview here. Discuss the overall market sentiment, major economic events, 
                                    and key factors influencing the markets this week.
                                </p>
                                <p className="text-slate-300 leading-relaxed">
                                    Include analysis of global markets, sector performance, and any significant news that could 
                                    impact trading decisions.
                                </p>
                            </div>
                        </div>

                        {/* Key Predictions */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Key Predictions</h2>
                            
                            {/* Prediction Card 1 - Bullish */}
                            <div className="space-y-4">
                                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-white mb-2">
                                                Bullish Prediction Title
                                            </h3>
                                            <p className="text-sm text-slate-300 mb-3">
                                                Write your bullish prediction here. Explain why you expect this stock/sector 
                                                to perform well this week. Include technical analysis, fundamental factors, 
                                                and price targets.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    Target: +5-8%
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                                                    Technology Sector
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Prediction Card 2 - Bearish */}
                                <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                            <TrendingDown className="w-4 h-4 text-red-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-white mb-2">
                                                Bearish Prediction Title
                                            </h3>
                                            <p className="text-sm text-slate-300 mb-3">
                                                Write your bearish prediction here. Explain the risks and why you expect 
                                                downward pressure. Include support levels and risk management strategies.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                    Target: -3-5%
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                                                    Energy Sector
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Prediction Card 3 - Neutral/Watch */}
                                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <AlertCircle className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-bold text-white mb-2">
                                                Watch List / Neutral Outlook
                                            </h3>
                                            <p className="text-sm text-slate-300 mb-3">
                                                Stocks or sectors to watch closely. Explain the uncertainty and what 
                                                catalysts could trigger movement in either direction.
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    Wait & Watch
                                                </span>
                                                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700/50 text-slate-300">
                                                    Financial Services
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Technical Analysis */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-white mb-4">Technical Analysis</h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Provide detailed technical analysis here. Discuss key support and resistance levels, 
                                    chart patterns, indicators (RSI, MACD, Moving Averages), and volume analysis.
                                </p>
                                <ul className="text-slate-300 space-y-2 list-disc list-inside">
                                    <li>Key support level: Write your analysis</li>
                                    <li>Key resistance level: Write your analysis</li>
                                    <li>Trend analysis: Write your analysis</li>
                                    <li>Volume patterns: Write your analysis</li>
                                </ul>
                            </div>
                        </div>

                        {/* Risk Factors */}
                        <div className="glass-card p-6">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-orange-400" />
                                Risk Factors & Disclaimer
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <p className="text-slate-300 leading-relaxed mb-4">
                                    Outline the key risks to watch this week. Include geopolitical events, economic data 
                                    releases, earnings reports, and other factors that could impact your predictions.
                                </p>
                                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 mt-4">
                                    <p className="text-xs text-slate-400 leading-relaxed">
                                        <strong className="text-orange-400">Disclaimer:</strong> This content is for 
                                        informational and educational purposes only. It should not be considered financial 
                                        advice. Always do your own research and consult with a qualified financial advisor 
                                        before making investment decisions. Past performance does not guarantee future results.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Spacing */}
                        <div className="h-8"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
