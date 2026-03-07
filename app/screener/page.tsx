"use client";
import { useState } from 'react';
import StockDetailsPanel from "@/components/screener/StockDetailsPanel";
import StockScreenerTable from "@/components/screener/StockScreenerTable";
import ScreenerFilters from "@/components/screener/ScreenerFilters";

export default function ScreenerPage() {
    const [selectedStock, setSelectedStock] = useState<string | null>("TCS");
    const [filters, setFilters] = useState({});

    return (
        <div className="flex-1 flex flex-col h-[calc(100vh-5.5rem)] overflow-hidden bg-[#0f1117]">
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-4 lg:p-6">
                    <div className="max-w-[1800px] mx-auto w-full space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white tracking-tight mb-1">
                                    Stock Screener
                                </h1>
                                <p className="text-sm text-slate-400">
                                    Screen stocks by various parameters. Click on any stock to view detailed analysis.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-xs font-medium text-emerald-400">Live Data • NSE & BSE</span>
                            </div>
                        </div>

                        {/* Stock Details Panel - Shows when stock is selected */}
                        {selectedStock && (
                            <StockDetailsPanel 
                                stockSymbol={selectedStock} 
                                onClose={() => setSelectedStock(null)}
                            />
                        )}

                        {/* Filters */}
                        <ScreenerFilters onFilterChange={setFilters} />

                        {/* Screener Table */}
                        <StockScreenerTable 
                            filters={filters}
                            onStockSelect={setSelectedStock}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
