"use client";

import { Bell, Search, User, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export function Header() {
    return (
        <header className="h-14 flex items-center justify-between px-5 border-b border-white/[0.06] bg-[#080b12]/80 backdrop-blur-sm flex-shrink-0">
            {/* Search bar */}
            <div className="flex items-center gap-2 flex-1 max-w-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search stocks, crypto, ETFs..."
                        className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        ⌘K
                    </kbd>
                </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
                {/* Market status */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 mr-2">
                    <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-xs font-medium text-emerald-400">NSE Live</span>
                </div>

                {/* Notifications */}
                <button className="relative p-2 rounded-lg hover:bg-white/[0.06] transition-colors text-slate-400 hover:text-white">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                </button>

                {/* User */}
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/[0.06] transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-black" />
                    </div>
                    <span className="text-sm text-slate-300 hidden sm:inline">Account</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 hidden sm:inline" />
                </button>
            </div>
        </header>
    );
}
