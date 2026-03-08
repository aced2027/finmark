import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Mock real-time stock data (in production, integrate with real APIs like NSE, Yahoo Finance, etc.)
const STOCK_DATA: Record<string, any> = {
  RELIANCE: {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    price: 2847.30,
    change: -35.45,
    changePct: -1.23,
    open: 2882.75,
    high: 2895.20,
    low: 2835.60,
    volume: 8234567,
    marketCap: 1925000,
    pe: 28.5,
    support: [2800, 2750, 2700],
    resistance: [2900, 2950, 3000],
    rsi: 42,
    macd: 'Bearish',
    sma50: 2920,
    sma200: 2780,
    trend: 'Downtrend',
    pattern: 'Descending Triangle',
  },
  INFY: {
    symbol: 'INFY',
    name: 'Infosys',
    price: 1654.80,
    change: 18.90,
    changePct: 1.15,
    open: 1635.90,
    high: 1668.50,
    low: 1632.40,
    volume: 5678901,
    marketCap: 685000,
    pe: 24.3,
    support: [1620, 1600, 1580],
    resistance: [1680, 1720, 1750],
    rsi: 58,
    macd: 'Bullish',
    sma50: 1640,
    sma200: 1590,
    trend: 'Uptrend',
    pattern: 'Ascending Triangle',
  },
  TATAMOTORS: {
    symbol: 'TATAMOTORS',
    name: 'Tata Motors',
    price: 987.65,
    change: 15.35,
    changePct: 1.58,
    open: 972.30,
    high: 995.80,
    low: 968.50,
    volume: 12345678,
    marketCap: 356000,
    pe: 18.7,
    support: [960, 940, 920],
    resistance: [1000, 1050, 1100],
    rsi: 65,
    macd: 'Bullish',
    sma50: 945,
    sma200: 890,
    trend: 'Strong Uptrend',
    pattern: 'Cup and Handle',
  },
  HDFCBANK: {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    price: 1612.45,
    change: -10.55,
    changePct: -0.65,
    open: 1623.00,
    high: 1628.90,
    low: 1605.20,
    volume: 4567890,
    marketCap: 1223000,
    pe: 19.8,
    support: [1600, 1580, 1550],
    resistance: [1650, 1680, 1720],
    rsi: 48,
    macd: 'Neutral',
    sma50: 1635,
    sma200: 1590,
    trend: 'Sideways',
    pattern: 'Consolidation',
  },
  ITC: {
    symbol: 'ITC',
    name: 'ITC Limited',
    price: 478.90,
    change: 5.60,
    changePct: 1.18,
    open: 473.30,
    high: 481.50,
    low: 472.80,
    volume: 9876543,
    marketCap: 595000,
    pe: 26.4,
    support: [470, 460, 450],
    resistance: [490, 505, 520],
    rsi: 62,
    macd: 'Bullish',
    sma50: 468,
    sma200: 445,
    trend: 'Uptrend',
    pattern: 'Breakout',
  },
  NIFTY: {
    symbol: 'NIFTY',
    name: 'Nifty 50',
    price: 22485.50,
    change: -125.30,
    changePct: -0.55,
    open: 22610.80,
    high: 22645.20,
    low: 22420.60,
    volume: 234567890,
    support: [22350, 22200, 22000],
    resistance: [22600, 22750, 23000],
    rsi: 45,
    macd: 'Bearish',
    sma50: 22580,
    sma200: 22120,
    trend: 'Consolidation',
    pattern: 'Range Bound',
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 });
    }

    const stockData = STOCK_DATA[symbol];

    if (!stockData) {
      return NextResponse.json({ error: 'Stock not found' }, { status: 404 });
    }

    return NextResponse.json(stockData);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
