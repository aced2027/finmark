'use client';
import React, { useState } from 'react';
import { useChart } from '@/lib/chart/chartContext';
import type { IndicatorType, IndicatorConfig } from '@/lib/chart/indicators';
import styles from './IndicatorPanel.module.css';

interface IndicatorDef {
    type: IndicatorType;
    name: string;
    description: string;
    pane: 'main' | 'sub';
    defaultParams: Record<string, number>;
    defaultColor: string;
}

const INDICATORS: IndicatorDef[] = [
    { type: 'EMA', name: 'EMA', description: 'Exponential Moving Average', pane: 'main', defaultParams: { period: 20 }, defaultColor: '#f7c948' },
    { type: 'SMA', name: 'SMA', description: 'Simple Moving Average', pane: 'main', defaultParams: { period: 20 }, defaultColor: '#b083f0' },
    { type: 'BB', name: 'Bollinger Bands', description: 'Standard deviation bands', pane: 'main', defaultParams: { period: 20, stdDev: 2 }, defaultColor: '#58a6ff' },
    { type: 'VWAP', name: 'VWAP', description: 'Volume Weighted Average Price', pane: 'main', defaultParams: {}, defaultColor: '#db6d28' },
    { type: 'Supertrend', name: 'Supertrend', description: 'ATR-based trend indicator', pane: 'main', defaultParams: { period: 10, multiplier: 3 }, defaultColor: '#39c5cf' },
    { type: 'RSI', name: 'RSI', description: 'Relative Strength Index', pane: 'sub', defaultParams: { period: 14 }, defaultColor: '#8957e5' },
    { type: 'MACD', name: 'MACD', description: 'Moving Average Convergence Divergence', pane: 'sub', defaultParams: { fast: 12, slow: 26, signal: 9 }, defaultColor: '#388bfd' },
    { type: 'Stoch', name: 'Stochastic', description: 'Stochastic Oscillator', pane: 'sub', defaultParams: { k: 14, d: 3 }, defaultColor: '#f7c948' },
    { type: 'ATR', name: 'ATR', description: 'Average True Range', pane: 'sub', defaultParams: { period: 14 }, defaultColor: '#db6d28' },
    { type: 'ADX', name: 'ADX', description: 'Average Directional Index', pane: 'sub', defaultParams: { period: 14 }, defaultColor: '#39c5cf' },
    { type: 'Ichimoku', name: 'Ichimoku Cloud', description: 'Ichimoku Kinko Hyo', pane: 'main', defaultParams: { tenkan: 9, kijun: 26, senkouB: 52 }, defaultColor: '#e3b341' },
    { type: 'VolumeProfile', name: 'Volume Profile', description: 'Volume distribution by price', pane: 'main', defaultParams: { bars: 20 }, defaultColor: '#388bfd' },
];

export default function IndicatorPanel() {
    const { indicators, addIndicator, removeIndicator, toggleIndicator } = useChart();
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = INDICATORS.filter((ind) =>
        ind.name.toLowerCase().includes(search.toLowerCase()) ||
        ind.description.toLowerCase().includes(search.toLowerCase())
    );

    const handleAdd = (ind: IndicatorDef) => {
        const config: IndicatorConfig = {
            id: `${ind.type}-${Date.now()}`,
            type: ind.type,
            params: ind.defaultParams,
            visible: true,
            color: ind.defaultColor,
            pane: ind.pane,
        };
        addIndicator(config);
        setOpen(false);
    };

    return (
        <div className={styles.wrapper}>
            {/* Active indicators list */}
            <div className={styles.activeList}>
                {indicators.map((ind) => (
                    <div key={ind.id} className={styles.activeItem}>
                        <span className={styles.indColor} style={{ background: ind.color }} />
                        <span className={styles.indName}>{ind.type}</span>
                        <button className={styles.visBtn} onClick={() => toggleIndicator(ind.id)} title={ind.visible ? 'Hide' : 'Show'}>
                            {ind.visible ? '👁' : '🙈'}
                        </button>
                        <button className={styles.removeBtn} onClick={() => removeIndicator(ind.id)} title="Remove">✕</button>
                    </div>
                ))}
            </div>

            {/* Add indicator button */}
            <div className={styles.addSection}>
                <button className={styles.addBtn} onClick={() => setOpen(!open)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <line x1="6" y1="1" x2="6" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        <line x1="1" y1="6" x2="11" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Add Indicator
                </button>

                {open && (
                    <div className={styles.picker}>
                        <div className={styles.pickerHeader}>
                            <input
                                className={styles.pickerSearch}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search indicators..."
                                autoFocus
                            />
                        </div>
                        <div className={styles.pickerList}>
                            {filtered.map((ind) => (
                                <button key={ind.type} className={styles.pickerItem} onClick={() => handleAdd(ind)}>
                                    <div className={styles.pickerItemLeft}>
                                        <span className={styles.pickerName}>{ind.name}</span>
                                        <span className={styles.pickerDesc}>{ind.description}</span>
                                    </div>
                                    <span className={`${styles.paneTag} ${ind.pane === 'main' ? styles.paneMain : styles.paneSub}`}>
                                        {ind.pane}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
