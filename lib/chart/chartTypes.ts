import { OHLCV } from '@/lib/data/binance';

export type ChartType = 'candlestick' | 'line' | 'area' | 'bar' | 'heikinashi' | 'renko' | 'kagi' | 'baseline' | 'hollow';

// ── Heikin Ashi ──────────────────────────────────────────────────────────────
export function toHeikinAshi(candles: OHLCV[]): OHLCV[] {
    const result: OHLCV[] = [];
    for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        const haClose = (c.open + c.high + c.low + c.close) / 4;
        const haOpen = i === 0
            ? (c.open + c.close) / 2
            : (result[i - 1].open + result[i - 1].close) / 2;
        const haHigh = Math.max(c.high, haOpen, haClose);
        const haLow = Math.min(c.low, haOpen, haClose);
        result.push({ time: c.time, open: haOpen, high: haHigh, low: haLow, close: haClose, volume: c.volume });
    }
    return result;
}

// ── Renko ─────────────────────────────────────────────────────────────────────
// Renko boxes with synthetic monotonically increasing timestamps so
// lightweight-charts never complains about duplicate or out-of-order times.
export function toRenko(candles: OHLCV[], boxSize?: number): OHLCV[] {
    if (candles.length === 0) return [];

    // Auto-calculate box size as ATR(14)/2
    if (!boxSize) {
        const atrPeriod = Math.min(14, candles.length - 1);
        let trSum = 0;
        for (let i = 1; i <= atrPeriod; i++) {
            const c = candles[i], p = candles[i - 1];
            trSum += Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close));
        }
        boxSize = Math.max((trSum / atrPeriod) / 2, candles[0].close * 0.001);
    }

    // Detect the interval in seconds between candles (for synthetic timestamps)
    const intervalSec = candles.length > 1 ? (candles[1].time as number) - (candles[0].time as number) : 3600;

    const renkoCandles: OHLCV[] = [];
    let currentOpen = Math.floor(candles[0].close / boxSize) * boxSize;
    let syntheticTime = candles[0].time as number;

    for (const c of candles) {
        // Bullish boxes
        while (c.close >= currentOpen + boxSize) {
            renkoCandles.push({
                time: syntheticTime as any,
                open: currentOpen,
                high: currentOpen + boxSize,
                low: currentOpen,
                close: currentOpen + boxSize,
                volume: c.volume,
            });
            currentOpen += boxSize;
            syntheticTime += intervalSec;
        }
        // Bearish boxes
        while (c.close <= currentOpen - boxSize) {
            renkoCandles.push({
                time: syntheticTime as any,
                open: currentOpen,
                high: currentOpen,
                low: currentOpen - boxSize,
                close: currentOpen - boxSize,
                volume: c.volume,
            });
            currentOpen -= boxSize;
            syntheticTime += intervalSec;
        }
        // Advance synthetic time if we didn't emit a box for this candle
        // to prevent stagnation (only advance if no boxes were emitted this iter)
        if (renkoCandles.length > 0) {
            const lastTime = renkoCandles[renkoCandles.length - 1].time as number;
            if (lastTime < (c.time as number)) {
                syntheticTime = Math.max(syntheticTime, (c.time as number));
            }
        }
    }

    // Ensure we have at least some data — if Renko produced nothing, show last candle
    if (renkoCandles.length === 0) {
        const last = candles[candles.length - 1];
        renkoCandles.push({
            time: last.time,
            open: currentOpen,
            high: currentOpen + boxSize,
            low: currentOpen,
            close: currentOpen + boxSize,
            volume: last.volume,
        });
    }

    return renkoCandles;
}

// ── Kagi ──────────────────────────────────────────────────────────────────────
export function toKagi(candles: OHLCV[], reversalPct = 0.04): OHLCV[] {
    if (candles.length === 0) return [];
    const kagi: OHLCV[] = [];
    let trend: 'up' | 'down' = 'up';
    let prevPoint = candles[0].close;

    for (const c of candles) {
        const change = (c.close - prevPoint) / prevPoint;
        if (trend === 'up' && change <= -reversalPct) {
            kagi.push({ time: c.time, open: prevPoint, high: prevPoint, low: c.close, close: c.close, volume: c.volume });
            trend = 'down';
            prevPoint = c.close;
        } else if (trend === 'down' && change >= reversalPct) {
            kagi.push({ time: c.time, open: prevPoint, high: c.close, low: prevPoint, close: c.close, volume: c.volume });
            trend = 'up';
            prevPoint = c.close;
        }
    }

    // Kagi may produce very few points — fallback to last few candles as bar data
    if (kagi.length < 3) {
        return candles.slice(-20).map(c => ({ ...c }));
    }

    return kagi;
}

// ── Main transform dispatcher ─────────────────────────────────────────────────
export function transformChartData(candles: OHLCV[], type: ChartType): OHLCV[] {
    switch (type) {
        case 'heikinashi': return toHeikinAshi(candles);
        case 'renko': return toRenko(candles);
        case 'kagi': return toKagi(candles);
        default: return candles;
    }
}
