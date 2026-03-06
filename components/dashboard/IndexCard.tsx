"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    Tooltip,
} from "recharts";
import { cn, formatPercent, generateSparklineData } from "@/lib/utils";
import { useMemo } from "react";

interface IndexCardProps {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePct: number;
    currency: string;
    market: string;
    index: number;
}

export function IndexCard({
    symbol,
    name,
    price,
    change,
    changePct,
    currency,
    index,
}: IndexCardProps) {
    const isPositive = changePct > 0;
    const isNeutral = changePct === 0;
    const sparkData = useMemo(
        () => generateSparklineData(price, 24, 0.008),
        [symbol]
    );

    const priceStr =
        currency === "INR"
            ? `₹${price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
            : `$${price.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "glass-card p-4 cursor-pointer group transition-all duration-300",
                "hover:border-white/[0.12]",
                isPositive && "hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]",
                !isPositive && !isNeutral && "hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]"
            )}
        >
            {/* Symbol + badge */}
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">
                        {symbol}
                    </p>
                    <p className="text-sm font-semibold text-slate-200 truncate max-w-[120px]">
                        {name}
                    </p>
                </div>
                <div
                    className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold",
                        isPositive
                            ? "bg-emerald-500/15 text-emerald-400"
                            : isNeutral
                                ? "bg-slate-500/15 text-slate-400"
                                : "bg-red-500/15 text-red-400"
                    )}
                >
                    {isPositive ? (
                        <TrendingUp className="w-3 h-3" />
                    ) : isNeutral ? (
                        <Minus className="w-3 h-3" />
                    ) : (
                        <TrendingDown className="w-3 h-3" />
                    )}
                    {formatPercent(changePct)}
                </div>
            </div>

            {/* Price */}
            <p className="text-xl font-bold text-white font-mono tracking-tight mb-1">
                {priceStr}
            </p>
            <p
                className={cn(
                    "text-xs font-medium mb-3",
                    isPositive ? "text-emerald-400" : isNeutral ? "text-slate-400" : "text-red-400"
                )}
            >
                {isPositive ? "+" : ""}
                {currency === "INR"
                    ? `₹${change.toFixed(2)}`
                    : `$${change.toFixed(2)}`}{" "}
                today
            </p>

            {/* Sparkline */}
            <div className="h-14 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id={`grad-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor={isPositive ? "#22c55e" : "#ef4444"}
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor={isPositive ? "#22c55e" : "#ef4444"}
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke={isPositive ? "#22c55e" : "#ef4444"}
                            strokeWidth={1.5}
                            fill={`url(#grad-${symbol})`}
                            dot={false}
                            isAnimationActive={true}
                        />
                        <Tooltip
                            contentStyle={{ display: "none" }}
                            cursor={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
