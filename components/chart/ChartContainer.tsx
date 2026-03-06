'use client';
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
    createChart, IChartApi, ISeriesApi, CandlestickSeries,
    LineSeries, AreaSeries, BarSeries, BaselineSeries,
    ColorType, CrosshairMode, PriceScaleMode, LineStyle,
} from 'lightweight-charts';
import { useChart } from '@/lib/chart/chartContext';
import { fetchUniversalCandles, subscribeUniversalCandle } from '@/lib/data/universalMarket';
import type { OHLCV } from '@/lib/data/binance';
import { transformChartData } from '@/lib/chart/chartTypes';
import {
    ema, sma, rsi, macd, bollingerBands, supertrend, vwap,
    ichimoku, stochastic, atr, adx
} from '@/lib/chart/indicators';
import DrawingCanvas from './DrawingCanvas';
import ReplayControls from './ReplayControls';
import styles from './ChartContainer.module.css';

interface ChartContainerProps {
    symbol?: string;
    interval?: string;
}

const SUB_PANE_HEIGHT = 130;

const CHART_THEME = {
    layout: {
        background: { type: ColorType.Solid, color: '#131722' },
        textColor: '#787b86',
        fontSize: 11,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Trebuchet MS", Roboto, Ubuntu, sans-serif',
    },
    grid: {
        vertLines: { color: '#1e222d', style: LineStyle.Solid },
        horzLines: { color: '#1e222d', style: LineStyle.Solid },
    },
    crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { color: '#758696', labelBackgroundColor: '#2962ff', width: 1 as const, style: LineStyle.Solid },
        horzLine: { color: '#758696', labelBackgroundColor: '#2962ff', width: 1 as const, style: LineStyle.Solid },
    },
    rightPriceScale: {
        borderColor: '#2a2e39',
        scaleMargins: { top: 0.08, bottom: 0.08 },
    },
    timeScale: {
        borderColor: '#2a2e39',
        timeVisible: true,
        secondsVisible: false,
    },
} as const;


export default function ChartContainer({ symbol: symProp, interval: intProp }: ChartContainerProps) {
    const ctx = useChart();
    const symbol = symProp ?? ctx.symbol;
    const interval = intProp ?? ctx.interval;

    const wrapperRef = useRef<HTMLDivElement>(null);
    const mainChartDivRef = useRef<HTMLDivElement>(null);
    const mainChartRef = useRef<IChartApi | null>(null);
    const mainSeriesRef = useRef<ISeriesApi<any> | null>(null);
    const mainIndicatorSeriesRef = useRef<ISeriesApi<any>[]>([]);

    // Sub-pane refs stored by indicator id
    const subPaneDivRefs = useRef<Map<string, HTMLDivElement>>(new Map());
    const subPaneChartRefs = useRef<Map<string, IChartApi>>(new Map());

    const [candles, setCandles] = useState<OHLCV[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [wsStatus, setWsStatus] = useState<'live' | 'off'>('off');
    const [ohlcvInfo, setOhlcvInfo] = useState<{ open?: number; high?: number; low?: number; close: number; volume: number } | null>(null);

    const unsubRef = useRef<(() => void) | null>(null);
    const replayTimerRef = useRef<NodeJS.Timeout | null>(null);
    const candlesRef = useRef<OHLCV[]>([]);
    candlesRef.current = candles;

    const subIndicators = useMemo(() =>
        ctx.indicators.filter(i => (i.pane === 'sub') && i.visible),
        [ctx.indicators]
    );
    const mainIndicators = useMemo(() =>
        ctx.indicators.filter(i => (i.pane !== 'sub') && i.visible),
        [ctx.indicators]
    );

    // ------ Main chart init ------
    useEffect(() => {
        if (!mainChartDivRef.current) return;
        const container = mainChartDivRef.current;
        const chart = createChart(container, {
            ...CHART_THEME,
            handleScroll: {
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: true,
                mouseWheel: true
            },
            handleScale: {
                axisPressedMouseMove: { time: true, price: true },
                mouseWheel: true,
                pinch: true
            },
        });
        mainChartRef.current = chart;

        const candleSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a', downColor: '#ef5350',
            borderUpColor: '#26a69a', borderDownColor: '#ef5350',
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
        });
        mainSeriesRef.current = candleSeries;

        chart.subscribeCrosshairMove((param) => {
            const data = param.seriesData?.get(mainSeriesRef.current!);
            if (data) {
                const d = data as any;
                // Single-value series (Line/Area/Baseline) only have `value`
                if (d.value !== undefined && d.open === undefined) {
                    setOhlcvInfo({ close: d.value, volume: 0 });
                } else {
                    setOhlcvInfo({ open: d.open, high: d.high, low: d.low, close: d.close ?? d.value, volume: 0 });
                }
            }
        });

        return () => {
            chart.remove();
            mainChartRef.current = null;
        };
    }, []);

    // ------ Global Resize Observer ------
    useEffect(() => {
        const ro = new ResizeObserver(() => {
            // Resize main chart
            if (mainChartRef.current && mainChartDivRef.current) {
                mainChartRef.current.resize(
                    mainChartDivRef.current.clientWidth,
                    mainChartDivRef.current.clientHeight
                );
            }
            // Resize all sub-pane charts
            subPaneChartRefs.current.forEach((subChart, indId) => {
                const subDiv = subPaneDivRefs.current.get(indId);
                if (subDiv) {
                    subChart.resize(subDiv.clientWidth, subDiv.clientHeight);
                }
            });
        });

        if (wrapperRef.current) {
            ro.observe(wrapperRef.current);
        }

        return () => {
            ro.disconnect();
        };
    }, []);

    // ------ Data loading ------
    const loadCandles = useCallback(async () => {
        setIsLoading(true);
        setWsStatus('off');
        try {
            const raw = await fetchUniversalCandles(symbol, interval, 500);
            setCandles(raw);
            if (unsubRef.current) unsubRef.current();
            unsubRef.current = subscribeUniversalCandle(symbol, interval, (newCandle) => {
                setWsStatus('live');
                setCandles(prev => {
                    const idx = prev.findIndex(c => c.time === newCandle.time);
                    const updated = idx >= 0
                        ? [...prev.slice(0, idx), newCandle, ...prev.slice(idx + 1)]
                        : [...prev, newCandle];
                    return updated;
                });
                if (mainSeriesRef.current && !ctx.replayMode) {
                    try { mainSeriesRef.current.update(newCandle as any); } catch { }
                }
            });
        } catch (e) {
            console.error('load candles failed:', e);
        } finally {
            setIsLoading(false);
        }
    }, [symbol, interval]);

    useEffect(() => {
        loadCandles();
        return () => { if (unsubRef.current) unsubRef.current(); };
    }, [symbol, interval]);

    // ------ Render main chart ------
    const renderMain = useCallback((raw: OHLCV[]) => {
        const chart = mainChartRef.current;
        if (!chart || raw.length === 0) return;

        // Remove existing main + indicator series
        if (mainSeriesRef.current) {
            try { chart.removeSeries(mainSeriesRef.current); } catch { }
            mainSeriesRef.current = null;
        }
        mainIndicatorSeriesRef.current.forEach(s => { try { chart.removeSeries(s); } catch { } });
        mainIndicatorSeriesRef.current = [];

        const transformed = transformChartData(raw, ctx.chartType);
        let series: ISeriesApi<any> | null = null;

        try {
            switch (ctx.chartType) {
                // ── Price-value series (single number per bar) ──
                case 'line':
                    series = chart.addSeries(LineSeries, {
                        color: '#2962ff',
                        lineWidth: 2,
                        crosshairMarkerVisible: true,
                        lastValueVisible: true,
                        priceLineVisible: true,
                    });
                    series.setData(transformed.map(c => ({ time: c.time, value: c.close })) as any);
                    break;

                case 'area':
                    series = chart.addSeries(AreaSeries, {
                        lineColor: '#2962ff',
                        topColor: 'rgba(41,98,255,0.28)',
                        bottomColor: 'rgba(41,98,255,0.0)',
                        lineWidth: 2,
                        crosshairMarkerVisible: true,
                        lastValueVisible: true,
                    });
                    series.setData(transformed.map(c => ({ time: c.time, value: c.close })) as any);
                    break;

                case 'baseline': {
                    const prices = transformed.map(c => c.close);
                    const mid = prices.reduce((a, b) => a + b, 0) / prices.length;
                    series = chart.addSeries(BaselineSeries, {
                        baseValue: { type: 'price', price: mid },
                        topLineColor: '#26a69a',
                        topFillColor1: 'rgba(38,166,154,0.28)',
                        topFillColor2: 'rgba(38,166,154,0.05)',
                        bottomLineColor: '#ef5350',
                        bottomFillColor1: 'rgba(239,83,80,0.05)',
                        bottomFillColor2: 'rgba(239,83,80,0.28)',
                        lastValueVisible: true,
                    });
                    series.setData(transformed.map(c => ({ time: c.time, value: c.close })) as any);
                    break;
                }

                // ── OHLC bar series ──
                case 'bar':
                    series = chart.addSeries(BarSeries, {
                        upColor: '#26a69a',
                        downColor: '#ef5350',
                        openVisible: true,
                    });
                    series.setData(transformed.map(c => ({
                        time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                    })) as any);
                    break;

                case 'heikinashi':
                    series = chart.addSeries(CandlestickSeries, {
                        upColor: '#26a69a', downColor: '#ef5350',
                        borderUpColor: '#26a69a', borderDownColor: '#ef5350',
                        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
                    });
                    series.setData(transformed.map(c => ({
                        time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                    })) as any);
                    break;

                case 'renko':
                    series = chart.addSeries(CandlestickSeries, {
                        upColor: '#26a69a', downColor: '#ef5350',
                        borderUpColor: '#26a69a', borderDownColor: '#ef5350',
                        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
                    });
                    series.setData(transformed.map(c => ({
                        time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                    })) as any);
                    break;

                case 'kagi':
                    series = chart.addSeries(CandlestickSeries, {
                        upColor: '#26a69a', downColor: '#ef5350',
                        borderUpColor: '#26a69a', borderDownColor: '#ef5350',
                        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
                    });
                    series.setData(transformed.map(c => ({
                        time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                    })) as any);
                    break;

                // ── Default: candlestick ──
                default:
                    series = chart.addSeries(CandlestickSeries, {
                        upColor: '#26a69a', downColor: '#ef5350',
                        borderUpColor: '#26a69a', borderDownColor: '#ef5350',
                        wickUpColor: '#26a69a', wickDownColor: '#ef5350',
                    });
                    series.setData(transformed.map(c => ({
                        time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                    })) as any);
            }
        } catch (err) {
            console.error('[ChartContainer] renderMain error for type', ctx.chartType, err);
            // Fallback to plain candlestick
            try {
                series = chart.addSeries(CandlestickSeries, {
                    upColor: '#26a69a', downColor: '#ef5350',
                    borderUpColor: '#26a69a', borderDownColor: '#ef5350',
                    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
                });
                series.setData(raw.map(c => ({
                    time: c.time, open: c.open, high: c.high, low: c.low, close: c.close
                })) as any);
            } catch { }
        }

        if (series) {
            mainSeriesRef.current = series;
            chart.timeScale().fitContent();
        }

        // ── Overlay indicators ──
        const closes = raw.map(c => c.close);
        const newSeries: ISeriesApi<any>[] = [];
        for (const ind of mainIndicators) {
            try {
                switch (ind.type) {
                    case 'EMA': {
                        const v = ema(closes, Number(ind.params.period) || 20);
                        const s = chart.addSeries(LineSeries, { color: ind.color || '#f7c948', lineWidth: 1, lastValueVisible: true });
                        s.setData(raw.map((c, i) => ({ time: c.time, value: v[i] })).filter(d => !isNaN(d.value)) as any);
                        newSeries.push(s); break;
                    }
                    case 'SMA': {
                        const v = sma(closes, Number(ind.params.period) || 20);
                        const s = chart.addSeries(LineSeries, { color: ind.color || '#b083f0', lineWidth: 1, lastValueVisible: true });
                        s.setData(raw.map((c, i) => ({ time: c.time, value: v[i] })).filter(d => !isNaN(d.value)) as any);
                        newSeries.push(s); break;
                    }
                    case 'BB': {
                        const bb = bollingerBands(closes, Number(ind.params.period) || 20);
                        for (const [vals, col] of [[bb.upper, '#58a6ff'], [bb.middle, '#8b949e'], [bb.lower, '#58a6ff']] as [number[], string][]) {
                            const s = chart.addSeries(LineSeries, { color: col, lineWidth: 1, lastValueVisible: false });
                            s.setData(raw.map((c, i) => ({ time: c.time, value: vals[i] })).filter(d => !isNaN(d.value)) as any);
                            newSeries.push(s);
                        }
                        break;
                    }
                    case 'VWAP': {
                        const v = vwap(raw);
                        const s = chart.addSeries(LineSeries, { color: '#db6d28', lineWidth: 2, lastValueVisible: true });
                        s.setData(raw.map((c, i) => ({ time: c.time, value: v[i] })) as any);
                        newSeries.push(s); break;
                    }
                    case 'Supertrend': {
                        const st = supertrend(raw);
                        const upPts = raw.map((c, i) => st.direction[i] === 'up' ? { time: c.time, value: st.value[i] } : null).filter(Boolean);
                        const dnPts = raw.map((c, i) => st.direction[i] === 'down' ? { time: c.time, value: st.value[i] } : null).filter(Boolean);
                        const sUp = chart.addSeries(LineSeries, { color: '#26a69a', lineWidth: 2, lastValueVisible: false });
                        const sDn = chart.addSeries(LineSeries, { color: '#ef5350', lineWidth: 2, lastValueVisible: false });
                        sUp.setData(upPts as any); sDn.setData(dnPts as any);
                        newSeries.push(sUp, sDn); break;
                    }
                    case 'Ichimoku': {
                        const ich = ichimoku(raw);
                        const tenkanS = chart.addSeries(LineSeries, { color: '#e3b341', lineWidth: 1, lastValueVisible: false });
                        const kijunS = chart.addSeries(LineSeries, { color: '#58a6ff', lineWidth: 1, lastValueVisible: false });
                        tenkanS.setData(raw.map((c, i) => ({ time: c.time, value: ich.tenkan[i] })).filter(d => !isNaN(d.value)) as any);
                        kijunS.setData(raw.map((c, i) => ({ time: c.time, value: ich.kijun[i] })).filter(d => !isNaN(d.value)) as any);
                        newSeries.push(tenkanS, kijunS); break;
                    }
                }
            } catch (e) { console.warn('overlay indicator error', ind.type, e); }
        }
        mainIndicatorSeriesRef.current = newSeries;
    }, [ctx.chartType, mainIndicators]);

    useEffect(() => {
        if (candles.length > 0 && !ctx.replayMode) renderMain(candles);
    }, [candles, ctx.chartType, ctx.indicators, renderMain]);


    // ------ Sub-pane indicator charts ------
    // Use a ref-callback map to create charts when divs mount
    const renderSubPane = useCallback((indId: string, ind: typeof subIndicators[0], div: HTMLDivElement | null) => {
        // Cleanup old chart for this ind
        const old = subPaneChartRefs.current.get(indId);
        if (old) { try { old.remove(); } catch { } subPaneChartRefs.current.delete(indId); }
        if (!div) return;

        const chart = createChart(div, {
            ...CHART_THEME,
            height: SUB_PANE_HEIGHT,
            handleScroll: false,
            handleScale: false,
        });
        chart.applyOptions({
            timeScale: { visible: false },
            rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.05 } },
        });
        subPaneChartRefs.current.set(indId, chart);
        subPaneDivRefs.current.set(indId, div);

        const raw = candlesRef.current;
        if (raw.length === 0) return;
        const closes = raw.map(c => c.close);

        try {
            switch (ind.type) {
                case 'RSI': {
                    const period = Number(ind.params.period) || 14;
                    const vals = rsi(closes, period);
                    const s = chart.addSeries(LineSeries, { color: ind.color || '#8957e5', lineWidth: 2 });
                    s.setData(raw.map((c, i) => ({ time: c.time, value: vals[i] })).filter(d => !isNaN(d.value)) as any);
                    const ob = chart.addSeries(LineSeries, { color: '#ef535060', lineWidth: 1, lastValueVisible: false, crosshairMarkerVisible: false });
                    const os = chart.addSeries(LineSeries, { color: '#26a69a60', lineWidth: 1, lastValueVisible: false, crosshairMarkerVisible: false });
                    ob.setData(raw.map(c => ({ time: c.time, value: 70 })) as any);
                    os.setData(raw.map(c => ({ time: c.time, value: 30 })) as any);
                    break;
                }
                case 'MACD': {
                    const fast = Number(ind.params.fast) || 12;
                    const slow = Number(ind.params.slow) || 26;
                    const signal = Number(ind.params.signal) || 9;
                    const res = macd(closes, fast, slow, signal);
                    const macdS = chart.addSeries(LineSeries, { color: '#388bfd', lineWidth: 2 });
                    const sigS = chart.addSeries(LineSeries, { color: '#f7c948', lineWidth: 1, lastValueVisible: false });
                    macdS.setData(raw.map((c, i) => ({ time: c.time, value: res.macd[i] })).filter(d => !isNaN(d.value)) as any);
                    sigS.setData(raw.map((c, i) => ({ time: c.time, value: res.signal[i] })).filter(d => !isNaN(d.value)) as any);
                    const histS = chart.addSeries(AreaSeries, {
                        lineColor: '#58a6ff44', topColor: 'rgba(56,139,253,0.35)',
                        bottomColor: 'rgba(56,139,253,0.05)', lineWidth: 1, lastValueVisible: false,
                    });
                    histS.setData(raw.map((c, i) => ({ time: c.time, value: res.histogram[i] })).filter(d => !isNaN(d.value)) as any);
                    break;
                }
                case 'Stoch': {
                    const k = Number(ind.params.k) || 14;
                    const d = Number(ind.params.d) || 3;
                    const res = stochastic(raw, k, d);
                    const kS = chart.addSeries(LineSeries, { color: '#f7c948', lineWidth: 2 });
                    const dS = chart.addSeries(LineSeries, { color: '#8957e5', lineWidth: 1, lastValueVisible: false });
                    kS.setData(raw.map((c, i) => ({ time: c.time, value: res.k[i] })).filter(d => !isNaN(d.value)) as any);
                    dS.setData(raw.map((c, i) => ({ time: c.time, value: res.d[i] })).filter(d => !isNaN(d.value)) as any);
                    break;
                }
                case 'ATR': {
                    const period = Number(ind.params.period) || 14;
                    const vals = atr(raw, period);
                    const s = chart.addSeries(LineSeries, { color: '#db6d28', lineWidth: 2 });
                    s.setData(raw.map((c, i) => ({ time: c.time, value: vals[i] })).filter(d => !isNaN(d.value)) as any);
                    break;
                }
                case 'ADX': {
                    const period = Number(ind.params.period) || 14;
                    const vals = adx(raw, period);
                    const s = chart.addSeries(LineSeries, { color: '#39c5cf', lineWidth: 2 });
                    s.setData(raw.map((c, i) => ({ time: c.time, value: vals[i] })).filter(d => !isNaN(d.value)) as any);
                    const thr = chart.addSeries(LineSeries, { color: '#8b949e44', lineWidth: 1, lastValueVisible: false, crosshairMarkerVisible: false });
                    thr.setData(raw.map(c => ({ time: c.time, value: 25 })) as any);
                    break;
                }
            }
            chart.timeScale().fitContent();
        } catch (e) { console.warn('sub-pane error', ind.type, e); }
    }, []);

    // Clean up sub-pane charts on unmount
    useEffect(() => {
        return () => {
            subPaneChartRefs.current.forEach(c => { try { c.remove(); } catch { } });
            subPaneChartRefs.current.clear();
        };
    }, []);

    // ------ Log scale ------
    useEffect(() => {
        mainChartRef.current?.priceScale('right').applyOptions({
            mode: ctx.logScale ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal,
        });
    }, [ctx.logScale]);

    // ------ Cursor mode ------
    useEffect(() => {
        const chart = mainChartRef.current;
        if (!chart) return;
        switch (ctx.cursorMode) {
            case 'cross':
                // Full crosshair — both lines visible
                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { visible: true, labelVisible: true },
                        horzLine: { visible: true, labelVisible: true },
                    },
                });
                break;
            case 'dot':
                // Hide crosshair lines — DrawingCanvas shows the dot
                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { visible: false, labelVisible: false },
                        horzLine: { visible: false, labelVisible: true },
                    },
                });
                break;
            case 'arrow':
                // Hide crosshair entirely — standard arrow pointer
                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { visible: false, labelVisible: false },
                        horzLine: { visible: false, labelVisible: false },
                    },
                });
                break;
            case 'demo':
                // Hide chart crosshair — DrawingCanvas renders laser circle
                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { visible: false, labelVisible: false },
                        horzLine: { visible: false, labelVisible: false },
                    },
                });
                break;
            case 'eraser':
                // Keep crosshair for precision, DrawingCanvas handles erase click
                chart.applyOptions({
                    crosshair: {
                        mode: CrosshairMode.Normal,
                        vertLine: { visible: true, labelVisible: false },
                        horzLine: { visible: true, labelVisible: false },
                    },
                });
                break;
        }
    }, [ctx.cursorMode]);

    // ------ Replay ------
    useEffect(() => {
        if (!ctx.replayMode || !ctx.replayPlaying || candles.length === 0) {
            if (replayTimerRef.current) clearInterval(replayTimerRef.current);
            return;
        }
        const delay = Math.max(40, 1000 / ctx.replaySpeed);
        let currentBar = ctx.replayBar;
        replayTimerRef.current = setInterval(() => {
            const next = currentBar + 1;
            if (next >= candles.length) {
                ctx.setReplayPlaying(false);
                clearInterval(replayTimerRef.current!);
                return;
            }
            currentBar = next;
            ctx.setReplayBar(next);
            if (mainSeriesRef.current) {
                const slice = transformChartData(candles.slice(0, next + 1), ctx.chartType);
                try { mainSeriesRef.current.setData(slice as any); } catch { }
                mainChartRef.current?.timeScale().scrollToRealTime();
            }
        }, delay);
        return () => { if (replayTimerRef.current) clearInterval(replayTimerRef.current); };
    }, [ctx.replayMode, ctx.replayPlaying, ctx.replaySpeed, candles, ctx.chartType]);

    // Enter replay mode
    useEffect(() => {
        if (!mainSeriesRef.current || candles.length === 0) return;
        if (ctx.replayMode) {
            const start = Math.floor(candles.length * 0.65);
            ctx.setReplayBar(start);
            const slice = transformChartData(candles.slice(0, start + 1), ctx.chartType);
            try { mainSeriesRef.current.setData(slice as any); } catch { }
            mainChartRef.current?.timeScale().fitContent();
        } else {
            renderMain(candles);
        }
    }, [ctx.replayMode]);

    // Replay seek
    useEffect(() => {
        if (!ctx.replayMode || !mainSeriesRef.current || candles.length === 0) return;
        const slice = transformChartData(candles.slice(0, ctx.replayBar + 1), ctx.chartType);
        try { mainSeriesRef.current.setData(slice as any); } catch { }
    }, [ctx.replayBar]);

    const priceChange = ohlcvInfo?.open !== undefined
        ? ((ohlcvInfo.close - ohlcvInfo.open) / ohlcvInfo.open * 100)
        : null;

    return (
        <div className={styles.container} ref={wrapperRef}>
            {/* OHLCV info bar */}
            <div className={styles.infoBar}>
                <span className={styles.symbolLabel}>{symbol}</span>
                {ohlcvInfo ? (
                    <>
                        {ohlcvInfo.open !== undefined && (
                            <span>O <span className={styles.val}>{ohlcvInfo.open.toFixed(2)}</span></span>
                        )}
                        {ohlcvInfo.high !== undefined && (
                            <span>H <span className={styles.val}>{ohlcvInfo.high.toFixed(2)}</span></span>
                        )}
                        {ohlcvInfo.low !== undefined && (
                            <span>L <span className={styles.val}>{ohlcvInfo.low.toFixed(2)}</span></span>
                        )}
                        <span>C <span className={`${styles.val} ${priceChange != null && priceChange >= 0 ? styles.up : styles.down}`}>
                            {ohlcvInfo.close.toFixed(2)}</span>
                        </span>
                        {priceChange != null && (
                            <span className={`${styles.change} ${priceChange >= 0 ? styles.up : styles.down}`}>
                                {priceChange >= 0 ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)}%
                            </span>
                        )}
                    </>
                ) : (
                    <span className={styles.hint}>Move cursor over chart</span>
                )}
                {wsStatus === 'live' && <span className={styles.liveDot} title="Live data">●</span>}
            </div>

            {/* Main chart area */}
            <div ref={mainChartDivRef} className={styles.chartArea} />

            {/* Sub-pane indicator charts (rendered via ref callbacks) */}
            {subIndicators.map((ind) => (
                <div key={ind.id} className={styles.subPane}>
                    <div className={styles.subPaneLabel}>
                        {ind.type}
                        {Object.keys(ind.params).length > 0 && ` (${Object.values(ind.params).join(', ')})`}
                    </div>
                    <div
                        ref={(el) => renderSubPane(ind.id, ind, el)}
                        className={styles.subPaneChart}
                    />
                </div>
            ))}

            {/* Drawing overlay — on top of main chart only */}
            <DrawingCanvas chartRef={mainChartRef} />

            {/* Loading */}
            {isLoading && (
                <div className={styles.loadingOverlay}>
                    <div className={styles.spinner} />
                    <span>Loading {symbol}...</span>
                </div>
            )}

            {/* Replay controls */}
            {ctx.replayMode && <ReplayControls totalBars={candles.length} />}
        </div>
    );
}
