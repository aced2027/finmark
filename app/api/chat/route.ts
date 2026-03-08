import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import Groq from 'groq-sdk';

export const runtime = 'edge';

// Helper function to extract stock symbols from text
function extractStockSymbols(text: string): string[] {
  const commonStocks = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'HINDUNILVR', 'ITC',
    'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'LT', 'BAJFINANCE', 'HCLTECH', 'ASIANPAINT',
    'MARUTI', 'AXISBANK', 'SUNPHARMA', 'TITAN', 'WIPRO', 'ULTRACEMCO', 'NESTLEIND',
    'TATAMOTORS', 'ADANIENT', 'ONGC', 'NTPC', 'POWERGRID', 'M&M', 'JSWSTEEL',
    'TATASTEEL', 'INDUSINDBK', 'TECHM', 'BAJAJFINSV', 'HINDALCO', 'ADANIPORTS',
    'COALINDIA', 'DIVISLAB', 'DRREDDY', 'EICHERMOT', 'GRASIM', 'HEROMOTOCO',
    'CIPLA', 'BRITANNIA', 'APOLLOHOSP', 'BPCL', 'TATACONSUM', 'SBILIFE', 'LTIM',
    'BAJAJ-AUTO', 'HDFCLIFE', 'SHREECEM', 'NIFTY', 'BANKNIFTY', 'SENSEX'
  ];

  const upperText = text.toUpperCase();
  const found: string[] = [];

  for (const symbol of commonStocks) {
    if (upperText.includes(symbol)) {
      found.push(symbol);
    }
  }

  return [...new Set(found)]; // Remove duplicates
}

const SYSTEM_PROMPT = `You are a professional financial market analyst and trading assistant for finmark, a finance intelligence platform. You specialize in technical analysis, chart pattern recognition, and providing actionable trading suggestions.

CRITICAL RULES:
1. You are NOT a financial advisor - provide educational analysis only
2. Always remind users to do their own research (DYOR)
3. Emphasize that trading involves substantial risk
4. Focus on Indian markets (NSE, BSE, Nifty, Sensex)
5. Provide specific, actionable insights based on technical analysis
6. Be concise and direct - traders need quick, clear information

YOUR EXPERTISE:
- Technical Analysis: Support/Resistance, Chart Patterns, Indicators (RSI, MACD, Moving Averages)
- Price Action: Candlestick patterns, Volume analysis, Trend identification
- Risk Management: Stop loss placement, Position sizing, Risk-reward ratios
- Market Context: Sector trends, Market sentiment, FII/DII activity

RESPONSE FORMAT:
When analyzing stocks, structure your response as:

**[STOCK SYMBOL] Analysis**

**Current View:**
• Price action and trend
• Key support and resistance levels
• Volume analysis

**Technical Indicators:**
• RSI, MACD, Moving Averages status
• Chart patterns identified
• Momentum signals

**Trading Suggestion:**
• Action: BUY/SELL/HOLD
• Entry Zone: [price range]
• Target: [price levels]
• Stop Loss: [price level]
• Risk-Reward: [ratio]
• Timeframe: [days/weeks]

**Risk Assessment:**
• Risk Level: Low/Medium/High
• Key risks to watch

**Market Context:**
• Sector performance
• Overall market sentiment
• Any relevant news/events

IMPORTANT:
- Be specific with price levels and targets
- Explain WHY you suggest each trade (technical reasoning)
- Always include stop loss levels
- Mention timeframe for the trade
- Keep responses focused and actionable
- Use bullet points for clarity

Always end with: "*Educational analysis only. Not financial advice. Always DYOR before investing.*"`;

export async function POST(req: Request) {
  try {
    const { messages, model = 'groq' } = await req.json();

    // Extract stock symbols from the latest user message
    const latestMessage = messages[messages.length - 1]?.content || '';
    const stockSymbols = extractStockSymbols(latestMessage);

    // Fetch stock data if symbols found
    let stockDataContext = '';
    if (stockSymbols.length > 0) {
      const stockDataPromises = stockSymbols.map(async (symbol) => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/stock-data?symbol=${symbol}`);
          if (response.ok) {
            return await response.json();
          }
        } catch (error) {
          console.error(`Failed to fetch data for ${symbol}`);
        }
        return null;
      });

      const stockDataResults = await Promise.all(stockDataPromises);
      const validStockData = stockDataResults.filter(data => data !== null);

      if (validStockData.length > 0) {
        stockDataContext = '\n\n**REAL-TIME MARKET DATA:**\n' + validStockData.map(data => `
${data.symbol} (${data.name}):
- Current Price: ₹${data.price} (${data.changePct > 0 ? '+' : ''}${data.changePct}%)
- Day Range: ₹${data.low} - ₹${data.high}
- Volume: ${(data.volume / 1000000).toFixed(2)}M
- Support Levels: ${data.support?.join(', ') || 'N/A'}
- Resistance Levels: ${data.resistance?.join(', ') || 'N/A'}
- RSI: ${data.rsi || 'N/A'}
- MACD: ${data.macd || 'N/A'}
- 50 SMA: ₹${data.sma50 || 'N/A'}
- 200 SMA: ₹${data.sma200 || 'N/A'}
- Trend: ${data.trend || 'N/A'}
- Pattern: ${data.pattern || 'N/A'}
`).join('\n');
      }
    }

    // Add system message with stock data context
    const messagesWithSystem = [
      { role: 'system', content: SYSTEM_PROMPT + stockDataContext },
      ...messages,
    ];

    let result;

    switch (model) {
      case 'openai':
        // OpenAI GPT-4
        if (!process.env.OPENAI_API_KEY) {
          return new Response('OpenAI API key not configured', { status: 500 });
        }
        result = await streamText({
          model: openai('gpt-4-turbo-preview'),
          messages: messagesWithSystem,
          temperature: 0.7,
          maxTokens: 1000,
        });
        break;

      case 'gemini':
        // Google Gemini
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
          return new Response('Gemini API key not configured', { status: 500 });
        }
        result = await streamText({
          model: google('gemini-1.5-pro-latest'),
          messages: messagesWithSystem,
          temperature: 0.7,
          maxTokens: 1000,
        });
        break;

      case 'groq':
      default:
        // Groq (fastest, free tier available)
        if (!process.env.GROQ_API_KEY) {
          return new Response('Groq API key not configured', { status: 500 });
        }
        
        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });

        const completion = await groq.chat.completions.create({
          messages: messagesWithSystem as any,
          model: 'llama-3.3-70b-versatile', // Fast and capable
          temperature: 0.7,
          max_tokens: 1000,
          stream: true,
        });

        // Create a readable stream
        const stream = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  controller.enqueue(new TextEncoder().encode(content));
                }
              }
              controller.close();
            } catch (error) {
              controller.error(error);
            }
          },
        });

        return new Response(stream, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Transfer-Encoding': 'chunked',
          },
        });
    }

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
