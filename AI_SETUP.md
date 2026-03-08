# AI Models Setup Guide

The finmark AI Assistant supports multiple AI models. You need at least one API key to use the feature.

## Supported Models

### 1. Groq (Recommended - FREE)
- **Model**: Llama 3.3 70B
- **Speed**: Fastest (up to 800 tokens/sec)
- **Cost**: FREE tier available
- **Best for**: Real-time chat, quick responses

**Setup:**
1. Go to https://console.groq.com/keys
2. Sign up for a free account
3. Create an API key
4. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_your_key_here
   ```

### 2. OpenAI GPT-4
- **Model**: GPT-4 Turbo
- **Speed**: Medium
- **Cost**: Pay per use (~$0.01 per 1K tokens)
- **Best for**: Most capable, complex analysis

**Setup:**
1. Go to https://platform.openai.com/api-keys
2. Create an account and add billing
3. Create an API key
4. Add to `.env.local`:
   ```
   OPENAI_API_KEY=sk-your_key_here
   ```

### 3. Google Gemini
- **Model**: Gemini 1.5 Pro
- **Speed**: Fast
- **Cost**: FREE tier available
- **Best for**: Balanced performance

**Setup:**
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Create an API key
4. Add to `.env.local`:
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your_key_here
   ```

## Quick Start

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add at least one API key to `.env.local`

3. Restart your development server:
   ```bash
   npm run dev
   ```

4. Go to AI Insights page and start chatting!

## Model Selection

Users can switch between models using the settings icon in the AI chat interface. The selected model will be used for all subsequent messages.

## Troubleshooting

### "API key not configured" error
- Make sure you've added the API key to `.env.local` (not `.env.example`)
- Restart your development server after adding keys
- Check that the key is valid and not expired

### Slow responses
- Try switching to Groq for faster responses
- Check your internet connection
- Verify you haven't hit rate limits

### Rate limits
- Groq: 30 requests/minute (free tier)
- OpenAI: Depends on your tier
- Gemini: 60 requests/minute (free tier)

## Cost Optimization

For development and testing, we recommend using **Groq** (free and fastest).

For production:
- Use Groq for most queries (free)
- Fall back to OpenAI for complex analysis
- Use Gemini as a middle ground

## Security

- Never commit `.env.local` to git (it's in `.gitignore`)
- Keep your API keys secret
- Rotate keys regularly
- Use environment variables in production
