import { ExternalLink } from "lucide-react";

interface AdBannerProps {
    variant?: "leaderboard" | "rectangle";
    className?: string;
}

export default function AdBanner({ variant = "leaderboard", className = "" }: AdBannerProps) {
    const isLeaderboard = variant === "leaderboard";

    return (
        <div
            className={`relative w-full overflow-hidden rounded-xl border border-dashed group transition-all
                ${isLeaderboard ? "h-[90px]" : "h-[250px]"}
                ${className}`}
            style={{
                borderColor: "rgba(255,255,255,0.12)",
                background: "linear-gradient(135deg, rgba(8,11,18,0.95) 0%, rgba(14,18,28,0.95) 100%)",
            }}
        >
            {/* Dot grid background */}
            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle at 1.5px 1.5px, rgba(255,255,255,0.8) 1.5px, transparent 0)",
                    backgroundSize: "22px 22px",
                }}
            />

            {/* Google G watermark */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.04] select-none pointer-events-none">
                <span className="text-white font-black" style={{ fontSize: isLeaderboard ? "52px" : "90px" }}>G</span>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center gap-1.5 px-6">
                <div className="flex items-center gap-2">
                    {/* Google logo colors */}
                    <div className="flex gap-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 opacity-70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 opacity-70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 opacity-70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 opacity-70" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-widest select-none">
                        Advertisement
                    </span>
                    <ExternalLink className="w-3 h-3 text-slate-600" />
                </div>
                <p className="text-xs text-slate-500 group-hover:text-slate-400 transition-colors text-center leading-relaxed">
                    {isLeaderboard
                        ? "Google AdSense — Leaderboard (728×90) — Replace with your ad unit code"
                        : "Google AdSense — Rectangle (300×250) — Replace with your ad unit code"}
                </p>
                <span className="text-[10px] text-slate-600 font-mono mt-0.5">
                    {isLeaderboard ? "data-ad-slot: leaderboard" : "data-ad-slot: rectangle"}
                </span>
            </div>

            {/* Bottom accent line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
    );
}
