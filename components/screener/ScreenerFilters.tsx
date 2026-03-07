"use client";
import { useState } from 'react';
import { Filter, X, Plus } from 'lucide-react';

interface Props {
  onFilterChange: (filters: any) => void;
}

export default function ScreenerFilters({ onFilterChange }: Props) {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filterCategories = [
    {
      name: "Market Cap",
      options: ["Large Cap (>20,000 Cr)", "Mid Cap (5,000-20,000 Cr)", "Small Cap (<5,000 Cr)"]
    },
    {
      name: "Valuation",
      options: ["P/E < 15", "P/E 15-25", "P/E > 25", "P/B < 3", "P/B > 3"]
    },
    {
      name: "Profitability",
      options: ["ROE > 15%", "ROE > 20%", "ROCE > 15%", "ROCE > 20%"]
    },
    {
      name: "Dividend",
      options: ["Dividend Yield > 2%", "Dividend Yield > 3%", "Dividend Yield > 5%"]
    },
    {
      name: "Performance",
      options: ["52W High", "52W Low", "Top Gainers", "Top Losers"]
    },
    {
      name: "Sector",
      options: ["Technology", "Financial Services", "Healthcare", "Consumer", "Energy", "Industrials", "Auto"]
    }
  ];

  const quickFilters = [
    { name: "Top Gainers", icon: "📈" },
    { name: "Top Losers", icon: "📉" },
    { name: "High Dividend", icon: "💰" },
    { name: "Large Cap", icon: "🏢" },
    { name: "High ROCE", icon: "⚡" },
    { name: "High ROE", icon: "💎" },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Filters:</span>
        {quickFilters.map((filter) => (
          <button
            key={filter.name}
            onClick={() => {
              if (activeFilters.includes(filter.name)) {
                setActiveFilters(activeFilters.filter(f => f !== filter.name));
              } else {
                setActiveFilters([...activeFilters, filter.name]);
              }
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all flex items-center gap-1.5 ${
              activeFilters.includes(filter.name)
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] border border-transparent'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.name}</span>
            {activeFilters.includes(filter.name) && <X className="w-3 h-3" />}
          </button>
        ))}
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-3 py-1.5 text-xs font-bold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20 transition-colors flex items-center gap-1.5"
        >
          <Filter className="w-3 h-3" />
          <span>More Filters</span>
        </button>

        {activeFilters.length > 0 && (
          <button
            onClick={() => setActiveFilters([])}
            className="px-3 py-1.5 text-xs font-bold rounded-md bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white">Advanced Filters</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 rounded hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filterCategories.map((category) => (
              <div key={category.name}>
                <h4 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">
                  {category.name}
                </h4>
                <div className="space-y-2">
                  {category.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center gap-2 cursor-pointer hover:bg-slate-800/30 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={activeFilters.includes(option)}
                        onChange={() => {
                          if (activeFilters.includes(option)) {
                            setActiveFilters(activeFilters.filter(f => f !== option));
                          } else {
                            setActiveFilters([...activeFilters, option]);
                          }
                        }}
                        className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <span className="text-sm text-slate-300">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setShowFilters(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onFilterChange(activeFilters);
                setShowFilters(false);
              }}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Active:</span>
          {activeFilters.map((filter) => (
            <span
              key={filter}
              className="px-2 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center gap-1"
            >
              {filter}
              <button
                onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))}
                className="hover:text-emerald-300"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
