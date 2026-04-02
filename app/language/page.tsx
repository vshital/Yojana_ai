"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  {
    code: "en",
    name: "English",
    native: "English",
    flag: "🇬🇧",
    desc: "Continue in English",
  },
  {
    code: "hi",
    name: "Hindi",
    native: "हिंदी",
    flag: "🇮🇳",
    desc: "हिंदी में जारी रखें",
  },
  {
    code: "mr",
    name: "Marathi",
    native: "मराठी",
    flag: "🏛️",
    desc: "मराठीत सुरू ठेवा",
  },
];

export default function LanguagePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const selectLanguage = (lang: string) => {
    setSelected(lang);
    localStorage.setItem("lang", lang);
    setTimeout(() => router.replace("/home"), 300);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 mb-6">
            <span className="text-2xl">🇮🇳</span>
            <span className="text-white font-bold text-xl tracking-tight">
              Yojana AI
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Choose Your Language
          </h1>
          <p className="text-white/40 text-sm">
            अपनी भाषा चुनें • तुमची भाषा निवडा
          </p>
        </div>

        {/* Language cards */}
        <div className="flex flex-col gap-3">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`group relative w-full flex items-center gap-4 p-5 rounded-2xl border transition-all duration-200 text-left
                ${
                  selected === lang.code
                    ? "bg-orange-500 border-orange-400 scale-[0.98]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-orange-500/40 hover:scale-[1.01]"
                }`}
            >
              <span className="text-3xl">{lang.flag}</span>
              <div className="flex-1">
                <div
                  className={`font-bold text-lg ${
                    selected === lang.code ? "text-white" : "text-white"
                  }`}
                >
                  {lang.native}
                </div>
                <div
                  className={`text-sm ${
                    selected === lang.code
                      ? "text-orange-100"
                      : "text-white/40"
                  }`}
                >
                  {lang.desc}
                </div>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                ${
                  selected === lang.code
                    ? "border-white bg-white"
                    : "border-white/20 group-hover:border-orange-400"
                }`}
              >
                {selected === lang.code && (
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-white/20 text-xs mt-8">
          More languages coming soon • और भाषाएं जल्द आ रही हैं
        </p>
      </div>
    </div>
  );
}