export default function GoogleAdPlaceholder() {
    return (
        <div className="w-full bg-[#080b12] rounded-xl border border-dashed border-white/20 h-[100px] sm:h-[120px] lg:h-[350px] flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            <div className="px-3 py-1 rounded bg-white/5 text-[10px] font-mono text-slate-400 uppercase tracking-widest border border-white/10 mb-2">
                Advertisement
            </div>
            <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors">Google Ads Space (Flexible)</p>
        </div>
    );
}
