"use client";
import { useState } from 'react';
import { X, Plus, Settings, Star } from 'lucide-react';

interface Ratio {
  id: string;
  name: string;
  value: string | number;
  category: string;
}

const ALL_RATIOS: Ratio[] = [
  // Most Used
  { id: "market_cap", name: "Market Cap", value: "₹ 9,25,362 Cr.", category: "Most Used" },
  { id: "current_price", name: "Current Price", value: "₹ 2,558", category: "Most Used" },
  { id: "high_low", name: "High / Low", value: "₹ 3,710 / 2,546", category: "Most Used" },
  { id: "stock_pe", name: "Stock P/E", value: "18.1", category: "Most Used" },
  { id: "book_value", name: "Book Value", value: "₹ 294", category: "Most Used" },
  { id: "dividend_yield", name: "Dividend Yield", value: "2.35 %", category: "Most Used" },
  { id: "roce", name: "ROCE", value: "64.6 %", category: "Most Used" },
  { id: "roe", name: "ROE", value: "52.4 %", category: "Most Used" },
  { id: "face_value", name: "Face Value", value: "₹ 1.00", category: "Most Used" },
  
  // Ratios
  { id: "roe_5yr", name: "ROE 5Yr", value: "46.8 %", category: "Ratios" },
  { id: "roce_5yr", name: "ROCE 5Yr", value: "58.1 %", category: "Ratios" },
  { id: "profit_var_5yrs", name: "Profit Var 5Yrs", value: "8.48 %", category: "Ratios" },
  { id: "price_to_book", name: "Price to book value", value: "8.70", category: "Ratios" },
  { id: "roe_3yr", name: "ROE 3Yr", value: "50.3 %", category: "Ratios" },
  { id: "debt_to_equity", name: "Debt to equity", value: "0.10", category: "Ratios" },
  
  // Balance Sheet
  { id: "no_eq_shares", name: "No. Eq. Shares", value: "362", category: "Balance Sheet" },
  { id: "current_ratio", name: "Current ratio", value: "2.43", category: "Balance Sheet" },
  { id: "debt", name: "Debt", value: "₹ 10,932 Cr.", category: "Balance Sheet" },
  { id: "debt_3years_back", name: "Debt 3Years back", value: "₹ 7,818 Cr.", category: "Balance Sheet" },
  
  // Annual P&L
  { id: "sales", name: "Sales", value: "₹ 2,48,520 Cr.", category: "Annual P&L" },
  { id: "eps", name: "EPS", value: "₹ 132", category: "Annual P&L" },
  { id: "pat_ann", name: "PAT Ann", value: "₹ 48,520 Cr.", category: "Annual P&L" },
  { id: "sales_growth_5years", name: "Sales growth 5Years", value: "10.2 %", category: "Annual P&L" },
  
  // Price
  { id: "peg_ratio", name: "PEG Ratio", value: "2.21", category: "Price" },
  { id: "return_5years", name: "Return over 5years", value: "-3.19 %", category: "Price" },
  { id: "return_3years", name: "Return over 3years", value: "15.2 %", category: "Price" },
  { id: "return_1year", name: "Return over 1year", value: "8.5 %", category: "Price" },
];

interface Props {
  stockSymbol: string;
  onClose: () => void;
}

export default function StockDetailsPanel({ stockSymbol, onClose }: Props) {
  const [selectedRatios, setSelectedRatios] = useState<string[]>([
    "market_cap", "current_price", "high_low", "stock_pe", "book_value", 
    "dividend_yield", "roce", "roe", "face_value", "roe_5yr", "roce_5yr", 
    "profit_var_5yrs", "price_to_book", "roe_3yr", "debt_to_equity"
  ]);
  const [showRatioSelector, setShowRatioSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleRatio = (ratioId: string) => {
    setSelectedRatios(prev => 
      prev.includes(ratioId) 
        ? prev.filter(id => id !== ratioId)
        : [...prev, ratioId]
    );
  };

  const displayedRatios = ALL_RATIOS.filter(r => selectedRatios.includes(r.id));
  
  const categories = Array.from(new Set(ALL_RATIOS.map(r => r.category)));
  
  const filteredRatios = searchQuery 
    ? ALL_RATIOS.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : ALL_RATIOS;

  return (
    <div className="glass-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white mb-1">Tata Consultancy Services Ltd</h2>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <a href="https://tcs.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
              tcs.com
            </a>
            <span>BSE: 532540</span>
            <span>NSE: {stockSymbol}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-bold text-white">₹ 2,558</div>
            <div className="text-sm text-red-400">-0.82% • 06 Mar</div>
          </div>
          <button
            onClick={() => setShowRatioSelector(true)}
            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            title="Customize ratios"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ratios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedRatios.map((ratio) => (
          <div key={ratio.id} className="bg-slate-800/30 rounded-lg p-4 border border-white/[0.06] hover:border-emerald-500/20 transition-colors">
            <div className="text-xs text-slate-400 mb-1">{ratio.name}</div>
            <div className="text-lg font-bold text-white">{ratio.value}</div>
          </div>
        ))}
      </div>

      {/* Add Ratio Button */}
      <button
        onClick={() => setShowRatioSelector(true)}
        className="mt-4 w-full py-3 rounded-lg border-2 border-dashed border-slate-700 text-slate-400 hover:border-emerald-500/30 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Add ratio to table</span>
      </button>

      {/* Ratio Selector Modal */}
      {showRatioSelector && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-xl border border-white/[0.06] max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">Manage Ratios</h3>
                <p className="text-sm text-slate-400">Select the ratios you want to display</p>
              </div>
              <button
                onClick={() => setShowRatioSelector(false)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Search */}
            <div className="p-6 border-b border-white/[0.06]">
              <input
                type="text"
                placeholder="Search ratios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-white/[0.06] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/30"
              />
            </div>

            {/* Ratios List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {categories.map((category) => {
                const categoryRatios = filteredRatios.filter(r => r.category === category);
                if (categoryRatios.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h4 className="text-sm font-bold text-emerald-400 mb-3 uppercase tracking-wider">
                      {category}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {categoryRatios.map((ratio) => (
                        <label
                          key={ratio.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedRatios.includes(ratio.id)}
                            onChange={() => toggleRatio(ratio.id)}
                            className="w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
                          />
                          <span className="text-sm text-slate-300">{ratio.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-white/[0.06]">
              <div className="text-sm text-slate-400">
                {selectedRatios.length} ratios selected
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRatioSelector(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowRatioSelector(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium"
                >
                  Save Ratios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
