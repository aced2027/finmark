"use client";
import { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: number;
  pe: number;
  dividend: number;
  roce: number;
  roe: number;
  sales: number;
  profit: number;
  sector: string;
}

// Sample data - In production, this would come from API
const SAMPLE_STOCKS: Stock[] = [
  { symbol: "TCS", name: "Tata Consultancy Services", price: 2558, change: -21, changePct: -0.82, marketCap: 925362, pe: 18.1, dividend: 2.35, roce: 64.6, roe: 52.4, sales: 248520, profit: 48520, sector: "Technology" },
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2847, change: -35, changePct: -1.27, marketCap: 1925000, pe: 22.5, dividend: 0.35, roce: 12.8, roe: 11.2, sales: 792756, profit: 73670, sector: "Energy" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1612, change: -11, changePct: -0.67, marketCap: 1223000, pe: 19.8, dividend: 1.25, roce: 18.5, roe: 16.8, sales: 198745, profit: 42156, sector: "Financial Services" },
  { symbol: "INFY", name: "Infosys", price: 1655, change: 19, changePct: 1.19, marketCap: 685000, pe: 24.3, dividend: 2.85, roce: 45.2, roe: 31.5, sales: 146767, profit: 24095, sector: "Technology" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1090, change: 12, changePct: 0.85, marketCap: 765000, pe: 17.2, dividend: 1.45, roce: 15.6, roe: 14.2, sales: 178956, profit: 38456, sector: "Financial Services" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2456, change: -16, changePct: -0.64, marketCap: 578000, pe: 58.4, dividend: 1.85, roce: 82.5, roe: 78.6, sales: 58472, profit: 10456, sector: "Consumer" },
  { symbol: "ITC", name: "ITC Limited", price: 479, change: 6, changePct: 1.18, marketCap: 595000, pe: 28.6, dividend: 5.25, roce: 28.4, roe: 24.8, sales: 67845, profit: 18956, sector: "Consumer" },
  { symbol: "SBIN", name: "State Bank of India", price: 823, change: -8, changePct: -2.27, marketCap: 734000, pe: 12.5, dividend: 2.15, roce: 8.5, roe: 12.4, sales: 456789, profit: 45678, sector: "Financial Services" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1268, change: 18, changePct: 1.45, marketCap: 745000, pe: 45.2, dividend: 0.75, roce: 18.5, roe: 15.6, sales: 145678, profit: 12456, sector: "Communication Services" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1789, change: -13, changePct: -0.71, marketCap: 356000, pe: 16.8, dividend: 0.95, roce: 12.5, roe: 11.8, sales: 67845, profit: 15678, sector: "Financial Services" },
  { symbol: "LT", name: "Larsen & Toubro", price: 3654, change: 46, changePct: 2.40, marketCap: 512000, pe: 32.5, dividend: 1.45, roce: 15.8, roe: 14.2, sales: 198456, profit: 12345, sector: "Industrials" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7235, change: -90, changePct: -1.27, marketCap: 445000, pe: 28.5, dividend: 0.85, roce: 18.5, roe: 22.4, sales: 34567, profit: 12456, sector: "Financial Services" },
  { symbol: "HCLTECH", name: "HCL Technologies", price: 1487, change: 23, changePct: 0.76, marketCap: 403000, pe: 22.8, dividend: 3.25, roce: 38.5, roe: 28.6, sales: 98456, profit: 18956, sector: "Technology" },
  { symbol: "ASIANPAINT", name: "Asian Paints", price: 2790, change: -34, changePct: -0.46, marketCap: 267000, pe: 52.4, dividend: 1.65, roce: 45.2, roe: 38.5, sales: 34567, profit: 5678, sector: "Consumer" },
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 12457, change: 156, changePct: 1.27, marketCap: 376000, pe: 28.5, dividend: 1.25, roce: 18.5, roe: 15.6, sales: 123456, profit: 12345, sector: "Auto" },
];

interface Props {
  filters: any;
  onStockSelect: (symbol: string) => void;
}

export default function StockScreenerTable({ filters, onStockSelect }: Props) {
  const [sortColumn, setSortColumn] = useState<keyof Stock>("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (column: keyof Stock) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("desc");
    }
  };

  const sortedStocks = useMemo(() => {
    return [...SAMPLE_STOCKS].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }
      
      return sortDirection === "asc" 
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [sortColumn, sortDirection]);

  const SortIcon = ({ column }: { column: keyof Stock }) => {
    if (sortColumn !== column) return <ArrowUpDown className="w-3 h-3 text-slate-500" />;
    return sortDirection === "asc" 
      ? <ArrowUp className="w-3 h-3 text-emerald-400" />
      : <ArrowDown className="w-3 h-3 text-emerald-400" />;
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06] bg-slate-900/50">
              <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase tracking-wider sticky left-0 bg-slate-900/50 z-10">
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                  Name <SortIcon column="name" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("price")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  Price <SortIcon column="price" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("changePct")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  Change % <SortIcon column="changePct" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("marketCap")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  Market Cap <SortIcon column="marketCap" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("pe")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  P/E <SortIcon column="pe" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("dividend")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  Div Yield % <SortIcon column="dividend" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("roce")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  ROCE % <SortIcon column="roce" />
                </button>
              </th>
              <th className="text-right p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("roe")} className="flex items-center gap-1 ml-auto hover:text-emerald-400 transition-colors">
                  ROE % <SortIcon column="roe" />
                </button>
              </th>
              <th className="text-left p-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <button onClick={() => handleSort("sector")} className="flex items-center gap-1 hover:text-emerald-400 transition-colors">
                  Sector <SortIcon column="sector" />
                </button>
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock, index) => (
              <tr 
                key={stock.symbol}
                onClick={() => onStockSelect(stock.symbol)}
                className="border-b border-white/[0.04] hover:bg-slate-800/30 cursor-pointer transition-colors group"
              >
                <td className="p-3 sticky left-0 bg-[#1a1d29] group-hover:bg-slate-800/30 z-10">
                  <div>
                    <div className="text-sm font-bold text-white">{stock.symbol}</div>
                    <div className="text-xs text-slate-400">{stock.name}</div>
                  </div>
                </td>
                <td className="p-3 text-right text-sm text-white font-medium">
                  ₹{stock.price.toLocaleString('en-IN')}
                </td>
                <td className="p-3 text-right">
                  <span className={`text-sm font-bold ${stock.changePct >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                  </span>
                </td>
                <td className="p-3 text-right text-sm text-slate-300">
                  ₹{(stock.marketCap / 1000).toFixed(0)}K Cr
                </td>
                <td className="p-3 text-right text-sm text-slate-300">
                  {stock.pe.toFixed(1)}
                </td>
                <td className="p-3 text-right text-sm text-slate-300">
                  {stock.dividend.toFixed(2)}%
                </td>
                <td className="p-3 text-right text-sm text-slate-300">
                  {stock.roce.toFixed(1)}%
                </td>
                <td className="p-3 text-right text-sm text-slate-300">
                  {stock.roe.toFixed(1)}%
                </td>
                <td className="p-3 text-sm text-slate-300">
                  {stock.sector}
                </td>
                <td className="p-3">
                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/[0.06] bg-slate-900/30">
        <div className="text-sm text-slate-400">
          Showing {sortedStocks.length} stocks • Click on any row to view detailed analysis
        </div>
      </div>
    </div>
  );
}
