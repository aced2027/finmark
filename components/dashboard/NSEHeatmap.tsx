"use client";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: number;
  sector: string;
}

// Nifty 50 constituent stocks
const NIFTY_50_STOCKS: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2847.30, change: -35.45, changePct: -1.27, marketCap: 1925000, sector: "Energy" },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4182.15, change: -89.35, changePct: -0.82, marketCap: 1528000, sector: "Technology" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1612.45, change: -10.55, changePct: -0.67, marketCap: 1223000, sector: "Financial Services" },
  { symbol: "INFY", name: "Infosys", price: 1654.80, change: 18.90, changePct: 1.19, marketCap: 685000, sector: "Technology" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1089.70, change: 12.30, changePct: 0.85, marketCap: 765000, sector: "Financial Services" },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2456.25, change: -15.75, changePct: -0.64, marketCap: 578000, sector: "Consumer" },
  { symbol: "ITC", name: "ITC Limited", price: 478.90, change: 5.60, changePct: 1.18, marketCap: 595000, sector: "Consumer" },
  { symbol: "SBIN", name: "State Bank of India", price: 823.45, change: -8.25, changePct: -2.27, marketCap: 734000, sector: "Financial Services" },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1267.90, change: 18.45, changePct: 1.45, marketCap: 745000, sector: "Communication Services" },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1789.30, change: -12.70, changePct: -0.71, marketCap: 356000, sector: "Financial Services" },
  { symbol: "LT", name: "Larsen & Toubro", price: 3654.20, change: 45.80, changePct: 2.40, marketCap: 512000, sector: "Industrials" },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7234.50, change: -89.50, changePct: -1.27, marketCap: 445000, sector: "Financial Services" },
  { symbol: "HCLTECH", name: "HCL Technologies", price: 1487.25, change: 23.15, changePct: 0.76, marketCap: 403000, sector: "Technology" },
  { symbol: "ASIANPAINT", name: "Asian Paints", price: 2789.60, change: -34.40, changePct: -0.46, marketCap: 267000, sector: "Consumer" },
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 12456.75, change: 156.25, changePct: 1.27, marketCap: 376000, sector: "Auto" },
  { symbol: "AXISBANK", name: "Axis Bank", price: 1145.80, change: -15.20, changePct: -1.36, marketCap: 354000, sector: "Financial Services" },
  { symbol: "SUNPHARMA", name: "Sun Pharma", price: 1678.90, change: 12.40, changePct: 0.82, marketCap: 402000, sector: "Pharma" },
  { symbol: "TITAN", name: "Titan Company", price: 3456.20, change: 45.30, changePct: 1.33, marketCap: 306000, sector: "Consumer" },
  { symbol: "WIPRO", name: "Wipro", price: 523.60, change: -6.40, changePct: -1.23, marketCap: 287000, sector: "Technology" },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement", price: 9876.45, change: 123.55, changePct: 1.27, marketCap: 285000, sector: "Basic Materials" },
  { symbol: "NESTLEIND", name: "Nestle India", price: 2567.80, change: -23.20, changePct: -0.89, marketCap: 247000, sector: "Consumer" },
  { symbol: "TATAMOTORS", name: "Tata Motors", price: 987.65, change: 15.35, changePct: 1.58, marketCap: 356000, sector: "Auto" },
  { symbol: "ADANIENT", name: "Adani Enterprises", price: 2345.70, change: -45.30, changePct: -1.90, marketCap: 267000, sector: "Industrials" },
  { symbol: "ONGC", name: "ONGC", price: 267.85, change: 3.45, changePct: 1.30, marketCap: 337000, sector: "Energy" },
  { symbol: "NTPC", name: "NTPC", price: 345.60, change: 4.80, changePct: 0.67, marketCap: 335000, sector: "Utilities" },
  { symbol: "POWERGRID", name: "Power Grid", price: 289.45, change: -2.55, changePct: -0.87, marketCap: 267000, sector: "Utilities" },
  { symbol: "M&M", name: "Mahindra & Mahindra", price: 2456.90, change: 34.90, changePct: 1.44, marketCap: 304000, sector: "Auto" },
  { symbol: "JSWSTEEL", name: "JSW Steel", price: 876.45, change: -12.55, changePct: -1.41, marketCap: 213000, sector: "Basic Materials" },
  { symbol: "TATASTEEL", name: "Tata Steel", price: 145.80, change: 2.30, changePct: 1.60, marketCap: 178000, sector: "Basic Materials" },
  { symbol: "INDUSINDBK", name: "IndusInd Bank", price: 1456.70, change: -18.30, changePct: -1.24, marketCap: 113000, sector: "Financial Services" },
  { symbol: "TECHM", name: "Tech Mahindra", price: 1678.90, change: 23.40, changePct: 1.41, marketCap: 163000, sector: "Technology" },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv", price: 1789.45, change: -21.55, changePct: -1.19, marketCap: 285000, sector: "Financial Services" },
  { symbol: "HINDALCO", name: "Hindalco", price: 645.30, change: 8.70, changePct: 1.37, marketCap: 144000, sector: "Basic Materials" },
  { symbol: "ADANIPORTS", name: "Adani Ports", price: 1234.60, change: -15.40, changePct: -1.23, marketCap: 267000, sector: "Industrials" },
  { symbol: "COALINDIA", name: "Coal India", price: 456.80, change: 5.30, changePct: 1.17, marketCap: 281000, sector: "Energy" },
  { symbol: "DIVISLAB", name: "Divi's Laboratories", price: 3789.45, change: -45.55, changePct: -1.19, marketCap: 100000, sector: "Pharma" },
  { symbol: "DRREDDY", name: "Dr. Reddy's", price: 6234.70, change: 78.30, changePct: 1.27, marketCap: 104000, sector: "Pharma" },
  { symbol: "EICHERMOT", name: "Eicher Motors", price: 4567.80, change: 56.20, changePct: 1.25, marketCap: 125000, sector: "Auto" },
  { symbol: "GRASIM", name: "Grasim Industries", price: 2345.60, change: -28.40, changePct: -1.20, marketCap: 156000, sector: "Basic Materials" },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp", price: 4789.30, change: 62.70, changePct: 1.33, marketCap: 95000, sector: "Auto" },
  { symbol: "CIPLA", name: "Cipla", price: 1456.80, change: 18.20, changePct: 1.26, marketCap: 117000, sector: "Pharma" },
  { symbol: "BRITANNIA", name: "Britannia", price: 5234.50, change: -67.50, changePct: -1.27, marketCap: 126000, sector: "Consumer" },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals", price: 6789.40, change: 89.60, changePct: 1.34, marketCap: 98000, sector: "Healthcare" },
  { symbol: "BPCL", name: "BPCL", price: 567.80, change: -7.20, changePct: -1.25, marketCap: 123000, sector: "Energy" },
  { symbol: "TATACONSUM", name: "Tata Consumer", price: 1123.45, change: 14.55, changePct: 1.31, marketCap: 106000, sector: "Consumer" },
  { symbol: "SBILIFE", name: "SBI Life Insurance", price: 1567.90, change: -19.10, changePct: -1.20, marketCap: 157000, sector: "Financial Services" },
  { symbol: "LTIM", name: "LTIMindtree", price: 5678.30, change: 72.70, changePct: 1.30, marketCap: 169000, sector: "Technology" },
  { symbol: "BAJAJ-AUTO", name: "Bajaj Auto", price: 9876.50, change: 123.50, changePct: 1.27, marketCap: 286000, sector: "Auto" },
  { symbol: "HDFCLIFE", name: "HDFC Life", price: 678.90, change: -8.10, changePct: -1.18, marketCap: 145000, sector: "Financial Services" },
  { symbol: "SHREECEM", name: "Shree Cement", price: 27890.50, change: 345.50, changePct: 1.25, marketCap: 100000, sector: "Basic Materials" },
];

export default function NSEHeatmap() {
  const [stocks, setStocks] = useState(NIFTY_50_STOCKS);

  const getHeatmapColor = (pct: number) => {
    if (pct > 2) return "bg-emerald-500 text-white";
    if (pct > 0.5) return "bg-emerald-600/80 text-emerald-50";
    if (pct > 0) return "bg-emerald-800/60 text-emerald-100";
    if (pct === 0) return "bg-slate-700 text-slate-300";
    if (pct > -0.5) return "bg-red-800/60 text-red-100";
    if (pct > -2) return "bg-red-600/80 text-red-50";
    return "bg-red-500 text-white";
  };

  const getSize = (index: number) => {
    if (index < 3) return "col-span-2 row-span-2 text-base";
    if (index < 8) return "col-span-1 row-span-2 text-sm";
    return "col-span-1 row-span-1 text-xs";
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">Nifty 50 Heatmap</h2>
          <p className="text-xs text-slate-400">Top 50 NSE companies sized by Market Cap</p>
        </div>
        <div className="flex gap-1 text-[10px] uppercase font-bold text-slate-500">
          <div className="flex gap-0.5 items-center mr-2">
            <span className="w-3 h-3 bg-red-500 rounded-sm"></span>
            <span>-2%</span>
          </div>
          <div className="flex gap-0.5 items-center mr-2">
            <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
            <span>0%</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <span className="w-3 h-3 bg-emerald-500 rounded-sm"></span>
            <span>+2%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1 h-[600px]">
        {stocks.map((stock, i) => (
          <motion.div
            key={stock.symbol}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.01, duration: 0.3 }}
            className={cn(
              "relative group cursor-pointer overflow-hidden rounded flex flex-col items-center justify-center p-2 transition-all hover:ring-2 hover:ring-white/50 z-0 hover:z-10",
              getHeatmapColor(stock.changePct),
              getSize(i)
            )}
          >
            <span className="font-bold tracking-tight">{stock.symbol}</span>
            <span className="font-medium opacity-90 text-[10px]">
              {stock.changePct > 0 ? "+" : ""}
              {stock.changePct.toFixed(2)}%
            </span>

            {/* Tooltip */}
            <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-2 backdrop-blur-sm z-20">
              <p className="text-xs font-bold text-white mb-1">{stock.symbol}</p>
              <p className="text-[10px] text-slate-300">{stock.name}</p>
              <p className="text-[10px] text-slate-300">₹{stock.price.toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-slate-300">Sector: {stock.sector}</p>
              <p className="text-[10px] text-slate-300">M.Cap: ₹{stock.marketCap}Cr</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
