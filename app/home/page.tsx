"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "en");
  }, []);

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-[#f5f7fa] font-sans">

      {/* Top government strip */}
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🇮🇳</span>
          <span className="opacity-80">Government of India Initiative</span>
        </div>
        <div className="flex items-center gap-3 opacity-70">
          <span>Skip to main content</span>
          <span>|</span>
          <span>Screen Reader</span>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="bg-white border-b-4 border-[#f97316] shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#1a3a6b] rounded-lg flex items-center justify-center">
              <span className="text-2xl">🇮🇳</span>
            </div>
            <div>
              <div className="font-bold text-[#1a3a6b] text-lg leading-tight">
                Yojana AI
              </div>
              <div className="text-xs text-gray-500">
                सरकारी योजना खोज पोर्टल
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/language")}
              className="text-[#1a3a6b] border border-[#1a3a6b] text-sm px-3 py-1.5 rounded hover:bg-[#1a3a6b] hover:text-white transition-all"
            >
              {lang === "en" ? "EN | हि | म" : lang === "hi" ? "हि | EN | म" : "म | EN | हि"}
            </button>
            <button
              onClick={() => router.push("/check")}
              className="bg-[#f97316] hover:bg-orange-600 text-white font-semibold text-sm px-5 py-2 rounded transition-all"
            >
              {t.button}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero section */}
      <section className="bg-gradient-to-b from-[#1a3a6b] to-[#1e4d8c] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">

          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-6 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Free • No Login Required • Official Scheme Data</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold mb-4 leading-tight">
            {t.title}
          </h1>
          <p className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            {t.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/check")}
              className="bg-[#f97316] hover:bg-orange-500 text-white font-bold text-lg px-8 py-4 rounded-lg transition-all shadow-lg"
            >
              {t.button} →
            </button>
            <button
              onClick={() => router.push("/chat")}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg px-8 py-4 rounded-lg transition-all"
            >
              🤖 {lang === "hi" ? "सहायक से पूछें" : lang === "mr" ? "सहायकला विचारा" : "Ask Sahayak AI"}
            </button>
          </div>

          {/* Stats row */}
          <div className="mt-12 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {[
              { num: "30+", label: lang === "hi" ? "योजनाएं" : lang === "mr" ? "योजना" : "Schemes" },
              { num: "3", label: lang === "hi" ? "भाषाएं" : lang === "mr" ? "भाषा" : "Languages" },
              { num: "100%", label: lang === "hi" ? "मुफ्त" : lang === "mr" ? "मोफत" : "Free" },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-300">{s.num}</div>
                <div className="text-blue-200 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tricolor divider */}
      <div className="flex h-1.5">
        <div className="flex-1 bg-[#f97316]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#16a34a]" />
      </div>

      {/* How it works */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-[#1a3a6b] mb-2">
              {t.how_title}
            </h2>
            <p className="text-gray-500 text-sm">
              {lang === "hi" ? "सरल • तेज़ • विश्वसनीय" : lang === "mr" ? "सोपे • जलद • विश्वासार्ह" : "Simple • Fast • Trusted"}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { num: "01", icon: "📝", title: t.how1_title, desc: t.how1_desc, color: "border-orange-400" },
              { num: "02", icon: "🤖", title: t.how2_title, desc: t.how2_desc, color: "border-blue-500" },
              { num: "03", icon: "✅", title: t.how3_title, desc: t.how3_desc, color: "border-green-500" },
            ].map((step, i) => (
              <div key={i} className={`bg-gray-50 border-t-4 ${step.color} rounded-xl p-6 text-center`}>
                <div className="text-4xl mb-3">{step.icon}</div>
                <div className="text-[#1a3a6b] font-bold text-lg mb-2">{step.title}</div>
                <div className="text-gray-500 text-sm leading-relaxed">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scheme categories */}
      <section className="py-14 px-4 bg-[#f5f7fa]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a3a6b] text-center mb-8">
            {lang === "hi" ? "योजनाओं की श्रेणियां" : lang === "mr" ? "योजनांचे प्रकार" : "Scheme Categories"}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { emoji: "🌾", label: lang === "hi" ? "किसान" : "Farmers", count: "3 schemes" },
              { emoji: "🎓", label: lang === "hi" ? "छात्र" : "Students", count: "3 schemes" },
              { emoji: "💼", label: lang === "hi" ? "व्यवसाय" : "Business", count: "5 schemes" },
              { emoji: "👩", label: lang === "hi" ? "महिला" : "Women", count: "4 schemes" },
              { emoji: "🏥", label: lang === "hi" ? "स्वास्थ्य" : "Health", count: "3 schemes" },
              { emoji: "🏠", label: lang === "hi" ? "आवास" : "Housing", count: "2 schemes" },
              { emoji: "👷", label: lang === "hi" ? "मजदूर" : "Workers", count: "4 schemes" },
              { emoji: "🎒", label: "SC/ST/OBC", count: "3 schemes" },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => router.push("/check")}
                className="bg-white border border-gray-200 hover:border-[#f97316] hover:shadow-md rounded-xl p-4 text-center transition-all group"
              >
                <div className="text-3xl mb-2">{cat.emoji}</div>
                <div className="font-semibold text-[#1a3a6b] text-sm group-hover:text-orange-500">{cat.label}</div>
                <div className="text-gray-400 text-xs mt-1">{cat.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-[#1a3a6b] text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-3">
            {lang === "hi" ? "अभी शुरू करें — 2 मिनट में जानें" : lang === "mr" ? "आत्ताच सुरू करा" : "Start Now — Know in 2 Minutes"}
          </h2>
          <p className="text-blue-200 mb-6 text-sm">
            {lang === "hi" ? "कोई लॉगिन नहीं • कोई शुल्क नहीं • पूरी तरह सुरक्षित" : "No login • No fees • Completely safe"}
          </p>
          <button
            onClick={() => router.push("/check")}
            className="bg-[#f97316] hover:bg-orange-500 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all shadow-xl"
          >
            {t.button} →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f2347] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">🇮🇳</span>
            <span className="font-bold text-lg">Yojana AI</span>
          </div>
          <p className="text-blue-300 text-sm mb-2">
            Helping Indian citizens discover government schemes they deserve
          </p>
          <p className="text-blue-400 text-xs">
            Not affiliated with Government of India • Scheme data sourced from official portals • Always verify at myscheme.gov.in
          </p>
        </div>
      </footer>

    </div>
  );
}