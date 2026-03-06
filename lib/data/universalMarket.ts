import { fetchBinanceCandles, subscribeBinanceCandle, OHLCV } from './binance';

export async function fetchUniversalCandles(
    symbol: string,
    interval: string,
    limit = 500
): Promise<OHLCV[]> {
    if (symbol.endsWith('USDT') || symbol.endsWith('BUSD') || symbol.endsWith('USDC') || symbol.endsWith('BTC')) {
        return fetchBinanceCandles(symbol, interval, limit);
    }

    // fallback: Yahoo Finance Proxy
    const res = await fetch(`/api/market?symbol=${symbol}&interval=${interval}`);
    if (!res.ok) throw new Error(`Market fetch error: ${res.status} for ${symbol}`);
    const data: OHLCV[] = await res.json();
    return data;
}

const mockSubscribers = new Map<string, { intervalTimer: any; handlers: Set<(candle: OHLCV) => void> }>();

export function subscribeUniversalCandle(
    symbol: string,
    interval: string,
    onCandle: (candle: OHLCV) => void
): () => void {
    if (symbol.endsWith('USDT') || symbol.endsWith('BUSD') || symbol.endsWith('USDC') || symbol.endsWith('BTC')) {
        return subscribeBinanceCandle(symbol, interval, onCandle);
    }

    // fallback: polling Yahoo Finance every 10 seconds to get the latest tick
    const key = `${symbol}-${interval}`;
    let isFetching = false;

    if (!mockSubscribers.has(key)) {
        const timer = setInterval(async () => {
            if (isFetching) return;
            isFetching = true;
            try {
                const res = await fetch(`/api/market?symbol=${symbol}&interval=${interval}`);
                if (res.ok) {
                    const data: OHLCV[] = await res.json();
                    if (data.length > 0) {
                        const last = data[data.length - 1];
                        const sub = mockSubscribers.get(key);
                        if (sub) {
                            sub.handlers.forEach(h => h(last));
                        }
                    }
                }
            } catch { } // ignore
            finally { isFetching = false; }
        }, 10000); // 10s poll

        mockSubscribers.set(key, { intervalTimer: timer, handlers: new Set([onCandle]) });
    } else {
        mockSubscribers.get(key)!.handlers.add(onCandle);
    }

    return () => {
        const sub = mockSubscribers.get(key);
        if (!sub) return;
        sub.handlers.delete(onCandle);
        if (sub.handlers.size === 0) {
            clearInterval(sub.intervalTimer);
            mockSubscribers.delete(key);
        }
    };
}
