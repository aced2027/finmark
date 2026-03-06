'use client';
import React, { useState } from 'react';
import { useChart } from '@/lib/chart/chartContext';
import type { LayoutType } from '@/lib/chart/chartContext';
import ChartContainer from './ChartContainer';
import styles from './MultiLayout.module.css';

const LAYOUT_CONFIGS: Record<LayoutType, { cols: number; rows: number; count: number }> = {
    '1': { cols: 1, rows: 1, count: 1 },
    '2h': { cols: 2, rows: 1, count: 2 },
    '2v': { cols: 1, rows: 2, count: 2 },
    '4': { cols: 2, rows: 2, count: 4 },
    '8': { cols: 4, rows: 2, count: 8 },
};

// Default symbols for each panel slot so multi-charts show different markets
const DEFAULT_SYMBOLS = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];
const DEFAULT_INTERVALS = ['1D', '1D', '1D', '1D', '4H', '4H', '1H', '1H'];

interface PanelConfig { symbol: string; interval: string }

export default function MultiLayout() {
    const { layout, symbol, interval } = useChart();
    const config = LAYOUT_CONFIGS[layout];

    const [panels, setPanels] = useState<PanelConfig[]>(() =>
        DEFAULT_SYMBOLS.map((s, i) => ({
            symbol: i === 0 ? symbol : s,
            interval: i === 0 ? interval : DEFAULT_INTERVALS[i],
        }))
    );

    return (
        <div
            className={styles.grid}
            style={{
                gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                gridTemplateRows: `repeat(${config.rows}, 1fr)`,
            }}
        >
            {Array.from({ length: config.count }).map((_, i) => (
                <div key={i} className={styles.cell}>
                    <ChartContainer
                        symbol={i === 0 ? symbol : panels[i]?.symbol || DEFAULT_SYMBOLS[i]}
                        interval={i === 0 ? interval : panels[i]?.interval || DEFAULT_INTERVALS[i]}
                    />
                </div>
            ))}
        </div>
    );
}
