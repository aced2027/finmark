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

// S&P 500 stocks organized by sector
const SP500_BY_SECTOR = {
  "Technology": [
    { symbol: "AAPL", name: "Apple Inc.", changePct: 0.5, marketCap: 2800000 },
    { symbol: "MSFT", name: "Microsoft Corp", changePct: 1.3, marketCap: 2820000 },
    { symbol: "NVDA", name: "NVIDIA Corp", changePct: 0.5, marketCap: 1220000 },
    { symbol: "AVGO", name: "Broadcom Inc", changePct: 2.6, marketCap: 567000 },
    { symbol: "ORCL", name: "Oracle Corp", changePct: 0.6, marketCap: 334000 },
    { symbol: "ADBE", name: "Adobe Inc", changePct: 0.3, marketCap: 256000 },
    { symbol: "CRM", name: "Salesforce", changePct: 0.4, marketCap: 278000 },
    { symbol: "CSCO", name: "Cisco Systems", changePct: 0.2, marketCap: 212000 },
    { symbol: "INTC", name: "Intel Corp", changePct: 0.0, marketCap: 178000 },
    { symbol: "QCOM", name: "Qualcomm", changePct: 1.1, marketCap: 156000 },
    { symbol: "INTU", name: "Intuit", changePct: 0.0, marketCap: 145000 },
    { symbol: "TXN", name: "Texas Instruments", changePct: -0.1, marketCap: 167000 },
    { symbol: "AMD", name: "AMD", changePct: -0.2, marketCap: 234000 },
    { symbol: "NOW", name: "ServiceNow", changePct: 1.4, marketCap: 145000 },
    { symbol: "IBM", name: "IBM", changePct: -0.1, marketCap: 156000 },
    { symbol: "PANW", name: "Palo Alto Networks", changePct: 0.8, marketCap: 98000 },
    { symbol: "AMAT", name: "Applied Materials", changePct: 0.3, marketCap: 134000 },
    { symbol: "MU", name: "Micron Technology", changePct: -0.5, marketCap: 112000 },
    { symbol: "LRCX", name: "Lam Research", changePct: 0.2, marketCap: 89000 },
    { symbol: "KLAC", name: "KLA Corp", changePct: -0.1, marketCap: 87000 },
    { symbol: "SNPS", name: "Synopsys", changePct: 0.7, marketCap: 76000 },
    { symbol: "CDNS", name: "Cadence", changePct: 0.5, marketCap: 72000 },
    { symbol: "MCHP", name: "Microchip Tech", changePct: -0.3, marketCap: 45000 },
    { symbol: "FTNT", name: "Fortinet", changePct: 0.9, marketCap: 54000 },
  ],
  "Communication Services": [
    { symbol: "GOOGL", name: "Alphabet Inc", changePct: 1.2, marketCap: 1780000 },
    { symbol: "META", name: "Meta Platforms", changePct: -0.1, marketCap: 1230000 },
    { symbol: "NFLX", name: "Netflix Inc", changePct: -0.2, marketCap: 212000 },
    { symbol: "DIS", name: "Walt Disney", changePct: 1.2, marketCap: 178000 },
    { symbol: "CMCSA", name: "Comcast Corp", changePct: 0.6, marketCap: 167000 },
    { symbol: "TMUS", name: "T-Mobile US", changePct: -0.5, marketCap: 198000 },
    { symbol: "VZ", name: "Verizon", changePct: 1.1, marketCap: 156000 },
    { symbol: "T", name: "AT&T", changePct: 0.8, marketCap: 145000 },
    { symbol: "CHTR", name: "Charter Comm", changePct: -0.3, marketCap: 89000 },
    { symbol: "EA", name: "Electronic Arts", changePct: 0.4, marketCap: 38000 },
    { symbol: "TTWO", name: "Take-Two", changePct: -0.6, marketCap: 28000 },
  ],
  "Consumer Cyclical": [
    { symbol: "AMZN", name: "Amazon.com", changePct: 1.5, marketCap: 1840000 },
    { symbol: "TSLA", name: "Tesla Inc", changePct: 1.3, marketCap: 789000 },
    { symbol: "HD", name: "Home Depot", changePct: -1.7, marketCap: 345000 },
    { symbol: "MCD", name: "McDonald's", changePct: 0.2, marketCap: 212000 },
    { symbol: "NKE", name: "Nike", changePct: 0.5, marketCap: 145000 },
    { symbol: "LOW", name: "Lowe's", changePct: 1.1, marketCap: 134000 },
    { symbol: "SBUX", name: "Starbucks", changePct: 1.5, marketCap: 112000 },
    { symbol: "TGT", name: "Target", changePct: -0.1, marketCap: 98000 },
    { symbol: "TJX", name: "TJX Companies", changePct: 0.8, marketCap: 89000 },
    { symbol: "BKNG", name: "Booking Holdings", changePct: 1.6, marketCap: 123000 },
    { symbol: "CMG", name: "Chipotle", changePct: 0.3, marketCap: 67000 },
    { symbol: "MAR", name: "Marriott", changePct: -0.4, marketCap: 54000 },
  ],
  "Consumer Defensive": [
    { symbol: "WMT", name: "Walmart Inc", changePct: -1.2, marketCap: 445000 },
    { symbol: "PG", name: "Procter & Gamble", changePct: -0.5, marketCap: 367000 },
    { symbol: "COST", name: "Costco", changePct: -0.5, marketCap: 301000 },
    { symbol: "KO", name: "Coca-Cola", changePct: 0.5, marketCap: 265000 },
    { symbol: "PEP", name: "PepsiCo", changePct: 1.7, marketCap: 231000 },
    { symbol: "PM", name: "Philip Morris", changePct: 0.5, marketCap: 134000 },
    { symbol: "MDLZ", name: "Mondelez", changePct: -0.2, marketCap: 89000 },
    { symbol: "CL", name: "Colgate-Palmolive", changePct: 0.9, marketCap: 78000 },
    { symbol: "KMB", name: "Kimberly-Clark", changePct: -0.3, marketCap: 45000 },
    { symbol: "GIS", name: "General Mills", changePct: 0.2, marketCap: 38000 },
    { symbol: "HSY", name: "Hershey", changePct: -0.5, marketCap: 42000 },
  ],
  "Financial Services": [
    { symbol: "BRK.B", name: "Berkshire Hathaway", changePct: 1.4, marketCap: 890000 },
    { symbol: "JPM", name: "JPMorgan Chase", changePct: -1.5, marketCap: 545000 },
    { symbol: "V", name: "Visa Inc", changePct: 1.6, marketCap: 567000 },
    { symbol: "MA", name: "Mastercard Inc", changePct: 1.5, marketCap: 423000 },
    { symbol: "BAC", name: "Bank of America", changePct: 0.5, marketCap: 267000 },
    { symbol: "WFC", name: "Wells Fargo", changePct: 0.0, marketCap: 167000 },
    { symbol: "GS", name: "Goldman Sachs", changePct: -0.6, marketCap: 134000 },
    { symbol: "MS", name: "Morgan Stanley", changePct: -1.0, marketCap: 123000 },
    { symbol: "BLK", name: "BlackRock", changePct: -0.1, marketCap: 112000 },
    { symbol: "AXP", name: "American Express", changePct: 0.8, marketCap: 145000 },
    { symbol: "SPGI", name: "S&P Global", changePct: -0.1, marketCap: 98000 },
    { symbol: "C", name: "Citigroup", changePct: 1.0, marketCap: 89000 },
    { symbol: "SCHW", name: "Charles Schwab", changePct: -0.2, marketCap: 134000 },
    { symbol: "CB", name: "Chubb", changePct: 0.3, marketCap: 87000 },
    { symbol: "PGR", name: "Progressive", changePct: -0.4, marketCap: 76000 },
    { symbol: "MMC", name: "Marsh McLennan", changePct: 0.6, marketCap: 67000 },
    { symbol: "USB", name: "US Bancorp", changePct: -0.3, marketCap: 54000 },
    { symbol: "TFC", name: "Truist Financial", changePct: 0.2, marketCap: 48000 },
  ],
  "Healthcare": [
    { symbol: "LLY", name: "Eli Lilly", changePct: 1.6, marketCap: 560000 },
    { symbol: "UNH", name: "UnitedHealth Group", changePct: -1.6, marketCap: 478000 },
    { symbol: "JNJ", name: "Johnson & Johnson", changePct: -1.1, marketCap: 378000 },
    { symbol: "ABBV", name: "AbbVie Inc", changePct: -2.0, marketCap: 295000 },
    { symbol: "MRK", name: "Merck & Co", changePct: -1.7, marketCap: 285000 },
    { symbol: "TMO", name: "Thermo Fisher", changePct: -1.7, marketCap: 198000 },
    { symbol: "ABT", name: "Abbott Labs", changePct: -1.3, marketCap: 189000 },
    { symbol: "DHR", name: "Danaher", changePct: 0.6, marketCap: 178000 },
    { symbol: "ISRG", name: "Intuitive Surgical", changePct: 1.5, marketCap: 134000 },
    { symbol: "BMY", name: "Bristol Myers", changePct: -0.6, marketCap: 123000 },
    { symbol: "AMGN", name: "Amgen", changePct: -0.5, marketCap: 145000 },
    { symbol: "GILD", name: "Gilead Sciences", changePct: 1.0, marketCap: 112000 },
    { symbol: "CVS", name: "CVS Health", changePct: 0.0, marketCap: 98000 },
    { symbol: "CI", name: "Cigna", changePct: 0.9, marketCap: 89000 },
    { symbol: "VRTX", name: "Vertex Pharma", changePct: 1.2, marketCap: 87000 },
    { symbol: "REGN", name: "Regeneron", changePct: 0.8, marketCap: 76000 },
    { symbol: "ZTS", name: "Zoetis", changePct: -0.4, marketCap: 67000 },
    { symbol: "MCK", name: "McKesson", changePct: 0.3, marketCap: 54000 },
  ],
  "Energy": [
    { symbol: "XOM", name: "Exxon Mobil", changePct: -1.2, marketCap: 456000 },
    { symbol: "CVX", name: "Chevron Corp", changePct: -0.2, marketCap: 289000 },
    { symbol: "COP", name: "ConocoPhillips", changePct: -1.8, marketCap: 145000 },
    { symbol: "SLB", name: "Schlumberger", changePct: -1.6, marketCap: 89000 },
    { symbol: "EOG", name: "EOG Resources", changePct: -1.4, marketCap: 78000 },
    { symbol: "PXD", name: "Pioneer Natural", changePct: -1.1, marketCap: 67000 },
    { symbol: "MPC", name: "Marathon Petroleum", changePct: 0.1, marketCap: 56000 },
    { symbol: "PSX", name: "Phillips 66", changePct: -0.8, marketCap: 54000 },
    { symbol: "VLO", name: "Valero Energy", changePct: -0.6, marketCap: 48000 },
    { symbol: "OXY", name: "Occidental Petroleum", changePct: -1.3, marketCap: 42000 },
    { symbol: "HES", name: "Hess Corp", changePct: -0.9, marketCap: 38000 },
  ],
  "Industrials": [
    { symbol: "CAT", name: "Caterpillar Inc", changePct: 0.2, marketCap: 167000 },
    { symbol: "GE", name: "General Electric", changePct: 0.7, marketCap: 156000 },
    { symbol: "RTX", name: "Raytheon Tech", changePct: -0.2, marketCap: 145000 },
    { symbol: "HON", name: "Honeywell", changePct: 0.5, marketCap: 134000 },
    { symbol: "UPS", name: "United Parcel", changePct: -1.8, marketCap: 134000 },
    { symbol: "BA", name: "Boeing Co", changePct: 1.7, marketCap: 123000 },
    { symbol: "LMT", name: "Lockheed Martin", changePct: 0.1, marketCap: 112000 },
    { symbol: "DE", name: "Deere & Co", changePct: 0.5, marketCap: 98000 },
    { symbol: "UNP", name: "Union Pacific", changePct: 0.8, marketCap: 134000 },
    { symbol: "MMM", name: "3M Company", changePct: 0.0, marketCap: 89000 },
    { symbol: "ADP", name: "ADP", changePct: 0.3, marketCap: 87000 },
    { symbol: "ETN", name: "Eaton", changePct: 0.6, marketCap: 76000 },
    { symbol: "NOC", name: "Northrop Grumman", changePct: -0.4, marketCap: 67000 },
    { symbol: "EMR", name: "Emerson Electric", changePct: 0.2, marketCap: 54000 },
  ],
  "Utilities": [
    { symbol: "NEE", name: "NextEra Energy", changePct: 0.4, marketCap: 134000 },
    { symbol: "DUK", name: "Duke Energy", changePct: 0.2, marketCap: 76000 },
    { symbol: "SO", name: "Southern Co", changePct: 0.4, marketCap: 85000 },
    { symbol: "D", name: "Dominion Energy", changePct: 0.1, marketCap: 45000 },
    { symbol: "AEP", name: "American Electric", changePct: 0.5, marketCap: 67000 },
    { symbol: "EXC", name: "Exelon Corp", changePct: 1.3, marketCap: 56000 },
    { symbol: "SRE", name: "Sempra Energy", changePct: -1.1, marketCap: 54000 },
    { symbol: "XEL", name: "Xcel Energy", changePct: 0.3, marketCap: 38000 },
    { symbol: "WEC", name: "WEC Energy", changePct: -0.2, marketCap: 34000 },
    { symbol: "ED", name: "Con Edison", changePct: 0.1, marketCap: 32000 },
  ],
  "Real Estate": [
    { symbol: "AMT", name: "American Tower", changePct: 0.2, marketCap: 92000 },
    { symbol: "PLD", name: "Prologis Inc", changePct: 1.4, marketCap: 125000 },
    { symbol: "CCI", name: "Crown Castle", changePct: 1.0, marketCap: 49000 },
    { symbol: "EQIX", name: "Equinix", changePct: 0.1, marketCap: 78000 },
    { symbol: "PSA", name: "Public Storage", changePct: -0.2, marketCap: 67000 },
    { symbol: "SPG", name: "Simon Property", changePct: 0.2, marketCap: 56000 },
    { symbol: "O", name: "Realty Income", changePct: -0.5, marketCap: 45000 },
    { symbol: "WELL", name: "Welltower", changePct: 0.1, marketCap: 54000 },
    { symbol: "DLR", name: "Digital Realty", changePct: 0.4, marketCap: 48000 },
    { symbol: "AVB", name: "AvalonBay", changePct: -0.3, marketCap: 38000 },
  ],
  "Basic Materials": [
    { symbol: "LIN", name: "Linde PLC", changePct: -0.6, marketCap: 189000 },
    { symbol: "APD", name: "Air Products", changePct: 0.6, marketCap: 89000 },
    { symbol: "SHW", name: "Sherwin-Williams", changePct: -0.1, marketCap: 78000 },
    { symbol: "FCX", name: "Freeport-McMoRan", changePct: -0.8, marketCap: 67000 },
    { symbol: "NEM", name: "Newmont Corp", changePct: 0.8, marketCap: 56000 },
    { symbol: "ECL", name: "Ecolab", changePct: 0.6, marketCap: 54000 },
    { symbol: "DOW", name: "Dow Inc", changePct: -0.5, marketCap: 45000 },
    { symbol: "NUE", name: "Nucor", changePct: 0.3, marketCap: 38000 },
    { symbol: "DD", name: "DuPont", changePct: -0.4, marketCap: 34000 },
  ],
};

export default function SP500Heatmap() {
  const getHeatmapColor = (pct: number) => {
    if (pct > 2) return "bg-emerald-600 text-white";
    if (pct > 1) return "bg-emerald-700/90 text-emerald-50";
    if (pct > 0.5) return "bg-emerald-800/80 text-emerald-100";
    if (pct > 0) return "bg-emerald-900/70 text-emerald-200";
    if (pct === 0) return "bg-slate-700 text-slate-300";
    if (pct > -0.5) return "bg-red-900/70 text-red-200";
    if (pct > -1) return "bg-red-800/80 text-red-100";
    if (pct > -2) return "bg-red-700/90 text-red-50";
    return "bg-red-600 text-white";
  };

  const getSectorColor = (sector: string) => {
    const colors: Record<string, string> = {
      "Technology": "text-emerald-400",
      "Communication Services": "text-red-400",
      "Consumer Cyclical": "text-red-400",
      "Consumer Defensive": "text-red-400",
      "Financial Services": "text-red-400",
      "Healthcare": "text-red-400",
      "Energy": "text-emerald-400",
      "Industrials": "text-blue-400",
      "Utilities": "text-red-400",
      "Real Estate": "text-blue-400",
      "Basic Materials": "text-emerald-400",
    };
    return colors[sector] || "text-slate-400";
  };

  const getSectorBoxSize = (marketCap: number, sector: string, index: number) => {
    // Technology sector - varied sizes
    if (sector === "Technology") {
      if (index === 0) return "col-span-2 row-span-2"; // AAPL
      if (index === 1) return "col-span-2 row-span-2"; // MSFT
      if (index === 2) return "col-span-2 row-span-2"; // NVDA
      if (index < 6) return "col-span-2 row-span-1";
      return "col-span-1 row-span-1";
    }
    
    // Communication Services - GOOGL and META larger
    if (sector === "Communication Services") {
      if (index === 0) return "col-span-2 row-span-2"; // GOOGL
      if (index === 1) return "col-span-2 row-span-2"; // META
      return "col-span-1 row-span-1";
    }
    
    // Consumer Cyclical - AMZN and TSLA larger
    if (sector === "Consumer Cyclical") {
      if (index === 0) return "col-span-2 row-span-2"; // AMZN
      if (index === 1) return "col-span-2 row-span-1"; // TSLA
      if (index === 2) return "col-span-2 row-span-1"; // HD
      return "col-span-1 row-span-1";
    }
    
    // Consumer Defensive - WMT larger
    if (sector === "Consumer Defensive") {
      if (index === 0) return "col-span-2 row-span-1"; // WMT
      return "col-span-1 row-span-1";
    }
    
    // Financial Services - varied sizes
    if (sector === "Financial Services") {
      if (index === 0) return "col-span-2 row-span-2"; // BRK.B
      if (index === 1) return "col-span-2 row-span-1"; // JPM
      if (index < 4) return "col-span-2 row-span-1";
      return "col-span-1 row-span-1";
    }
    
    // Healthcare - top stocks larger
    if (sector === "Healthcare") {
      if (index < 2) return "col-span-2 row-span-1";
      return "col-span-1 row-span-1";
    }
    
    // Energy - XOM larger
    if (sector === "Energy") {
      if (index === 0) return "col-span-2 row-span-1"; // XOM
      return "col-span-1 row-span-1";
    }
    
    // All other sectors - mostly small boxes
    if (marketCap > 500000) return "col-span-2 row-span-1";
    return "col-span-1 row-span-1";
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">S&P 500 Heatmap</h2>
          <p className="text-xs text-slate-400">Grouped by sector, sized by Market Cap</p>
        </div>
        <div className="flex gap-1 text-[10px] uppercase font-bold text-slate-500">
          <div className="flex gap-0.5 items-center mr-2">
            <span className="w-3 h-3 bg-red-600 rounded-sm"></span>
            <span>-2%</span>
          </div>
          <div className="flex gap-0.5 items-center mr-2">
            <span className="w-3 h-3 bg-slate-700 rounded-sm"></span>
            <span>0%</span>
          </div>
          <div className="flex gap-0.5 items-center">
            <span className="w-3 h-3 bg-emerald-600 rounded-sm"></span>
            <span>+2%</span>
          </div>
        </div>
      </div>

      <div className="h-[400px] overflow-hidden">
        <div className="flex gap-0.5 h-full">
          {Object.entries(SP500_BY_SECTOR).map(([sector, stocks]) => {
            // Calculate column width based on sector
            let columnWidth = '100px';
            if (sector === "Technology") columnWidth = '160px';
            else if (sector === "Communication Services") columnWidth = '120px';
            else if (sector === "Consumer Cyclical") columnWidth = '120px';
            else if (sector === "Financial Services") columnWidth = '140px';
            else if (sector === "Healthcare") columnWidth = '140px';
            else if (sector === "Energy") columnWidth = '100px';
            else if (sector === "Industrials") columnWidth = '120px';
            else if (sector === "Utilities") columnWidth = '90px';
            else if (sector === "Real Estate") columnWidth = '100px';
            else if (sector === "Basic Materials") columnWidth = '90px';
            else if (sector === "Consumer Defensive") columnWidth = '100px';
            
            return (
              <div key={sector} className="flex flex-col gap-0.5 flex-shrink-0" style={{ width: columnWidth }}>
                {/* Sector Header - Vertical */}
                <div className="flex items-center gap-1 py-0.5 px-1 bg-slate-800/30 rounded-sm">
                  <h3 className={cn("text-[7px] font-bold uppercase tracking-wider whitespace-nowrap", getSectorColor(sector))}>
                    {sector.split(' ')[0]}
                  </h3>
                  <span className="text-[6px] text-slate-500 whitespace-nowrap">
                    {stocks.reduce((sum, s) => sum + s.changePct, 0) > 0 ? "+" : ""}
                    {(stocks.reduce((sum, s) => sum + s.changePct, 0) / stocks.length).toFixed(1)}%
                  </span>
                </div>

                {/* Sector Stocks - Vertical Stack */}
                <div className="grid grid-cols-2 auto-rows-[26px] gap-0.5 flex-1 content-start">
                  {stocks.map((stock, index) => (
                    <motion.div
                      key={stock.symbol}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.003, duration: 0.15 }}
                      className={cn(
                        "relative group cursor-pointer overflow-hidden rounded-sm flex flex-col items-center justify-center p-0.5 transition-all hover:ring-1 hover:ring-white/50 hover:z-10",
                        getHeatmapColor(stock.changePct),
                        getSectorBoxSize(stock.marketCap, sector, index)
                      )}
                    >
                      <span className="font-bold tracking-tighter leading-none text-[8px]">{stock.symbol}</span>
                      <span className="font-semibold opacity-90 text-[6px] leading-none mt-0.5">
                        {stock.changePct > 0 ? "+" : ""}
                        {stock.changePct.toFixed(1)}%
                      </span>

                      {/* Tooltip on Hover */}
                      <div className="absolute inset-0 bg-black/95 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-center p-1 backdrop-blur-sm z-20 pointer-events-none">
                        <p className="text-[10px] font-bold text-white mb-0.5">{stock.symbol}</p>
                        <p className="text-[8px] text-slate-300 leading-tight mb-0.5">{stock.name}</p>
                        <p className={cn(
                          "text-[9px] font-bold",
                          stock.changePct > 0 ? "text-emerald-400" : "text-red-400"
                        )}>
                          {stock.changePct > 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                        </p>
                        <p className="text-[7px] text-slate-400 mt-0.5">M.Cap: ${(stock.marketCap / 1000).toFixed(0)}B</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
