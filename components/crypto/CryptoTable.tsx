"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, MoreHorizontal } from "lucide-react";
import { CRYPTO_DATA } from "@/lib/mock-data";
import { cn, formatPercent } from "@/lib/utils";

export function CryptoTable() {
    return (
        <div className="glass-card overflow-hidden">
            <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-base font-semibold text-white">Top Cryptocurrencies</h2>
                <div className="flex gap-2">
                    <button className="text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/[0.06]">
                        24h Volume
                    </button>
                    <button className="text-xs font-medium text-slate-300 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors border border-white/[0.06]">
                        Market Cap
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left">
                    <thead className="text-[11px] uppercase tracking-wider text-slate-500 bg-white/[0.02] border-b border-white/[0.06]">
                        <tr>
                            <th className="px-5 py-3 font-semibold rounded-tl-lg">Asset</th>
                            <th className="px-5 py-3 font-semibold text-right">Price</th>
                            <th className="px-5 py-3 font-semibold text-right">24h Change</th>
                            <th className="px-5 py-3 font-semibold text-right">Volume</th>
                            <th className="px-5 py-3 font-semibold text-right">Market Cap</th>
                            <th className="px-5 py-3 font-semibold text-right">Funding Rate</th>
                            <th className="px-5 py-3 font-semibold text-center rounded-tr-lg">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                        {CRYPTO_DATA.map((coin, i) => {
                            const isPositive = coin.changePct >= 0;
                            const isFundingPositive = coin.fundingRate >= 0;

                            return (
                                <motion.tr
                                    key={coin.symbol}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-white/[0.03] transition-colors group cursor-pointer"
                                >
                                    {/* Asset */}
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold font-mono text-white group-hover:border-emerald-500/30 transition-colors">
                                                {coin.symbol.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white text-sm">{coin.symbol}</p>
                                                <p className="text-[11px] text-slate-500">{coin.name}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Price */}
                                    <td className="px-5 py-4 text-right">
                                        <p className="font-mono text-[13px] text-white font-medium">
                                            ${coin.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                                        </p>
                                    </td>

                                    {/* 24h Change */}
                                    <td className="px-5 py-4 text-right">
                                        <div
                                            className={cn(
                                                "inline-flex items-center justify-end gap-1 text-[13px] font-medium",
                                                isPositive ? "text-emerald-400" : "text-red-400"
                                            )}
                                        >
                                            {isPositive ? (
                                                <TrendingUp className="w-3.5 h-3.5" />
                                            ) : (
                                                <TrendingDown className="w-3.5 h-3.5" />
                                            )}
                                            {formatPercent(coin.changePct)}
                                        </div>
                                    </td>

                                    {/* Volume */}
                                    <td className="px-5 py-4 text-right text-[13px] text-slate-300 font-mono">
                                        ${coin.volume}
                                    </td>

                                    {/* Market Cap */}
                                    <td className="px-5 py-4 text-right text-[13px] text-slate-300 font-mono">
                                        ${coin.marketCap}
                                    </td>

                                    {/* Funding */}
                                    <td className="px-5 py-4 text-right">
                                        <span
                                            className={cn(
                                                "text-[12px] font-mono px-2 py-1 rounded bg-white/[0.04]",
                                                isFundingPositive ? "text-emerald-400" : "text-amber-400"
                                            )}
                                        >
                                            {isFundingPositive ? "+" : ""}
                                            {(coin.fundingRate * 100).toFixed(4)}%
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-5 py-4 text-center">
                                        <button className="text-slate-500 hover:text-white transition-colors p-1.5 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100">
                                            <MoreHorizontal className="w-4 h-4 mx-auto" />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
