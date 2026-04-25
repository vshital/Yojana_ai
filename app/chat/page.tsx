"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Message = { role: "user" | "bot"; text: string; time: string };

const QUICK_QUESTIONS = [
  "Which scheme should I apply for first?",
  "What documents do I need for PM-Kisan?",
  "How to apply for Ayushman Bharat?",
  "Am I eligible for MUDRA loan?",
];

export default function Chat() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [lang, setLang] = useState("en");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const l = localStorage.getItem("lang") || "en";
    setLang(l);
    const data = localStorage.getItem("user");
    if (data) setUser(JSON.parse(data));

    setChat([{
      role: "bot",
      text: "Namaste! I am Sahayak, your personal government scheme advisor. I can help you discover eligible schemes, understand documents required, and guide you through the application process. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const sendMessage = async (text?: string) => {
    const msg = text || message;
    if (!msg.trim() || loading) return;

    const userMsg: Message = {
      role: "user", text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChat(prev => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const matchedSchemes = JSON.parse(localStorage.getItem("matchedSchemes") || "[]");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, user, lang, matchedSchemes }),
      });
      const data = await res.json();
      setChat(prev => [...prev, {
        role: "bot",
        text: data.reply || "I apologize, I could not process that request. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setChat(prev => [...prev, {
        role: "bot",
        text: "Connection error. Please check your internet connection and try again.",
        time: "",
      }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white flex-shrink-0">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => router.push("/home")} className="text-blue-200 hover:text-white transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>

          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>

          <div className="flex-1">
            <div className="font-bold text-sm" style={{ fontFamily: "'Noto Serif', serif" }}>Sahayak AI</div>
            <div className="flex items-center gap-1.5 text-xs text-blue-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              Online · Government Scheme Advisor
            </div>
          </div>

          {user && (
            <div className="text-right hidden sm:block">
              <div className="text-xs text-blue-300">Profile loaded</div>
              <div className="text-sm font-medium">{user.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6 space-y-4">
          {chat.map((c, i) => (
            <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
              {c.role === "bot" && (
                <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
              )}
              <div className="max-w-[78%]">
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  c.role === "user"
                    ? "bg-[#1B3A6B] text-white rounded-br-sm"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                  {c.text}
                </div>
                {c.time && <div className="text-gray-400 text-xs mt-1 px-1">{c.time}</div>}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center mr-3 flex-shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5 items-center">
                  {[0, 150, 300].map(delay => (
                    <div key={delay} className="w-2 h-2 bg-[#1B3A6B] rounded-full animate-bounce" style={{ animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick questions */}
      {chat.length <= 1 && (
        <div className="flex-shrink-0 px-6 pb-3 max-w-3xl mx-auto w-full">
          <p className="text-gray-400 text-xs mb-2 font-medium">Suggested questions</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 bg-white border border-gray-200 hover:border-[#1B3A6B] hover:text-[#1B3A6B] text-gray-600 text-xs px-3 py-2 rounded-lg transition-all whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about any government scheme..."
            className="flex-1 border border-gray-200 focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 rounded-xl px-4 py-3 text-gray-800 text-sm outline-none transition-all"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!message.trim() || loading}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              message.trim() && !loading
                ? "bg-[#D97706] hover:bg-amber-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            )}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}