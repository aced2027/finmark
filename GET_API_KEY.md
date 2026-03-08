# 🔑 How to Get Your FREE API Key (2 Minutes)

## ⚡ Quick Fix - Get Groq API Key (Recommended)

### Step 1: Sign Up (30 seconds)
1. Go to: **https://console.groq.com/keys**
2. Click "Sign Up" or "Sign In with Google"
3. Complete the quick registration

### Step 2: Create API Key (30 seconds)
1. Once logged in, you'll see "API Keys" page
2. Click "Create API Key" button
3. Give it a name (e.g., "finmark")
4. Click "Submit"
5. **COPY the key** (starts with `gsk_...`)

### Step 3: Add to .env.local (1 minute)
1. Open `.env.local` file in your project
2. Find this line:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```
3. Replace with your actual key:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Save the file

### Step 4: Restart Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Done!

Go to AI Insights page and start chatting!

---

## 🎯 Why Groq?

- ✅ **100% FREE** - No credit card required
- ✅ **Super Fast** - Up to 800 tokens/second
- ✅ **Easy Setup** - Takes 2 minutes
- ✅ **Generous Limits** - 30 requests/minute free tier
- ✅ **Powerful** - Uses Llama 3.3 70B model

---

## 🔐 Keep Your Key Safe

- ✅ Never commit `.env.local` to git (already in .gitignore)
- ✅ Don't share your API key publicly
- ✅ Regenerate if accidentally exposed

---

## 🆘 Need Help?

**Error: "Invalid API Key"**
- Make sure you copied the entire key (starts with `gsk_`)
- Check for extra spaces before/after the key
- Verify the key is on the correct line in `.env.local`
- Restart your dev server after adding the key

**Still not working?**
1. Check console for detailed error messages
2. Verify you're on the Groq free tier (no payment needed)
3. Try creating a new API key
4. Make sure `.env.local` is in the root directory (same level as package.json)

---

## 🚀 Alternative: Use Other Models

### OpenAI (GPT-4) - Paid
1. Go to: https://platform.openai.com/api-keys
2. Add billing information
3. Create API key
4. Add to `.env.local`: `OPENAI_API_KEY=sk-...`

### Google Gemini - FREE
1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Create API key
4. Add to `.env.local`: `GOOGLE_GENERATIVE_AI_API_KEY=...`

---

## 📊 Current Status

Your `.env.local` currently has:
```
GROQ_API_KEY=your_groq_api_key_here  ❌ (placeholder - needs real key)
```

After adding your key, it should look like:
```
GROQ_API_KEY=gsk_abc123xyz...  ✅ (real key)
```
