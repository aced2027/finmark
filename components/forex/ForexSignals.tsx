import { Target, Clock, ArrowRight } from "lucide-react";

export default function ForexSignals() {
    const signals = [
        { pair: "EUR/USD", type: "BUY", entry: "1.0850", target: "1.0920", stopLoss: "1.0810", time: "10 mins ago", status: "Active" },
        { pair: "GBP/JPY", type: "SELL", entry: "190.20", target: "188.50", stopLoss: "191.00", time: "1 hour ago", status: "Active" },
        { pair: "USD/CAD", type: "BUY", entry: "1.3420", target: "1.3500", stopLoss: "1.3380", time: "3 hours ago", status: "Achieved" },
        { pair: "AUD/USD", type: "SELL", entry: "0.6550", target: "0.6480", stopLoss: "0.6590", time: "5 hours ago", status: "Active" },
    ];

    return (
        <div className="glass-card flex flex-col h-full bg-[#080b12] rounded-xl overflow-hidden border" style={{ borderColor: "rgba(20, 184, 166, 0.2)" }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent shrink-0">
                <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-teal-400" />
                    <h3 className="text-sm font-semibold text-white">Latest Trading Signals</h3>
                </div>
                <span className="text-xs text-slate-400 cursor-pointer hover:text-white transition-colors flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                </span>
            </div>
            <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-2">
                {signals.map((signal, idx) => (
                    <div key={idx} className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3 hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                        <div
                            className="absolute left-0 top-0 bottom-0 w-1 opacity-50 group-hover:opacity-100 transition-opacity"
                            style={{
                                background: signal.type === "BUY"
                                    ? "linear-gradient(to bottom, #10b981, transparent)"
                                    : "linear-gradient(to bottom, #ef4444, transparent)",
                            }}
                        />
                        <div className="flex justify-between items-start mb-2 pl-1">
                            <div>
                                <h4 className="font-bold text-white text-sm">{signal.pair}</h4>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    <span className="text-[10px] text-slate-400">{signal.time}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <span
                                    className={`text-xs font-bold px-2 py-0.5 rounded-sm ${signal.type === "BUY"
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                        }`}
                                >
                                    {signal.type}
                                </span>
                                <span
                                    className={`text-[10px] mt-1 ${signal.status === "Achieved" ? "text-amber-400" : "text-slate-400"
                                        }`}
                                >
                                    {signal.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-white/[0.05] pl-1">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Entry</p>
                                <p className="text-xs font-medium text-slate-200">{signal.entry}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Target</p>
                                <p className="text-xs font-medium text-emerald-400">{signal.target}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Stop</p>
                                <p className="text-xs font-medium text-rose-400">{signal.stopLoss}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
