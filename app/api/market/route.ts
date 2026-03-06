import { NextResponse } from 'next/server';

const YAHOO_INTERVALS: Record<string, string> = {
    '1m': '1m',
    '3m': '2m',
    '5m': '5m',
    '15m': '15m',
    '30m': '30m',
    '1H': '60m',
    '4H': '60m',
    '1D': '1d',
    '1W': '1wk',
    '1M': '1mo',
};

const YAHOO_RANGES: Record<string, string> = {
    '1m': '1d',
    '5m': '5d',
    '15m': '5d',
    '30m': '1mo',
    '60m': '1mo',
    '1d': '1y',
    '1wk': '5y',
    '1mo': '10y',
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol') || 'AAPL';
    const intervalParam = searchParams.get('interval') || '1D';

    const yInt = YAHOO_INTERVALS[intervalParam] || '1d';
    const yRange = YAHOO_RANGES[yInt] || '1y';

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${yInt}&range=${yRange}`;

    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`Yahoo fetch failed: ${res.status}`);

        const data = await res.json();
        const result = data.chart.result[0];

        if (!result || !result.timestamp) {
            return NextResponse.json({ error: 'No data' }, { status: 404 });
        }

        const timestamps = result.timestamp;
        const quote = result.indicators.quote[0];

        const ohlcv = timestamps.map((t: number, i: number) => ({
            time: t,
            open: quote.open[i] || quote.close[i],
            high: quote.high[i] || quote.close[i],
            low: quote.low[i] || quote.close[i],
            close: quote.close[i],
            volume: quote.volume[i] || 0,
        })).filter((c: any) => c.close !== null && c.close !== undefined);

        return NextResponse.json(ohlcv);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
