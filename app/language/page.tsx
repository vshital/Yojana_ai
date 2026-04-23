"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "en", native: "English", flag: "🇬🇧", desc: "Continue in English", gtCode: "" },
  { code: "hi", native: "हिंदी", flag: "🇮🇳", desc: "हिंदी में जारी रखें", gtCode: "hi" },
  { code: "mr", native: "मराठी", flag: "🏛️", desc: "मराठीत सुरू ठेवा", gtCode: "mr" },
  { code: "ta", native: "தமிழ்", flag: "🌟", desc: "தமிழில் தொடரவும்", gtCode: "ta" },
  { code: "te", native: "తెలుగు", flag: "🌟", desc: "తెలుగులో కొనసాగించు", gtCode: "te" },
  { code: "bn", native: "বাংলা", flag: "🌟", desc: "বাংলায় চালিয়ে যান", gtCode: "bn" },
  { code: "gu", native: "ગુજરાતી", flag: "🌟", desc: "ગુજરાતીમાં ચાલુ રાખો", gtCode: "gu" },
  { code: "pa", native: "ਪੰਜਾਬੀ", flag: "🌟", desc: "ਪੰਜਾਬੀ ਵਿੱਚ ਜਾਰੀ ਰੱਖੋ", gtCode: "pa" },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const selectLanguage = (lang: typeof languages[0]) => {
    setSelected(lang.code);
    localStorage.setItem("lang", lang.code);
    localStorage.setItem("gtLang", lang.gtCode);

    // Trigger Google Translate
    if (lang.gtCode) {
      setTimeout(() => {
        const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (select) {
          select.value = lang.gtCode;
          select.dispatchEvent(new Event('change'));
        }
      }, 500);
    }

    setTimeout(() => router.replace("/home"), 300);
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center justify-center p-6">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3 mb-5 shadow-sm">
          <span className="text-2xl">🇮🇳</span>
          <span className="text-[#1a3a6b] font-bold text-xl">Yojana AI</span>
        </div>
        <h1 className="text-2xl font-bold text-[#1a3a6b] mb-1">
          Choose Your Language
        </h1>
        <p className="text-gray-400 text-sm">
          अपनी भाषा चुनें • तुमची भाषा निवडा
        </p>
      </div>

      {/* Language grid */}
      <div className="w-full max-w-sm grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => selectLanguage(lang)}
            className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left
              ${selected === lang.code
                ? "border-[#1a3a6b] bg-[#eef2ff]"
                : "border-gray-200 bg-white hover:border-[#1a3a6b]/40 hover:shadow-sm"
              }`}
          >
            <span className="text-2xl">{lang.flag}</span>
            <div>
              <div className="font-bold text-[#1a3a6b] text-sm">{lang.native}</div>
              <div className="text-gray-400 text-xs">{lang.code.toUpperCase()}</div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-gray-300 text-xs mt-6">
        More languages available via Google Translate
      </p>
    </div>
  );
}