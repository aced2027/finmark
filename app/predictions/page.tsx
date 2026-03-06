export default function PredictionsPage() {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-5.5rem)] p-6">
            <div className="glass-card p-10 text-center max-w-md w-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/30 flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                    <span className="text-3xl">🔮</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Prediction Markets</h2>
                <p className="text-sm text-slate-400 mb-6">
                    Bet on the outcome of economic events, corporate milestones, and major crypto moves.
                </p>
                <button className="w-full py-2.5 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400 font-medium text-sm hover:bg-orange-500/20 transition-colors">
                    Coming Soon
                </button>
            </div>
        </div>
    );
}
