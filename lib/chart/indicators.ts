// Technical Indicators Library
import type { OHLCV } from '@/lib/data/binance';

// ---- Moving Averages ----
export function sma(data: number[], period: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) { result.push(NaN); continue; }
        const slice = data.slice(i - period + 1, i + 1);
        result.push(slice.reduce((a, b) => a + b, 0) / period);
    }
    return result;
}

export function ema(data: number[], period: number): number[] {
    const k = 2 / (period + 1);
    const result: number[] = [];
    let prev = NaN;
    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) { result.push(NaN); continue; }
        if (i === period - 1) {
            prev = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
            result.push(prev); continue;
        }
        prev = data[i] * k + prev * (1 - k);
        result.push(prev);
    }
    return result;
}

// ---- RSI ----
export function rsi(closes: number[], period = 14): number[] {
    const result: number[] = Array(closes.length).fill(NaN);
    const gains: number[] = [], losses: number[] = [];

    for (let i = 1; i < closes.length; i++) {
        const diff = closes[i] - closes[i - 1];
        gains.push(Math.max(diff, 0));
        losses.push(Math.max(-diff, 0));
    }

    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;

    for (let i = period; i < closes.length; i++) {
        if (i > period) {
            avgGain = (avgGain * (period - 1) + gains[i - 1]) / period;
            avgLoss = (avgLoss * (period - 1) + losses[i - 1]) / period;
        }
        result[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
    }
    return result;
}

// ---- MACD ----
export interface MACDResult { macd: number[]; signal: number[]; histogram: number[] }
export function macd(closes: number[], fast = 12, slow = 26, signal = 9): MACDResult {
    const fastEMA = ema(closes, fast);
    const slowEMA = ema(closes, slow);
    const macdLine = closes.map((_, i) => (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) ? NaN : fastEMA[i] - slowEMA[i]);
    const validMacd = macdLine.filter((v) => !isNaN(v));
    const signalPad = macdLine.length - validMacd.length;
    const signalLine = [...Array(signalPad).fill(NaN), ...ema(validMacd, signal)];
    const histogram = macdLine.map((m, i) => isNaN(m) || isNaN(signalLine[i]) ? NaN : m - signalLine[i]);
    return { macd: macdLine, signal: signalLine, histogram };
}

// ---- Bollinger Bands ----
export interface BBResult { upper: number[]; middle: number[]; lower: number[] }
export function bollingerBands(closes: number[], period = 20, stdDev = 2): BBResult {
    const middle = sma(closes, period);
    const upper = closes.map((_, i) => {
        if (isNaN(middle[i])) return NaN;
        const slice = closes.slice(i - period + 1, i + 1);
        const mean = middle[i];
        const std = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
        return mean + stdDev * std;
    });
    const lower = closes.map((_, i) => {
        if (isNaN(middle[i])) return NaN;
        const slice = closes.slice(i - period + 1, i + 1);
        const mean = middle[i];
        const std = Math.sqrt(slice.reduce((s, v) => s + (v - mean) ** 2, 0) / period);
        return mean - stdDev * std;
    });
    return { upper, middle, lower };
}

// ---- Stochastic ----
export interface StochResult { k: number[]; d: number[] }
export function stochastic(candles: OHLCV[], kPeriod = 14, dPeriod = 3): StochResult {
    const k = candles.map((_, i) => {
        if (i < kPeriod - 1) return NaN;
        const slice = candles.slice(i - kPeriod + 1, i + 1);
        const highest = Math.max(...slice.map((c) => c.high));
        const lowest = Math.min(...slice.map((c) => c.low));
        return highest === lowest ? 50 : ((candles[i].close - lowest) / (highest - lowest)) * 100;
    });
    const d = sma(k.filter((v) => !isNaN(v)), dPeriod);
    const dPad = k.filter((v) => isNaN(v)).length;
    return { k, d: [...Array(dPad).fill(NaN), ...d] };
}

// ---- ATR ----
export function atr(candles: OHLCV[], period = 14): number[] {
    const tr = candles.map((c, i) => {
        if (i === 0) return c.high - c.low;
        const prev = candles[i - 1];
        return Math.max(c.high - c.low, Math.abs(c.high - prev.close), Math.abs(c.low - prev.close));
    });
    return sma(tr, period);
}

// ---- Supertrend ----
export interface SupertrendResult { value: number[]; direction: ('up' | 'down')[] }
export function supertrend(candles: OHLCV[], period = 10, multiplier = 3): SupertrendResult {
    const atrValues = atr(candles, period);
    const value: number[] = Array(candles.length).fill(NaN);
    const direction: ('up' | 'down')[] = Array(candles.length).fill('up');
    let prevST = 0, prevDir: 'up' | 'down' = 'up';

    for (let i = period; i < candles.length; i++) {
        const c = candles[i];
        const hl2 = (c.high + c.low) / 2;
        const upperBand = hl2 + multiplier * atrValues[i];
        const lowerBand = hl2 - multiplier * atrValues[i];

        let st: number;
        if (prevDir === 'up') {
            st = c.close < prevST ? upperBand : Math.min(lowerBand, prevST || lowerBand);
            direction[i] = c.close < prevST ? 'down' : 'up';
        } else {
            st = c.close > prevST ? lowerBand : Math.max(upperBand, prevST || upperBand);
            direction[i] = c.close > prevST ? 'up' : 'down';
        }
        value[i] = st;
        prevST = st;
        prevDir = direction[i];
    }
    return { value, direction };
}

// ---- VWAP ----
export function vwap(candles: OHLCV[]): number[] {
    let cumulativePV = 0, cumulativeV = 0;
    return candles.map((c) => {
        const tp = (c.high + c.low + c.close) / 3;
        cumulativePV += tp * c.volume;
        cumulativeV += c.volume;
        return cumulativeV === 0 ? tp : cumulativePV / cumulativeV;
    });
}

// ---- Ichimoku ----
export interface IchimokuResult {
    tenkan: number[]; kijun: number[];
    spanA: number[]; spanB: number[];
    chikou: number[];
}
function highLowMid(candles: OHLCV[], period: number, i: number): number {
    const slice = candles.slice(Math.max(0, i - period + 1), i + 1);
    return (Math.max(...slice.map((c) => c.high)) + Math.min(...slice.map((c) => c.low))) / 2;
}
export function ichimoku(candles: OHLCV[], tenkanPeriod = 9, kijunPeriod = 26, senkouBPeriod = 52): IchimokuResult {
    const n = candles.length;
    const tenkan = candles.map((_, i) => i < tenkanPeriod - 1 ? NaN : highLowMid(candles, tenkanPeriod, i));
    const kijun = candles.map((_, i) => i < kijunPeriod - 1 ? NaN : highLowMid(candles, kijunPeriod, i));
    const spanA = tenkan.map((t, i) => isNaN(t) || isNaN(kijun[i]) ? NaN : (t + kijun[i]) / 2);
    const spanB = candles.map((_, i) => i < senkouBPeriod - 1 ? NaN : highLowMid(candles, senkouBPeriod, i));
    const chikou = candles.map((c, i) => i < kijunPeriod ? NaN : c.close);
    return { tenkan, kijun, spanA, spanB, chikou };
}

// ---- ADX ----
export function adx(candles: OHLCV[], period = 14): number[] {
    const result: number[] = Array(candles.length).fill(NaN);
    const tr: number[] = [], plusDM: number[] = [], minusDM: number[] = [];

    for (let i = 1; i < candles.length; i++) {
        const c = candles[i], p = candles[i - 1];
        tr.push(Math.max(c.high - c.low, Math.abs(c.high - p.close), Math.abs(c.low - p.close)));
        const upMove = c.high - p.high;
        const downMove = p.low - c.low;
        plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
        minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
    }

    const smoothTR = sma(tr, period);
    const smoothPlusDM = sma(plusDM, period);
    const smoothMinusDM = sma(minusDM, period);

    const dx: number[] = smoothTR.map((t, i) => {
        if (isNaN(t) || t === 0) return NaN;
        const pdi = (smoothPlusDM[i] / t) * 100;
        const mdi = (smoothMinusDM[i] / t) * 100;
        return Math.abs(pdi - mdi) / (pdi + mdi) * 100;
    });

    const adxValues = sma(dx.filter((v) => !isNaN(v)), period);
    const pad = dx.filter((v) => isNaN(v)).length;

    for (let i = 0; i < adxValues.length; i++) {
        result[i + pad + 1] = adxValues[i]; // +1 for the tr offset
    }
    return result;
}

// ---- Volume Profile ----
export interface VolumeProfileBar { price: number; volume: number; buyVolume: number; sellVolume: number }
export function volumeProfile(candles: OHLCV[], numBars = 20): VolumeProfileBar[] {
    if (candles.length === 0) return [];
    const allHighs = candles.map((c) => c.high);
    const allLows = candles.map((c) => c.low);
    const maxPrice = Math.max(...allHighs);
    const minPrice = Math.min(...allLows);
    const step = (maxPrice - minPrice) / numBars;

    const bars: VolumeProfileBar[] = Array.from({ length: numBars }, (_, i) => ({
        price: minPrice + step * (i + 0.5),
        volume: 0, buyVolume: 0, sellVolume: 0,
    }));

    for (const c of candles) {
        const mid = (c.high + c.low) / 2;
        const idx = Math.min(Math.floor((mid - minPrice) / step), numBars - 1);
        if (idx >= 0) {
            bars[idx].volume += c.volume;
            if (c.close >= c.open) bars[idx].buyVolume += c.volume;
            else bars[idx].sellVolume += c.volume;
        }
    }
    return bars;
}

export type IndicatorType = 'EMA' | 'SMA' | 'RSI' | 'MACD' | 'BB' | 'Stoch' | 'ATR' | 'Supertrend' | 'VWAP' | 'Ichimoku' | 'ADX' | 'VolumeProfile';

export interface IndicatorConfig {
    id: string;
    type: IndicatorType;
    params: Record<string, number | string>;
    visible: boolean;
    color?: string;
    pane?: 'main' | 'sub';
}
