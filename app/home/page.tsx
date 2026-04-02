"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

const schemes_preview = [
  { name: "PM-Kisan", emoji: "🌾", color: "from-green-500/20 to-green-600/5" },
  { name: "Ayushman Bharat", emoji: "🏥", color: "from-blue-500/20 to-blue-600/5" },
  { name: "MUDRA Loan", emoji: "💼", color: "from-purple-500/20 to-purple-600/5" },
  { name: "Sukanya Samriddhi", emoji: "👧", color: "from-pink-500/20 to-pink-600/5" },
  { name: "PM Scholarship", emoji: "🎓", color: "from-yellow-500/20 to-yellow-600/5" },
  { name: "PM Awas Yojana", emoji: "🏠", color: "from-orange-500/20 to-orange-600/5" },
];

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const l = localStorage.getItem("lang") || "en";
    setLang(l);
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl">🇮🇳</span>
          <span className="font-bold text-lg tracking-tight">Yojana AI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/language")}
            className="text-white/40 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            {lang === "en" ? "EN" : lang === "hi" ? "HI" : "MR"} ↕
          </button>
          <button
            onClick={() => router.push("/check")}
            className="bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
          >
            {t.button}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-500/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        {/* Ashoka chakra subtle watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.02] pointer-events-none">
          <div className="w-full h-full rounded-full border-8 border-white" />
        </div>

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-orange-300 text-sm font-medium">
              AI-Powered • Free • Trusted
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
            <span className="text-white">{t.title.split(" ").slice(0, -2).join(" ")}</span>
            <br />
            <span className="bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-300 bg-clip-text text-transparent">
              {t.title.split(" ").slice(-2).join(" ")}
            </span>
          </h1>

          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/check")}
              className="group w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all duration-200 hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/25"
            >
              {t.button}
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="w-full sm:w-auto bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-200 hover:border-orange-500/30"
            >
              🤖 Ask Sahayak AI
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6">
            {[
              { label: t.hero_stat1, value: "1000+" },
              { label: t.hero_stat2, value: "22" },
              { label: t.hero_stat3, value: "∞" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-white/30 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scheme pills floating */}
        <div className="relative z-10 mt-16 w-full max-w-2xl">
          <p className="text-center text-white/20 text-xs mb-4 uppercase tracking-widest">
            Popular Schemes
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {schemes_preview.map((s, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${s.color} border border-white/10 rounded-full px-4 py-2 text-sm text-white/70 flex items-center gap-2`}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 relative">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">{t.how_title}</h2>
          <p className="text-white/30 text-center mb-14 text-sm">Simple. Fast. Trusted.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", title: t.how1_title, desc: t.how1_desc, icon: "📝" },
              { num: "02", title: t.how2_title, desc: t.how2_desc, icon: "🤖" },
              { num: "03", title: t.how3_title, desc: t.how3_desc, icon: "✅" },
            ].map((step, i) => (
              <div
                key={i}
                className="relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:bg-white/6 hover:border-orange-500/20 transition-all"
              >
                <div className="text-5xl font-black text-white/5 absolute top-4 right-4">
                  {step.num}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="px-6 py-20">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-orange-500/10 to-blue-600/10 border border-orange-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Start Finding Your Schemes
          </h2>
          <p className="text-white/40 mb-8">
            Takes less than 2 minutes. No login required.
          </p>
          <button
            onClick={() => router.push("/check")}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold text-lg px-8 py-4 rounded-2xl transition-all hover:scale-105"
          >
            {t.button} →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <p className="text-white/20 text-sm">
          Yojana AI — Made for Bharat • Not affiliated with Government of India
        </p>
      </footer>
    </div>
  );
}