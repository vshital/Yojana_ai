"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", native: "English", label: "English", gtCode: "" },
  { code: "hi", native: "हिंदी", label: "Hindi", gtCode: "hi" },
  { code: "mr", native: "मराठी", label: "Marathi", gtCode: "mr" },
  { code: "ta", native: "தமிழ்", label: "Tamil", gtCode: "ta" },
  { code: "te", native: "తెలుగు", label: "Telugu", gtCode: "te" },
  { code: "bn", native: "বাংলা", label: "Bengali", gtCode: "bn" },
  { code: "gu", native: "ગુજરાતી", label: "Gujarati", gtCode: "gu" },
  { code: "pa", native: "ਪੰਜਾਬੀ", label: "Punjabi", gtCode: "pa" },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const selectLanguage = (lang: typeof languages[0]) => {
    setSelected(lang.code);
    localStorage.setItem("lang", lang.code);
    localStorage.setItem("gtLang", lang.gtCode);

    if (lang.gtCode) {
      setTimeout(() => {
        const select = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (select) {
          select.value = lang.gtCode;
          select.dispatchEvent(new Event("change"));
        }
      }, 500);
    }

    setTimeout(() => router.replace("/home"), 300);
  };

  return (
    // notranslate — this page is NEVER translated by Google
    <div className="notranslate min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Top strip */}
      <div className="bg-[#1B3A6B] text-white text-xs py-1.5 px-6 text-center opacity-80">
        Government of India — Welfare Navigation Portal
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#1B3A6B] mb-5 shadow-lg">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
            Yojana AI
          </h1>
          <p className="text-gray-500 text-sm">Select your preferred language</p>
          <p className="text-gray-400 text-xs mt-1">अपनी भाषा चुनें · तुमची भाषा निवडा · உங்கள் மொழியை தேர்ந்தெடுக்கவும்</p>
        </div>

        {/* Language grid — each always shows in its own script */}
        <div className="w-full max-w-sm">
          <div className="grid grid-cols-2 gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang)}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left group ${
                  selected === lang.code
                    ? "border-[#1B3A6B] bg-[#EEF2FF]"
                    : "border-gray-200 bg-white hover:border-[#1B3A6B]/40 hover:shadow-sm"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm transition-all ${
                  selected === lang.code
                    ? "bg-[#1B3A6B] text-white"
                    : "bg-gray-100 text-gray-500 group-hover:bg-[#EEF2FF] group-hover:text-[#1B3A6B]"
                }`}>
                  {lang.code.toUpperCase()}
                </div>
                <div>
                  {/* Native script — always correct, never translated */}
                  <div className="font-bold text-gray-800 text-sm">{lang.native}</div>
                  <div className="text-gray-400 text-xs">{lang.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-gray-300 text-xs mt-8 text-center">
          Powered by Google Translate · More languages available
        </p>
      </div>

      {/* Tricolor */}
      <div className="flex h-1">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white border-y border-gray-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>
    </div>
  );
}