# Quick Start - AI Integration

## ✅ What's Been Done

1. **Installed AI Packages**:
   - `ai` - Vercel AI SDK
   - `@ai-sdk/openai` - OpenAI integration
   - `@ai-sdk/google` - Google Gemini integration
   - `groq-sdk` - Groq integration

2. **Created API Route**: `/app/api/chat/route.ts`
   - Handles streaming responses
   - Supports 3 AI models (Groq, OpenAI, Gemini)
   - Includes financial analysis system prompt

3. **Updated Frontend**: `/app/ai-insights/page.tsx`
   - ChatGPT-like interface
   - Real-time streaming responses
   - Model selector (switch between AI models)
   - Error handling

## 🚀 Get Started in 3 Steps

### Step 1: Get a FREE Groq API Key (Recommended)

1. Visit: https://console.groq.com/keys
2. Sign up (takes 30 seconds)
3. Click "Create API Key"
4. Copy the key (starts with `gsk_`)

### Step 2: Add API Key to .env.local

Open `.env.local` and add your key:

```bash
GROQ_API_KEY=gsk_your_actual_key_here
```

### Step 3: Restart Server

```bash
npm run dev
```

## 🎉 That's It!

Go to **AI Insights** page and start chatting with the AI!

## 💡 Try These Prompts

- "Analyze RELIANCE stock for swing trading"
- "What's the market sentiment today?"
- "Should I buy INFY at current levels?"
- "Give me top 3 stocks to watch this week"
- "Explain RSI indicator in simple terms"
- "What are the key support levels for Nifty 50?"

## 🔄 Want to Use Other Models?

### OpenAI (GPT-4)
```bash
OPENAI_API_KEY=sk-your_key_here
```
Get key: https://platform.openai.com/api-keys

### Google Gemini
```bash
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
```
Get key: https://makersuite.google.com/app/apikey

## 📊 Model Comparison

| Model | Speed | Cost | Best For |
|-------|-------|------|----------|
| **Groq (Llama 3.3)** | ⚡ Fastest | 🆓 FREE | Real-time chat |
| **OpenAI (GPT-4)** | 🐢 Medium | 💰 Paid | Complex analysis |
| **Gemini (1.5 Pro)** | ⚡ Fast | 🆓 FREE | Balanced |

## 🎯 Features

✅ Real-time streaming responses
✅ Multiple AI model support
✅ ChatGPT-like interface
✅ Financial analysis system prompt
✅ Conversation history
✅ Model switching on-the-fly
✅ Error handling
✅ Prominent disclaimers

## 🛡️ Important Notes

- The AI provides **educational information only**
- **NOT financial advice** - always DYOR
- Responses are for learning purposes
- Trading involves substantial risk
- Consult certified financial advisors for investment decisions

## 🐛 Troubleshooting

**"API key not configured" error?**
- Check `.env.local` file exists
- Verify key is correct
- Restart dev server

**Slow responses?**
- Switch to Groq (fastest)
- Check internet connection

**No response?**
- Check browser console for errors
- Verify API key is valid
- Check rate limits

## 📚 Learn More

See `AI_SETUP.md` for detailed setup instructions and advanced configuration.
