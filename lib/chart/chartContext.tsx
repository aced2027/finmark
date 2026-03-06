'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import type { IndicatorConfig } from '@/lib/chart/indicators';
import type { ChartType } from '@/lib/chart/chartTypes';

export type DrawingToolType =
    | 'none' | 'trendline' | 'ray' | 'extended' | 'horizontal' | 'vertical'
    | 'channel' | 'regression' | 'fibonacci' | 'fibextension' | 'fibfan' | 'fibtimezone'
    | 'text' | 'arrow' | 'brush' | 'highlighter' | 'callout' | 'emoji'
    | 'rectangle' | 'triangle' | 'headshoulders' | 'abcd' | 'flag';

export type CursorMode = 'cross' | 'dot' | 'arrow' | 'demo' | 'eraser';

export type LayoutType = '1' | '2h' | '2v' | '4' | '8';

export interface ChartState {
    symbol: string;
    interval: string;
    chartType: ChartType;
    activeTool: DrawingToolType;
    cursorMode: CursorMode;
    indicators: IndicatorConfig[];
    layout: LayoutType;
    logScale: boolean;
    autoScale: boolean;
    magnetMode: boolean;
    replayMode: boolean;
    replayBar: number;
    replayPlaying: boolean;
    replaySpeed: number;
}

interface ChartContextValue extends ChartState {
    setSymbol: (s: string) => void;
    setInterval: (i: string) => void;
    setChartType: (t: ChartType) => void;
    setActiveTool: (t: DrawingToolType) => void;
    setCursorMode: (m: CursorMode) => void;
    addIndicator: (ind: IndicatorConfig) => void;
    removeIndicator: (id: string) => void;
    toggleIndicator: (id: string) => void;
    setLayout: (l: LayoutType) => void;
    setLogScale: (v: boolean) => void;
    setAutoScale: (v: boolean) => void;
    setMagnetMode: (v: boolean) => void;
    setReplayMode: (v: boolean) => void;
    setReplayBar: (v: number) => void;
    setReplayPlaying: (v: boolean) => void;
    setReplaySpeed: (v: number) => void;
}

const ChartContext = createContext<ChartContextValue | null>(null);

export function ChartProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ChartState>({
        symbol: 'AAPL',
        interval: '1D',
        chartType: 'candlestick',
        activeTool: 'none',
        cursorMode: 'cross',
        indicators: [],
        layout: '1',
        logScale: false,
        autoScale: true,
        magnetMode: false,
        replayMode: false,
        replayBar: 0,
        replayPlaying: false,
        replaySpeed: 1,
    });

    const set = <K extends keyof ChartState>(key: K, val: ChartState[K]) =>
        setState((prev) => ({ ...prev, [key]: val }));

    return (
        <ChartContext.Provider value={{
            ...state,
            setSymbol: (s) => set('symbol', s),
            setInterval: (i) => set('interval', i),
            setChartType: (t) => set('chartType', t),
            setActiveTool: (t) => set('activeTool', t),
            setCursorMode: (m) => set('cursorMode', m),
            addIndicator: (ind) => setState((prev) => ({ ...prev, indicators: [...prev.indicators, ind] })),
            removeIndicator: (id) => setState((prev) => ({ ...prev, indicators: prev.indicators.filter((i) => i.id !== id) })),
            toggleIndicator: (id) => setState((prev) => ({
                ...prev,
                indicators: prev.indicators.map((i) => i.id === id ? { ...i, visible: !i.visible } : i)
            })),
            setLayout: (l) => set('layout', l),
            setLogScale: (v) => set('logScale', v),
            setAutoScale: (v) => set('autoScale', v),
            setMagnetMode: (v) => set('magnetMode', v),
            setReplayMode: (v) => set('replayMode', v),
            setReplayBar: (v) => set('replayBar', v),
            setReplayPlaying: (v) => set('replayPlaying', v),
            setReplaySpeed: (v) => set('replaySpeed', v),
        }}>
            {children}
        </ChartContext.Provider>
    );
}

export function useChart() {
    const ctx = useContext(ChartContext);
    if (!ctx) throw new Error('useChart must be used within ChartProvider');
    return ctx;
}
