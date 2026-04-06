"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

const QUICK_QUESTIONS = {
  en: ["What documents do I need for PM-Kisan?", "How to apply for Ayushman Bharat?", "Am I eligible for MUDRA loan?", "Scholarship schemes for students"],
  hi: ["PM-Kisan के लिए कौन से दस्तावेज चाहिए?", "आयुष्मान भारत के लिए कैसे आवेदन करें?", "क्या मैं MUDRA लोन के लिए पात्र हूं?", "छात्रों के लिए छात्रवृत्ति योजनाएं"],
  mr: ["PM-Kisan साठी कोणते कागदपत्रे लागतात?", "आयुष्मान भारतसाठी अर्ज कसा करावा?", "MUDRA कर्जासाठी मी पात्र आहे का?", "विद्यार्थ्यांसाठी शिष्यवृत्ती योजना"],
};

type Message = { role: "user" | "bot"; text: string; time: string };

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
    setChat([{
      role: "bot",
      text: l === "hi"
        ? "नमस्ते! मैं सहायक हूं। सरकारी योजनाओं के बारे में कुछ भी पूछें। 🙏"
        : l === "mr"
        ? "नमस्कार! मी सहायक आहे. सरकारी योजनांबद्दल काहीही विचारा. 🙏"
        : "Namaste! I'm Sahayak. Ask me anything about Indian government schemes. 🙏",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  const t = translations[lang];

  const sendMessage = async (text?: string) => {
    const msg = text || message;
    if (!msg.trim() || loading) return;
    const userMsg: Message = { role: "user", text: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
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
      setChat((prev) => [...prev, { role: "bot", text: data.reply || "Sorry, try again.", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch {
      setChat((prev) => [...prev, { role: "bot", text: "Connection error. Please try again.", time: "" }]);
    }
    setLoading(false);
    inputRef.current?.focus();
  };

  const quickQs = QUICK_QUESTIONS[lang as keyof typeof QUICK_QUESTIONS] || QUICK_QUESTIONS.en;

  return (
    <div className="h-screen bg-[#f5f7fa] flex flex-col">

      {/* Govt strip */}
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4">
        🇮🇳 Government of India Initiative
      </div>

      {/* Header */}
      <div className="bg-white border-b-4 border-[#f97316] shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.push("/home")} className="text-[#1a3a6b] text-sm hover:underline">
            🏠 Home
          </button>
          <span className="text-gray-300">›</span>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-9 h-9 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
              <span className="text-lg">🤖</span>
            </div>
            <div>
              <div className="font-bold text-[#1a3a6b] text-sm">{t.chat_title}</div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-600 text-xs">Online</span>
              </div>
            </div>
          </div>
          {user && (
            <div className="text-right">
              <div className="text-gray-400 text-xs">Profile</div>
              <div className="text-[#1a3a6b] text-xs font-semibold">{user.name}</div>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 max-w-3xl mx-auto w-full space-y-3">
        {chat.map((c, i) => (
          <div key={i} className={`flex ${c.role === "user" ? "justify-end" : "justify-start"}`}>
            {c.role === "bot" && (
              <div className="w-8 h-8 bg-[#1a3a6b] rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-sm">
                🤖
              </div>
            )}
            <div className="max-w-[80%]">
              <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
                ${c.role === "user"
                  ? "bg-[#1a3a6b] text-white rounded-br-sm"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"
                }`}>
                {c.text}
              </div>
              {c.time && <div className="text-gray-400 text-xs mt-1 px-1">{c.time}</div>}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-[#1a3a6b] rounded-lg flex items-center justify-center mr-2 flex-shrink-0 mt-1 text-sm">🤖</div>
            <div className="bg-white border border-gray-200 rounded-xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-[#1a3a6b] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#1a3a6b] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#1a3a6b] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                <span className="text-gray-400 text-xs ml-1">{t.thinking}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick questions */}
      {chat.length <= 1 && (
        <div className="px-4 pb-2 max-w-3xl mx-auto w-full">
          <p className="text-gray-400 text-xs mb-2">Quick questions:</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {quickQs.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="flex-shrink-0 bg-white border border-gray-200 hover:border-[#1a3a6b] text-gray-600 hover:text-[#1a3a6b] text-xs px-3 py-2 rounded-lg transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-3xl mx-auto flex gap-3">
          <input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={t.chat_placeholder}
            className="flex-1 border-2 border-gray-200 focus:border-[#1a3a6b] rounded-lg px-4 py-3 text-gray-800 text-sm outline-none transition-all"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!message.trim() || loading}
            className={`px-5 py-3 rounded-lg font-semibold text-sm transition-all
              ${message.trim() && !loading
                ? "bg-[#f97316] hover:bg-orange-600 text-white"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
              }`}
          >
            {loading ? "..." : t.send}
          </button>
        </div>
      </div>
    </div>
  );
}