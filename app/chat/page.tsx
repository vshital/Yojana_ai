"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

const QUICK_QUESTIONS = {
  en: [
    "What documents do I need for PM-Kisan?",
    "How to apply for Ayushman Bharat?",
    "Am I eligible for MUDRA loan?",
    "Scholarship schemes for students",
  ],
  hi: [
    "PM-Kisan के लिए कौन से दस्तावेज चाहिए?",
    "आयुष्मान भारत के लिए कैसे आवेदन करें?",
    "क्या मैं MUDRA लोन के लिए पात्र हूं?",
    "छात्रों के लिए छात्रवृत्ति योजनाएं",
  ],
  mr: [
    "PM-Kisan साठी कोणते कागदपत्रे लागतात?",
    "आयुष्मान भारतसाठी अर्ज कसा करावा?",
    "MUDRA कर्जासाठी मी पात्र आहे का?",
    "विद्यार्थ्यांसाठी शिष्यवृत्ती योजना",
  ],
};

type Message = {
  role: "user" | "bot";
  text: string;
  time: string;
};

export default function Chat() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const l = localStorage.getItem("lang") || "en";
    setLang(l);
    const data = localStorage.getItem("user");
    if (data) setUser(JSON.parse(data));

    // Welcome message
    const welcome = {
      role: "bot" as const,
      text: l === "hi"
        ? "नमस्ते! मैं सहायक हूं। आपकी सरकारी योजनाओं के बारे में किसी भी सवाल में मदद कर सकता हूं। 🙏"
        : l === "mr"
          ? "नमस्कार! मी सहायक आहे. सरकारी योजनांबद्दल कोणत्याही प्रश्नात मदत करू शकतो. 🙏"
          : "Namaste! I'm Sahayak. I can help you discover and apply for any Indian government scheme. Ask me anything! 🙏",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setChat([welcome]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const t = translations[lang];

  const sendMessage = async (text?: string) => {
    const msg = text || message;
    if (!msg.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      text: msg,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChat((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, user, lang }),
      });

      const data = await res.json();

      const botMsg: Message = {
        role: "bot",
        text: data.reply || "Sorry, I couldn't understand. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChat((prev) => [...prev, botMsg]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Connection error. Please check your internet and try again.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }

    setLoading(false);
    inputRef.current?.focus();
  };

  const quickQs = QUICK_QUESTIONS[lang as keyof typeof QUICK_QUESTIONS] || QUICK_QUESTIONS.en;

  return (
    <div className="h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <button
          onClick={() => router.back()}
          className="text-white/40 hover:text-white transition-colors"
        >
          ←
        </button>
        <button
          onClick={() => router.push("/home")}
          className="text-white/40 hover:text-white transition-colors text-sm"
        >
          🏠 Home
        </button>
        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-orange-500/20">
          🤖
        </div>
        <div className="flex-1">
          <div className="font-bold text-white text-sm">{t.chat_title}</div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-xs">Online</span>
          </div>
        </div>
        {user && (
          <div className="text-right">
            <div className="text-white/30 text-xs">Profile loaded</div>
            <div className="text-white/60 text-xs font-medium">{user.name}</div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {c.role === "bot" && (
              <div className="w-7 h-7 bg-orange-500/20 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-sm">
                🤖
              </div>
            )}
            <div className={`max-w-[80%] ${c.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                  ${c.role === "user"
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-white/8 border border-white/8 text-white/90 rounded-bl-sm"
                  }`}
              >
                {c.text}
              </div>
              <span className="text-white/20 text-xs px-1">{c.time}</span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 bg-orange-500/20 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-sm">
              🤖
            </div>
            <div className="bg-white/8 border border-white/8 rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-white/30 text-xs ml-1">{t.thinking}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions — only show when chat is empty (just welcome msg) */}
      {chat.length <= 1 && (
        <div className="px-4 pb-3">
          <p className="text-white/20 text-xs mb-2 px-1">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 bg-white/5 border border-white/10 hover:border-orange-500/30 text-white/60 hover:text-white text-xs px-3 py-2 rounded-xl transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-6 pt-2 border-t border-white/5">
        <div className="flex gap-3 items-center bg-white/5 border border-white/10 focus-within:border-orange-500/40 rounded-2xl px-4 py-3 transition-all">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t.chat_placeholder}
            className="flex-1 bg-transparent text-white placeholder-white/20 text-sm focus:outline-none"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!message.trim() || loading}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all
              ${message.trim() && !loading
                ? "bg-orange-500 hover:bg-orange-400 text-white hover:scale-105"
                : "bg-white/5 text-white/20"
              }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <span className="text-sm">↑</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}