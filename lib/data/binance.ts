// Binance REST + WebSocket data feed

export interface OHLCV {
    time: number; // Unix timestamp (seconds)
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

const BINANCE_REST = 'https://api.binance.com/api/v3';
const BINANCE_WS_BASE = 'wss://stream.binance.com:9443/ws';

export const BINANCE_INTERVALS: Record<string, string> = {
    '1m': '1m', '3m': '3m', '5m': '5m', '15m': '15m', '30m': '30m',
    '1H': '1h', '4H': '4h', '1D': '1d', '1W': '1w', '1M': '1M',
};

export async function fetchBinanceCandles(
    symbol: string,
    interval: string,
    limit = 500
): Promise<OHLCV[]> {
    const binanceInterval = BINANCE_INTERVALS[interval] || interval.toLowerCase();
    const url = `${BINANCE_REST}/klines?symbol=${symbol.toUpperCase()}&interval=${binanceInterval}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Binance fetch error: ${res.status} for ${symbol}`);
    const data: any[][] = await res.json();
    return data.map((k) => ({
        time: Math.floor(k[0] / 1000),
        open: parseFloat(k[1]),
        high: parseFloat(k[2]),
        low: parseFloat(k[3]),
        close: parseFloat(k[4]),
        volume: parseFloat(k[5]),
    }));
}

export async function fetchBinanceSymbols(): Promise<{ symbol: string; baseAsset: string; quoteAsset: string }[]> {
    const res = await fetch(`${BINANCE_REST}/exchangeInfo`);
    const data = await res.json();
    return data.symbols
        .filter((s: any) => s.status === 'TRADING')
        .map((s: any) => ({
            symbol: s.symbol,
            baseAsset: s.baseAsset,
            quoteAsset: s.quoteAsset,
        }));
}

export async function fetchBinanceTicker(symbol: string): Promise<{ price: string; priceChangePercent: string }> {
    const res = await fetch(`${BINANCE_REST}/ticker/24hr?symbol=${symbol.toUpperCase()}`);
    return res.json();
}

// Per-stream WebSocket management
const streamConnections = new Map<string, {
    ws: WebSocket;
    handlers: Set<(candle: OHLCV) => void>;
    reconnectTimer?: NodeJS.Timeout;
}>();

export function subscribeBinanceCandle(
    symbol: string,
    interval: string,
    onCandle: (candle: OHLCV) => void
): () => void {
    const binanceInterval = BINANCE_INTERVALS[interval] || interval.toLowerCase();
    const stream = `${symbol.toLowerCase()}@kline_${binanceInterval}`;

    const connect = () => {
        const ws = new WebSocket(`${BINANCE_WS_BASE}/${stream}`);

        ws.onopen = () => {
            const conn = streamConnections.get(stream);
            if (conn) conn.ws = ws;
        };

        ws.onmessage = (e) => {
            try {
                const msg = JSON.parse(e.data);
                if (msg.e === 'kline') {
                    const k = msg.k;
                    const candle: OHLCV = {
                        time: Math.floor(k.t / 1000),
                        open: parseFloat(k.o),
                        high: parseFloat(k.h),
                        low: parseFloat(k.l),
                        close: parseFloat(k.c),
                        volume: parseFloat(k.v),
                    };
                    const conn = streamConnections.get(stream);
                    conn?.handlers.forEach(h => h(candle));
                }
            } catch { }
        };

        ws.onerror = () => { };
        ws.onclose = () => {
            const conn = streamConnections.get(stream);
            if (conn && conn.handlers.size > 0) {
                // Reconnect with backoff
                conn.reconnectTimer = setTimeout(() => {
                    const newWs = connect();
                    if (conn) conn.ws = newWs;
                }, 2000);
            }
        };

        return ws;
    };

    if (!streamConnections.has(stream)) {
        const ws = connect();
        streamConnections.set(stream, { ws, handlers: new Set([onCandle]) });
    } else {
        streamConnections.get(stream)!.handlers.add(onCandle);
    }

    return () => {
        const conn = streamConnections.get(stream);
        if (!conn) return;
        conn.handlers.delete(onCandle);
        if (conn.handlers.size === 0) {
            if (conn.reconnectTimer) clearTimeout(conn.reconnectTimer);
            conn.ws.close();
            streamConnections.delete(stream);
        }
    };
}
