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

const INDIAN_PREDICTIONS: Prediction[] = [
  {
    id: "1",
    question: "Will NIFTY close above 25,000 this month?",
    options: [
      { label: "YES", percentage: 68.0, change: 0.5 },
      { label: "NO", percentage: 32.0, change: -0.5 },
    ],
    volume: "$2.1M vol.",
    additionalInfo: "+12 on Polymarket"
  },
  {
    id: "2",
    question: "Will RBI cut rates in next meeting?",
    options: [
      { label: "YES", percentage: 72.0, change: 0.0 },
      { label: "NO", percentage: 28.0, change: 0.0 },
    ],
    volume: "$890K vol.",
    additionalInfo: "+8 on Polymarket"
  },
  {
    id: "3",
    question: "Bank Nifty to hit 60,000 by month end?",
    options: [
      { label: "Above 60K", percentage: 45.0, change: 1.2 },
      { label: "Below 60K", percentage: 55.0, change: -1.2 },
    ],
    volume: "$1.5M vol.",
    additionalInfo: "Polymarket"
  },
];

export default function PredictionMarkets() {
  const [predictions] = useState(INDIAN_PREDICTIONS);

  return (
    <div className="rounded-xl border border-white/10 bg-[#1a1d29] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h2 className="text-base font-semibold text-white">Prediction Markets</h2>
        <p className="text-xs text-slate-500 mt-1">Expert predictions for Indian markets</p>
      </div>

      {/* Predictions List */}
      <div className="divide-y divide-white/10">
        {predictions.map((prediction) => (
          <div key={prediction.id} className="p-4">
            {/* Question */}
            <h3 className="text-sm font-medium text-slate-300 mb-3">
              {prediction.question}
            </h3>

            {/* Options */}
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

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>{prediction.volume}</span>
              <span>{prediction.additionalInfo}</span>
            </div>
          </div>
        ))}

        {/* See More */}
        <button className="w-full p-4 text-sm text-slate-500 hover:text-slate-300 hover:bg-white/[0.02] transition-all">
          See 5 more
        </button>
      </div>
    </div>
  );
}
