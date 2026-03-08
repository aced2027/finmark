"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    BarChart2,
    Bitcoin,
    BookOpen,
    Star,
    TrendingUp,
    Search,
    Activity,
    Zap,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/", label: "India Markets", icon: BarChart2 },
    { href: "/us-markets", label: "US Markets", icon: BarChart2 },
    { href: "/forex", label: "Forex", icon: TrendingUp },
    { href: "/crypto", label: "Crypto", icon: Bitcoin },
    { href: "/predictions", label: "Predictions", icon: TrendingUp },
    { href: "/screener", label: "Screener", icon: Search },
    { href: "/ai-insights", label: "AI Insights", icon: Zap },
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <motion.aside
            animate={{ width: collapsed ? 64 : 220 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="relative flex flex-col h-screen bg-[#080b12] border-r border-white/[0.06] flex-shrink-0 overflow-hidden"
        >
            {/* Logo */}
            <div className="flex items-center justify-between px-4 py-5 border-b border-white/[0.06]">
                <AnimatePresence mode="wait">
                    {!collapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-2.5"
                        >
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                                <Activity className="w-4 h-4 text-black" />
                            </div>
                            <span className="font-bold text-white tracking-tight text-lg">
                                fin<span className="text-emerald-400">mark</span>
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>
                {collapsed && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center mx-auto">
                        <Activity className="w-4 h-4 text-black" />
                    </div>
                )}
            </div>

            {/* Nav items */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                "flex items-center gap-3 px-2.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                                active
                                    ? "text-white bg-emerald-500/10 border border-emerald-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/[0.05] border border-transparent"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-4.5 h-4.5 flex-shrink-0",
                                    active ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"
                                )}
                                size={18}
                            />
                            <AnimatePresence mode="wait">
                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="truncate"
                                    >
                                        {label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Pro badge */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mx-3 mb-4 p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20"
                    >
                        <p className="text-xs font-semibold text-white mb-0.5">Upgrade to Pro</p>
                        <p className="text-[11px] text-slate-400 mb-2">Unlock AI insights + unlimited watchlist</p>
                        <button className="w-full py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold hover:opacity-90 transition-opacity">
                            Go Pro
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Collapse button */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-5 -right-3 w-6 h-6 rounded-full bg-[#0f1420] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors z-10"
            >
                {collapsed ? (
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                ) : (
                    <ChevronLeft className="w-3 h-3 text-slate-400" />
                )}
            </button>
        </motion.aside>
    );
}
