"use client";
import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Prediction {
  id: string;
  question: string;
  options: {
    label: string;
    percentage: number;
    change: number;
  }[];
  volume: string;
  additionalInfo?: string;
}

const US_PREDICTIONS: Prediction[] = [
  {
    id: "1",
    question: "Will S&P 500 hit 5,500 by month end?",
    options: [
      { label: "YES", percentage: 42.0, change: 0.8 },
      { label: "NO", percentage: 58.0, change: -0.8 },
    ],
    volume: "$3.2M vol.",
    additionalInfo: "+18 on Polymarket"
  },
  {
    id: "2",
    question: "Fed rate cut in next FOMC meeting?",
    options: [
      { label: "YES", percentage: 35.0, change: 0.0 },
      { label: "NO", percentage: 65.0, change: 0.0 },
    ],
    volume: "$5.1M vol.",
    additionalInfo: "+24 on Polymarket"
  },
  {
    id: "3",
    question: "NASDAQ above 17,000 this month?",
    options: [
      { label: "Above 17K", percentage: 52.0, change: 1.5 },
      { label: "Below 17K", percentage: 48.0, change: -1.5 },
    ],
    volume: "$2.8M vol.",
    additionalInfo: "Polymarket"
  },
];

export default function USPredictionMarkets() {
  const [predictions] = useState(US_PREDICTIONS);

  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1d29] overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-white">Prediction Markets</h2>
        <p className="text-xs text-slate-500 mt-1">Expert predictions for US markets</p>
      </div>

      <div className="divide-y divide-white/10">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="p-4">
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              {prediction.question}
            </h3>

            <div className="space-y-2 mb-3">
              {prediction.options.map((option, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{option.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      {option.percentage.toFixed(1)}%
                    </span>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-medium min-w-[60px] justify-end",
                      option.change > 0 ? "text-emerald-400" : 
                      option.change < 0 ? "text-red-400" : "text-slate-500"
                    )}>
                      {option.change > 0 && <TrendingUp className="w-3 h-3" />}
                      {option.change < 0 && <TrendingDown className="w-3 h-3" />}
                      {option.change !== 0 && (
                        <span>
                          {option.change > 0 ? "+" : ""}
                          {option.change.toFixed(1)}%
                        </span>
                      )}
                      {option.change === 0 && <span>— 0.0%</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{prediction.volume}</span>
              <span>{prediction.additionalInfo}</span>
            </div>
          </div>
        ))}

        <button className="w-full p-4 text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] transition-all">
          See 5 more
        </button>
      </div>
    </div>
  );
}
