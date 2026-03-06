import { BookOpen, Clock, ArrowRight, TrendingUp, BarChart2, Globe } from "lucide-react";

interface BlogPost {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    tag: string;
    gradientFrom: string;
    gradientTo: string;
    icon: React.ReactNode;
    href?: string;
}

const POSTS: Record<string, BlogPost[]> = {
    "India Markets": [
        {
            title: "Nifty 50 Weekly Outlook: Key Levels to Watch This Week",
            excerpt: "The index is testing a crucial support zone near 22,000. A breakout above 22,400 could trigger a fresh bullish leg. Here's what the options data tells us.",
            date: "Mar 3, 2026",
            readTime: "4 min read",
            tag: "India Markets",
            gradientFrom: "#10b981",
            gradientTo: "#059669",
            icon: <TrendingUp className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "Bank Nifty Analysis: FII Activity & Derivative Trends",
            excerpt: "Foreign institutions ramped up long positions in Bank Nifty futures. PCR ratio suggests bullish bias heading into the RBI policy meeting next week.",
            date: "Mar 2, 2026",
            readTime: "5 min read",
            tag: "Sectoral Analysis",
            gradientFrom: "#6366f1",
            gradientTo: "#4f46e5",
            icon: <BarChart2 className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "Mid-Cap & Small-Cap Rotation: Where Smart Money Is Moving",
            excerpt: "Institutional flows show clear rotation from large-caps to quality mid-caps. We identify 5 sectors positioned for outperformance in the next quarter.",
            date: "Mar 1, 2026",
            readTime: "6 min read",
            tag: "Market Strategy",
            gradientFrom: "#f59e0b",
            gradientTo: "#d97706",
            icon: <Globe className="w-5 h-5 text-white" />,
            href: "#",
        },
    ],
    "US Markets": [
        {
            title: "S&P 500 Weekly Review: Fed Signals & Tech Earnings Impact",
            excerpt: "The Fed's latest minutes signal one more rate hike possible. Meanwhile, Magnificent 7 earnings beat expectations pushing Nasdaq to fresh highs.",
            date: "Mar 3, 2026",
            readTime: "5 min read",
            tag: "US Markets",
            gradientFrom: "#3b82f6",
            gradientTo: "#1d4ed8",
            icon: <TrendingUp className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "NASDAQ Deep Dive: AI Sector Valuations & Risk Factors",
            excerpt: "AI-driven momentum is stretching valuations. We break down PE ratios, earnings growth expectations, and where the next correction could come from.",
            date: "Mar 2, 2026",
            readTime: "6 min read",
            tag: "Tech Sector",
            gradientFrom: "#8b5cf6",
            gradientTo: "#6d28d9",
            icon: <BarChart2 className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "Dollar Index & Bond Yields: What's Driving Equity Moves",
            excerpt: "The inverse relationship between DXY and equity risk appetite is breaking down. Here's what the 10-year Treasury yield is signaling for stock markets.",
            date: "Mar 1, 2026",
            readTime: "4 min read",
            tag: "Macro Analysis",
            gradientFrom: "#14b8a6",
            gradientTo: "#0d9488",
            icon: <Globe className="w-5 h-5 text-white" />,
            href: "#",
        },
    ],
    "Forex": [
        {
            title: "EUR/USD Weekly Analysis: ECB Divergence & Dollar Strength",
            excerpt: "The ECB's dovish tilt is widening the policy gap with the Fed. EUR/USD faces strong resistance at 1.0950. Key support at 1.0780 must hold for bulls.",
            date: "Mar 3, 2026",
            readTime: "4 min read",
            tag: "Forex",
            gradientFrom: "#14b8a6",
            gradientTo: "#0d9488",
            icon: <TrendingUp className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "GBP/JPY & Carry Trade Unwind: Risk or Opportunity?",
            excerpt: "The BOJ's surprise rate hike threat is putting pressure on carry trades. GBP/JPY volatility has spiked — here's how to trade the upcoming inflection point.",
            date: "Mar 2, 2026",
            readTime: "5 min read",
            tag: "Carry Trades",
            gradientFrom: "#f59e0b",
            gradientTo: "#d97706",
            icon: <BarChart2 className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "DXY Outlook: Is Dollar Strength Sustainable into Q2?",
            excerpt: "The US Dollar Index is up 3% YTD. We examine positioning data, COT reports, and macro drivers to forecast where DXY heads in the next 8 weeks.",
            date: "Mar 1, 2026",
            readTime: "6 min read",
            tag: "Dollar Index",
            gradientFrom: "#6366f1",
            gradientTo: "#4f46e5",
            icon: <Globe className="w-5 h-5 text-white" />,
            href: "#",
        },
    ],
    "Crypto": [
        {
            title: "Bitcoin Weekly: On-Chain Signals Point to Accumulation Phase",
            excerpt: "Whale wallets are quietly accumulating while retail sentiment remains cautious. MVRV ratio and NVT signal BTC is undervalued at current prices.",
            date: "Mar 3, 2026",
            readTime: "5 min read",
            tag: "Bitcoin",
            gradientFrom: "#f59e0b",
            gradientTo: "#b45309",
            icon: <TrendingUp className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "Ethereum & Layer 2s: Where Is DeFi TVL Flowing?",
            excerpt: "Total Value Locked across L2s hit a new ATH. We track capital flows between Arbitrum, Base, and Optimism, and what it means for ETH price action.",
            date: "Mar 2, 2026",
            readTime: "5 min read",
            tag: "DeFi",
            gradientFrom: "#6366f1",
            gradientTo: "#3730a3",
            icon: <BarChart2 className="w-5 h-5 text-white" />,
            href: "#",
        },
        {
            title: "Altcoin Season Watch: Dominance Charts & Rotation Signals",
            excerpt: "BTC dominance is stalling at 54%. Historical patterns suggest we may be entering a brief altcoin rotation window. Here are the setups worth watching.",
            date: "Mar 1, 2026",
            readTime: "4 min read",
            tag: "Altcoins",
            gradientFrom: "#14b8a6",
            gradientTo: "#0f766e",
            icon: <Globe className="w-5 h-5 text-white" />,
            href: "#",
        },
    ],
};

interface WeeklyBlogProps {
    market: "India Markets" | "US Markets" | "Forex" | "Crypto";
}

function PostCard({ post }: { post: BlogPost }) {
    return (
        <a
            href={post.href ?? "#"}
            className="group flex flex-col rounded-xl overflow-hidden border border-white/[0.07] bg-[#080b12] hover:border-white/[0.14] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        >
            {/* Cover gradient */}
            <div
                className="h-[72px] relative flex items-end px-4 pb-3 shrink-0"
                style={{ background: `linear-gradient(135deg, ${post.gradientFrom}22 0%, ${post.gradientTo}44 100%)` }}
            >
                <div
                    className="absolute top-3 left-4 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${post.gradientFrom}, ${post.gradientTo})` }}
                >
                    {post.icon}
                </div>
                <span
                    className="ml-[2.75rem] text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border"
                    style={{
                        color: post.gradientFrom,
                        borderColor: `${post.gradientFrom}44`,
                        background: `${post.gradientFrom}11`,
                    }}
                >
                    {post.tag}
                </span>
                {/* Shine */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
            </div>

            {/* Body */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <h3 className="text-sm font-bold text-white leading-snug group-hover:text-teal-300 transition-colors line-clamp-2">
                    {post.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 flex-1">
                    {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 mt-auto border-t border-white/[0.05]">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                        </span>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-teal-400 group-hover:gap-2 transition-all">
                        Read <ArrowRight className="w-3 h-3" />
                    </span>
                </div>
            </div>
        </a>
    );
}

export default function WeeklyBlog({ market }: WeeklyBlogProps) {
    const posts = POSTS[market] ?? POSTS["India Markets"];

    return (
        <div className="w-full">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-teal-400" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-white">Weekly Analysis</h2>
                        <p className="text-xs text-slate-500">{market} · Market Commentary</p>
                    </div>
                </div>
                <a
                    href="#"
                    className="flex items-center gap-1.5 text-xs font-medium text-teal-400 hover:text-teal-300 transition-colors px-3 py-1.5 rounded-lg bg-teal-500/5 border border-teal-500/15 hover:border-teal-500/30"
                >
                    All Posts <ArrowRight className="w-3.5 h-3.5" />
                </a>
            </div>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {posts.map((post, i) => (
                    <PostCard key={i} post={post} />
                ))}
            </div>
        </div>
    );
}
