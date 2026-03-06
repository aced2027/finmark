"use client";
import { useState } from 'react';
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

const US_INDICES: IndexData[] = [
  {
    symbol: "S&P 500",
    name: "S&P 500",
    price: 5234.18,
    change: -45.32,
    changePct: -0.86,
    sparkline: [5280, 5270, 5260, 5250, 5245, 5240, 5235, 5234]
  },
  {
    symbol: "NASDAQ",
    name: "NASDAQ Composite",
    price: 16384.47,
    change: -123.56,
    changePct: -0.75,
    sparkline: [16500, 16480, 16460, 16440, 16420, 16400, 16390, 16384]
  },
  {
    symbol: "DOW JONES",
    name: "Dow Jones Industrial",
    price: 38789.45,
    change: 156.78,
    changePct: 0.41,
    sparkline: [38600, 38650, 38700, 38720, 38750, 38770, 38780, 38789]
  },
  {
    symbol: "RUSSELL 2000",
    name: "Russell 2000",
    price: 2045.67,
    change: 12.34,
    changePct: 0.61,
    sparkline: [2030, 2032, 2035, 2038, 2040, 2042, 2044, 2045]
  }
];

export default function USIndices() {
  const [indices] = useState(US_INDICES);

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
          <h2 className="text-base font-semibold text-white">US Market Indices</h2>
          <p className="text-xs text-slate-400">Live data for major US indices</p>
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
              {renderSparkline(index.sparkline, isPositive)}

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                      {index.symbol}
                    </h3>
                    <p className="text-2xl font-bold text-white">
                      {index.price.toLocaleString('en-US', { 
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
                    {index.change.toLocaleString('en-US', { 
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
