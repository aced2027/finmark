'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useChart } from '@/lib/chart/chartContext';
import type { ChartType } from '@/lib/chart/chartTypes';
import styles from './ChartToolbar.module.css';

const POPULAR_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'Stock' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'Stock' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'Stock' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Stock' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Stock' },
    { symbol: 'META', name: 'Meta Platforms', type: 'Stock' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', type: 'Stock' },
    { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Stock' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF', type: 'ETF' },
    { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF' },
    { symbol: 'EURUSD=X', name: 'EUR/USD', type: 'Forex' },
    { symbol: 'GBPUSD=X', name: 'GBP/USD', type: 'Forex' },
    { symbol: 'GC=F', name: 'Gold', type: 'Commodity' },
    { symbol: 'CL=F', name: 'Crude Oil', type: 'Commodity' },
    { symbol: '^IXIC', name: 'NASDAQ Composite', type: 'Index' },
    { symbol: '^DJI', name: 'Dow Jones Industrial Average', type: 'Index' }
];

const TIMEFRAMES = ['1m', '3m', '5m', '15m', '30m', '1H', '4H', '1D', '1W', '1M'];

interface ChartTypeDef { type: ChartType; label: string; icon: React.ReactNode }
const CHART_TYPES: ChartTypeDef[] = [
    {
        type: 'candlestick', label: 'Candles',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><line x1="4" y1="2" x2="4" y2="5" /><rect x="2" y="5" width="4" height="5" /><line x1="4" y1="10" x2="4" y2="14" /><line x1="11" y1="1" x2="11" y2="4" /><rect x="9" y="4" width="4" height="7" style={{ fill: 'currentColor' }} /><line x1="11" y1="11" x2="11" y2="14" /></svg>
    },
    {
        type: 'heikinashi', label: 'Heikin Ashi',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><line x1="4" y1="1" x2="4" y2="4" /><rect x="2" y="4" width="4" height="6" rx="0.5" /><line x1="4" y1="10" x2="4" y2="15" /><line x1="11" y1="2" x2="11" y2="5" /><rect x="9" y="5" width="4" height="5" rx="0.5" fill="currentColor" /><line x1="11" y1="10" x2="11" y2="14" /></svg>
    },
    {
        type: 'line', label: 'Line',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="1,13 5,8 9,10 13,4 15,6" /></svg>
    },
    {
        type: 'area', label: 'Area',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><polyline points="1,13 5,8 9,10 13,4 15,6 15,14 1,14" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    },
    {
        type: 'bar', label: 'Bars',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"><line x1="4" y1="2" x2="4" y2="14" /><line x1="1" y1="6" x2="4" y2="6" /><line x1="4" y1="10" x2="7" y2="10" /><line x1="11" y1="1" x2="11" y2="13" /><line x1="8" y1="4" x2="11" y2="4" /><line x1="11" y1="9" x2="14" y2="9" /></svg>
    },
    {
        type: 'baseline', label: 'Baseline',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><line x1="1" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" /><polyline points="1,13 5,5 9,8 13,3 15,5 15,9 1,9" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
    },
    {
        type: 'renko', label: 'Renko',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="1" y="9" width="4" height="5" /><rect x="6" y="6" width="4" height="8" fill="currentColor" /><rect x="11" y="3" width="4" height="11" /></svg>
    },
    {
        type: 'kagi', label: 'Kagi',
        icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><polyline points="3,14 3,4 8,4 8,10 13,10 13,2" /></svg>
    },
];

export default function ChartToolbar() {
    const ctx = useChart();
    const [showSearch, setShowSearch] = useState(false);
    const [showChartType, setShowChartType] = useState(false);
    const [query, setQuery] = useState('');
    const [allSyms, setAllSyms] = useState<typeof POPULAR_STOCKS>([]);
    const [results, setResults] = useState<typeof POPULAR_STOCKS>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const ctDivRef = useRef<HTMLDivElement>(null);

    const currentType = CHART_TYPES.find(t => t.type === ctx.chartType) || CHART_TYPES[0];

    const openSearch = async () => {
        setShowSearch(true);
        setTimeout(() => inputRef.current?.focus(), 30);
        if (allSyms.length === 0) {
            setAllSyms(POPULAR_STOCKS);
            setResults(POPULAR_STOCKS.slice(0, 30));
        }
    };

    const handleQuery = (q: string) => {
        setQuery(q);
        setResults(allSyms.filter(s =>
            s.symbol.toLowerCase().startsWith(q.toLowerCase()) ||
            s.name.toLowerCase().includes(q.toLowerCase())
        ).slice(0, 30));
    };

    const pickSym = (sym: string) => {
        ctx.setSymbol(sym);
        setShowSearch(false);
        setQuery('');
    };

    // Close chart type dropdown on outside click
    useEffect(() => {
        if (!showChartType) return;
        const handler = (e: MouseEvent) => {
            if (!ctDivRef.current?.contains(e.target as Node)) setShowChartType(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showChartType]);

    return (
        <>
            <div className={styles.toolbar}>
                {/* Symbol button */}
                <button className={styles.symbolBtn} onClick={openSearch}>
                    <span className={styles.symbolName}>{ctx.symbol}</span>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className={styles.caret}>
                        <path d="M1 2.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
                    </svg>
                </button>

                <div className={styles.vsep} />

                {/* Timeframes */}
                <div className={styles.tfGroup}>
                    {TIMEFRAMES.map(tf => (
                        <button
                            key={tf}
                            className={`${styles.tfBtn} ${ctx.interval === tf ? styles.tfActive : ''}`}
                            onClick={() => ctx.setInterval(tf)}
                        >{tf}</button>
                    ))}
                </div>

                <div className={styles.vsep} />

                {/* Chart type picker */}
                <div className={styles.ctWrap} ref={ctDivRef}>
                    <button
                        className={styles.ctBtn}
                        onClick={() => setShowChartType(v => !v)}
                        title="Chart type"
                    >
                        {currentType.icon}
                        <span className={styles.ctLabel}>{currentType.label}</span>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" className={styles.caret}>
                            <path d="M1 2.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                        </svg>
                    </button>
                    {showChartType && (
                        <div className={styles.ctMenu}>
                            {CHART_TYPES.map(ct => (
                                <button
                                    key={ct.type}
                                    className={`${styles.ctItem} ${ctx.chartType === ct.type ? styles.ctItemActive : ''}`}
                                    onClick={() => { ctx.setChartType(ct.type); setShowChartType(false); }}
                                >
                                    <span className={styles.ctItemIcon}>{ct.icon}</span>
                                    <span>{ct.label}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className={styles.vsep} />

                {/* Scale controls */}
                <div className={styles.scaleGroup}>
                    <button
                        className={`${styles.scaleBtn} ${ctx.logScale ? styles.scaleBtnActive : ''}`}
                        onClick={() => ctx.setLogScale(!ctx.logScale)}
                        title="Log scale"
                    >Log</button>
                    <button
                        className={`${styles.scaleBtn} ${ctx.autoScale ? styles.scaleBtnActive : ''}`}
                        onClick={() => ctx.setAutoScale(!ctx.autoScale)}
                        title="Auto scale"
                    >Auto</button>
                    <button
                        className={`${styles.scaleBtn} ${ctx.magnetMode ? styles.scaleBtnActive : ''}`}
                        onClick={() => ctx.setMagnetMode(!ctx.magnetMode)}
                        title="Magnet mode"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                            <path d="M2 7a5 5 0 0010 0V3" />
                            <line x1="2" y1="3" x2="5" y2="3" />
                            <line x1="9" y1="3" x2="12" y2="3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Symbol search modal */}
            {showSearch && (
                <div className={styles.overlay} onClick={() => setShowSearch(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.searchRow}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <circle cx="7" cy="7" r="4.5" stroke="#787b86" strokeWidth="1.4" />
                                <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="#787b86" strokeWidth="1.4" strokeLinecap="round" />
                            </svg>
                            <input
                                ref={inputRef}
                                className={styles.searchInput}
                                placeholder="Search symbol e.g. BTCUSDT, AAPL"
                                value={query}
                                onChange={e => handleQuery(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' && query.trim()) {
                                        pickSym(query.trim().toUpperCase());
                                    }
                                }}
                            />
                            <button className={styles.closeBtn} onClick={() => setShowSearch(false)}>✕</button>
                        </div>
                        <div className={styles.tabs}>
                            <span className={`${styles.tab} ${styles.tabActive}`}>Crypto</span>
                            <span className={styles.tab}>Forex</span>
                            <span className={styles.tab}>Stocks</span>
                            <span className={styles.tab}>Indices</span>
                        </div>
                        <div className={styles.resultList}>
                            {query.trim() && (
                                <button className={styles.resultRow} onClick={() => pickSym(query.trim().toUpperCase())}>
                                    <span className={styles.resultIcon}>{query.trim()[0]?.toUpperCase() || '?'}</span>
                                    <div className={styles.resultInfo}>
                                        <span className={styles.resultSym}>{query.trim().toUpperCase()}</span>
                                        <span className={styles.resultDesc}>Custom Search (Yahoo / Binance)</span>
                                    </div>
                                    <span className={styles.exchangeTag}>ENTER</span>
                                </button>
                            )}
                            {results.map(s => (
                                <button key={s.symbol} className={styles.resultRow} onClick={() => pickSym(s.symbol)}>
                                    <span className={styles.resultIcon}>{s.symbol[0]}</span>
                                    <div className={styles.resultInfo}>
                                        <span className={styles.resultSym}>{s.symbol}</span>
                                        <span className={styles.resultDesc}>{s.name}</span>
                                    </div>
                                    <span className={styles.exchangeTag}>{s.type.toUpperCase()}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
