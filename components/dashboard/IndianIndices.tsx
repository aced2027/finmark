"use client";
import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  sparkline: number[];
}

const INDIAN_INDICES: IndexData[] = [
  {
    symbol: "NIFTY 50",
    name: "Nifty 50",
    price: 24450.45,
    change: -315.45,
    changePct: -1.27,
    sparkline: [24800, 24750, 24700, 24650, 24600, 24550, 24500, 24450]
  },
  {
    symbol: "BANKNIFTY",
    name: "Bank Nifty",
    price: 57783.25,
    change: -1272.60,
    changePct: -2.15,
    sparkline: [59000, 58800, 58600, 58400, 58200, 58000, 57900, 57783]
  },
  {
    symbol: "NIFTYMIDCAP50",
    name: "Nifty Midcap 50",
    price: 15234.80,
    change: -189.20,
    changePct: -1.23,
    sparkline: [15400, 15380, 15350, 15320, 15300, 15270, 15250, 15234]
  },
  {
    symbol: "NIFTYIT",
    name: "Nifty IT",
    price: 34567.90,
    change: 234.50,
    changePct: 0.68,
    sparkline: [34300, 34350, 34400, 34450, 34500, 34520, 34550, 34567]
  }
];

export default function IndianIndices() {
  const [indices] = useState(INDIAN_INDICES);

  const renderSparkline = (data: number[], isPositive: boolean) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    const width = 200;
    const height = 60;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="absolute bottom-0 right-0 opacity-40">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Indian Market Indices</h2>
          <p className="text-xs text-slate-400">Live data for major NSE indices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index, i) => {
          const isPositive = index.changePct >= 0;
          return (
            <div
              key={index.symbol}
              className="relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#1a1d29] to-[#0f1117] p-4 hover:border-white/20 transition-all group"
            >
              {/* Sparkline Background */}
              {renderSparkline(index.sparkline, isPositive)}

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                      {index.symbol}
                    </h3>
                    <p className="text-2xl font-bold text-white">
                      {index.price.toLocaleString('en-IN', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </p>
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-sm font-bold",
                    isPositive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {isPositive ? "+" : ""}
                    {index.changePct.toFixed(2)}%
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium",
                    isPositive ? "text-emerald-400" : "text-red-400"
                  )}>
                    {isPositive ? "+" : ""}
                    {index.change.toLocaleString('en-IN', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </span>
                  <span className="text-slate-500 text-xs">points</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
