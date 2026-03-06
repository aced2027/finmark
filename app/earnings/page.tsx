export default function EarningsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-5.5rem)] p-6">
            <div className="glass-card p-10 text-center max-w-md w-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <span className="text-3xl">📅</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Earnings Calendar</h2>
                <p className="text-sm text-slate-400 mb-6">
                    Track upcoming Q3 corporate earnings, historically analyze missed vs hit EPS, and more.
                </p>
                <button className="w-full py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium text-sm hover:bg-emerald-500/20 transition-colors">
                    Coming Soon
                </button>
            </div>
        </div>
    );
}
