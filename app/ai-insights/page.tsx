"use client";

import { useState, useRef, useEffect } from "react";
import { AlertTriangle, Send, Sparkles, User, Bot, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SAMPLE_PROMPTS = [
  "Analyze RELIANCE stock for swing trading",
  "What's the market sentiment today?",
  "Should I buy INFY at current levels?",
  "Give me top 3 stocks to watch this week",
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI trading assistant. I can help you with market analysis, stock suggestions, and trading insights. Remember, I provide educational information only - not financial advice. Always do your own research before investing.\n\nWhat would you like to know about the markets today?",
    timestamp: new Date(),
  },
];

const AI_MODELS = [
  { id: 'groq', name: 'Groq (Llama 3.3)', description: 'Fastest, Free' },
  { id: 'openai', name: 'OpenAI (GPT-4)', description: 'Most Capable' },
  { id: 'gemini', name: 'Google Gemini', description: 'Balanced' },
];

export default function AIInsightsPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedModel, setSelectedModel] = useState('groq');
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = errorText;
        
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorText;
        } catch (e) {
          // Use text as-is if not JSON
        }

        // Provide helpful error messages
        if (errorMessage.includes('API key not configured') || errorMessage.includes('Invalid API Key')) {
          throw new Error(`❌ API Key Error: Please add your ${selectedModel.toUpperCase()} API key to .env.local file.\n\nQuick fix:\n1. Open .env.local\n2. Add: ${selectedModel.toUpperCase()}_API_KEY=your_key_here\n3. Restart server: npm run dev\n\nGet FREE Groq key: https://console.groq.com/keys`);
        }
        
        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: '',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantContent += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? { ...msg, content: assistantContent }
                : msg
            )
          );
        }
      }

      setIsTyping(false);
    } catch (error: any) {
      console.error('Chat error:', error);
      setError(error.message || 'Failed to get response');
      
      // Remove the empty assistant message if error occurred
      setMessages((prev) => prev.filter(m => m.content !== ''));
      setIsTyping(false);
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] bg-[#0f1117]">
      {/* Header with Model Selector - Fixed at top */}
      <div className="flex-shrink-0 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h1 className="text-base font-bold text-white">finmark AI</h1>
                <p className="text-xs text-slate-500">Trading Assistant</p>
              </div>
            </div>

            {/* Model Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowModelSelector(!showModelSelector)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1d29] border border-white/10 hover:border-violet-500/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  {selectedModel === 'groq' && (
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">G</span>
                    </div>
                  )}
                  {selectedModel === 'openai' && (
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">AI</span>
                    </div>
                  )}
                  {selectedModel === 'gemini' && (
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      <span className="text-[8px] font-bold text-white">G</span>
                    </div>
                  )}
                  <div className="text-left">
                    <p className="text-xs font-medium text-white leading-none">
                      {AI_MODELS.find(m => m.id === selectedModel)?.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 leading-none mt-0.5">
                      {AI_MODELS.find(m => m.id === selectedModel)?.description}
                    </p>
                  </div>
                </div>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showModelSelector && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setShowModelSelector(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-[#1a1d29] border border-white/10 rounded-lg shadow-xl z-20">
                    <div className="p-2">
                      <p className="text-[10px] text-slate-500 uppercase font-semibold px-3 py-2">Select AI Model</p>
                      {AI_MODELS.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setShowModelSelector(false);
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-lg transition-all flex items-center gap-3",
                            selectedModel === model.id
                              ? "bg-violet-500/10 border border-violet-500/20"
                              : "hover:bg-white/[0.05] border border-transparent"
                          )}
                        >
                          {model.id === 'groq' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">G</span>
                            </div>
                          )}
                          {model.id === 'openai' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">AI</span>
                            </div>
                          )}
                          {model.id === 'gemini' && (
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-bold text-white">G</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <div className={cn(
                              "font-medium text-sm",
                              selectedModel === model.id ? "text-violet-400" : "text-white"
                            )}>
                              {model.name}
                            </div>
                            <div className="text-xs text-slate-500">{model.description}</div>
                          </div>
                          {selectedModel === model.id && (
                            <div className="w-2 h-2 rounded-full bg-violet-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-semibold text-red-400 mb-1">DISCLAIMER - Not Financial Advice</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                AI-generated suggestions are for educational purposes only. We are NOT financial advisors. 
                Always do your own research (DYOR) before investing. Trading involves substantial risk of loss.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto px-6 py-6">
          {messages.length === 1 && (
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-2 mb-6">
                {SAMPLE_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-left px-4 py-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all text-sm text-slate-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-red-400 mb-2">Error</p>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-violet-400" />
                  </div>
                )}

                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-3",
                    message.role === "user"
                      ? "bg-violet-500/10 border border-violet-500/20 text-white"
                      : "bg-[#1a1d29] border border-white/5 text-slate-200"
                  )}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  {message.content && isMounted && (
                    <div className="text-[10px] text-slate-500 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-emerald-400" />
                  </div>
                )}
              </motion.div>
            ))}

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-violet-400" />
                </div>
                <div className="bg-[#1a1d29] border border-white/5 rounded-lg px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="flex-shrink-0 border-t border-white/5 bg-[#0f1117]">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <form onSubmit={handleSend} className="relative">
            <div className="flex items-end gap-2 bg-[#1a1d29] border border-white/10 rounded-xl p-2 focus-within:border-violet-500/50 transition-colors">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(e);
                  }
                }}
                placeholder="Ask about stocks, market analysis, trading strategies..."
                className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-sm text-white placeholder-slate-500 resize-none max-h-32"
                rows={1}
                style={{ minHeight: "40px" }}
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-lg bg-violet-500 hover:bg-violet-600 disabled:bg-violet-500/50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              AI can make mistakes. Verify important information and always DYOR.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
