import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatINR(value: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatNumber(value: number): string {
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(2)}K`;
    return value.toFixed(2);
}

export function formatPercent(value: number): string {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(2)}%`;
}

export function getChangeColor(value: number): string {
    if (value > 0) return "text-emerald-400";
    if (value < 0) return "text-red-400";
    return "text-slate-400";
}

export function getChangeBg(value: number): string {
    if (value > 0) return "bg-emerald-500/10 border-emerald-500/20";
    if (value < 0) return "bg-red-500/10 border-red-500/20";
    return "bg-slate-500/10 border-slate-500/20";
}

export function generateSparklineData(
    baseValue: number,
    points = 20,
    volatility = 0.01
) {
    const data = [];
    let current = baseValue;
    for (let i = 0; i < points; i++) {
        current = current * (1 + (Math.random() - 0.5) * volatility * 2);
        data.push({ value: parseFloat(current.toFixed(2)) });
    }
    return data;
}

export function timeAgo(date: Date | string): string {
    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}
