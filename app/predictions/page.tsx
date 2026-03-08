"use client";

import { useState } from "react";
import { Calendar, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: {
    marketOverview: string;
    topPicks: string;
    technicalAnalysis: string;
    risks: string;
  };
  readTime: string;
  featured: boolean;
}

// Sample posts - In production, fetch from WordPress API
const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Weekly Market Analysis - Jan 15-19, 2024",
    date: "2024-01-15",
    excerpt: "Markets showed strong momentum this week with Nifty gaining 2.3%. Banking and IT sectors led the rally while FMCG remained under pressure...",
    content: {
      marketOverview: "Markets showed strong momentum this week with Nifty gaining 2.3%. Banking and IT sectors led the rally while FMCG remained under pressure. FII inflows continued for the third consecutive week, adding ₹2,890 crores. The overall sentiment remains cautiously optimistic as we head into earnings season.",
      topPicks: "1. RELIANCE (BUY)\n   Entry: ₹2,840-2,860\n   Target: ₹3,100\n   Stop Loss: ₹2,750\n   Rationale: Strong support at 2,800. RSI oversold. Positive MACD divergence.\n\n2. TATAMOTORS (BUY)\n   Entry: ₹980-990\n   Target: ₹1,150\n   Stop Loss: ₹920\n   Rationale: EV momentum strong. Cup & handle breakout.\n\n3. ITC (BUY)\n   Entry: ₹475-480\n   Target: ₹520\n   Stop Loss: ₹460\n   Rationale: Defensive play. Strong dividend yield.",
      technicalAnalysis: "NIFTY 50 Technical View:\n• Current Level: 22,485\n• Support: 22,350 | 22,200 | 22,000\n• Resistance: 22,600 | 22,750 | 23,000\n• RSI: 45 (Neutral)\n• MACD: Bearish crossover\n• Trend: Consolidation phase\n\nKey Observations:\n- Trading in narrow range\n- Volume declining\n- Watch for breakout above 22,750",
      risks: "Key Risks:\n• US Fed policy meeting on Wednesday\n• Crude oil prices volatile\n• Q3 earnings season starting\n• Global recession fears\n\nRisk Management:\n• Position size: 2-3% per trade\n• Always use stop losses\n• Avoid overleveraging",
    },
    readTime: "5 min read",
    featured: true,
  },
  {
    id: "2",
    title: "Market Outlook - Bullish Momentum Continues",
    date: "2024-01-08",
    excerpt: "Strong start to the year with Nifty breaking above 22,500. Auto and Pharma sectors outperforming. Technical indicators suggest further upside...",
    content: {
      marketOverview: "Strong start to the year with Nifty breaking above 22,500. Auto and Pharma sectors outperforming.",
      topPicks: "1. TATAMOTORS (BUY)\n2. SUNPHARMA (BUY)\n3. MARUTI (BUY)",
      technicalAnalysis: "Nifty showing strong bullish momentum with higher highs and higher lows.",
      risks: "Watch for profit booking at higher levels. Keep trailing stop losses.",
    },
    readTime: "4 min read",
    featured: false,
  },
  {
    id: "3",
    title: "Banking Sector Analysis - Time to Accumulate",
    date: "2024-01-01",
    excerpt: "Banking stocks have corrected 8-10% from recent highs. This presents a good accumulation opportunity for long-term investors...",
    content: {
      marketOverview: "Banking stocks have corrected 8-10% from recent highs. NPA concerns overdone.",
      topPicks: "1. HDFCBANK (BUY)\n2. ICICIBANK (BUY)\n3. KOTAKBANK (BUY)",
      technicalAnalysis: "Bank Nifty finding support at 46,500. RSI oversold.",
      risks: "RBI policy uncertainty. Asset quality concerns.",
    },
    readTime: "6 min read",
    featured: false,
  },
];

export default function PredictionsPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  if (selectedPost) {
    // Single Post View
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1117]">
        <div className="max-w-4xl mx-auto p-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedPost(null)}
            className="mb-6 text-sm text-slate-400 hover:text-white transition-colors"
          >
            ← Back to all posts
          </button>

          {/* Post Content */}
          <article className="glass-card p-8">
            {/* Header */}
            <div className="mb-8 pb-6 border-b border-white/10">
              <h1 className="text-4xl font-bold text-white mb-4">{selectedPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>
            </div>

            {/* Market Overview */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Market Overview</h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{selectedPost.content.marketOverview}</p>
            </section>

            {/* Top Picks */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Top Stock Picks</h2>
              <div className="bg-[#1a1d29] rounded-lg p-6 border border-white/5">
                <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{selectedPost.content.topPicks}</pre>
              </div>
            </section>

            {/* Technical Analysis */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Technical Analysis</h2>
              <div className="bg-[#1a1d29] rounded-lg p-6 border border-white/5">
                <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{selectedPost.content.technicalAnalysis}</pre>
              </div>
            </section>

            {/* Risks */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Risks to Watch</h2>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-6">
                <pre className="text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{selectedPost.content.risks}</pre>
              </div>
            </section>

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-500 leading-relaxed">
                <span className="font-semibold text-red-400">Disclaimer:</span> This analysis is for educational purposes only. 
                Not financial advice. Always DYOR before investing. Trading involves substantial risk of loss.
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f1117]">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white mb-3">Weekly Predictions</h1>
          <p className="text-lg text-slate-400">Expert market analysis and trading insights</p>
        </div>

        {/* Featured Post */}
        {BLOG_POSTS.filter(p => p.featured).map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden mb-12 group cursor-pointer hover:border-emerald-500/30 transition-all"
            onClick={() => setSelectedPost(post)}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {/* Featured Image */}
              <div className="h-80 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <TrendingUp className="w-24 h-24 text-emerald-400/30" />
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">
                  Featured
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime}</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-slate-400 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                  <span>Read full analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </motion.article>
        ))}

        {/* Recent Posts Grid */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BLOG_POSTS.filter(p => !p.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden group cursor-pointer hover:border-emerald-500/30 transition-all"
                onClick={() => setSelectedPost(post)}
              >
                {/* Image */}
                <div className="h-48 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <TrendingUp className="w-16 h-16 text-violet-400/30" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <span>Read more</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
