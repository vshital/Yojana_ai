"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Top strip */}
      <div className="bg-[#1B3A6B] text-white text-xs py-1.5 px-6 flex items-center justify-between">
        <span className="tracking-wide opacity-80">Government of India — Welfare Navigation Portal</span>
        <div className="flex items-center gap-4 opacity-70">
          <span>Toll Free: 1800-XXX-XXXX</span>
          <span>|</span>
          <button onClick={() => router.push("/language")} className="hover:opacity-100 transition-opacity">
            Language / भाषा
          </button>
        </div>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md bg-white" : "bg-white"} border-b border-gray-100`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-[#1B3A6B] text-lg tracking-tight" style={{ fontFamily: "'Noto Serif', serif" }}>
                Yojana AI
              </div>
              <div className="text-xs text-gray-400 -mt-0.5 tracking-wider">WELFARE NAVIGATOR</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600 font-medium">
            <button onClick={() => router.push("/home")} className="hover:text-[#1B3A6B] transition-colors">Home</button>
            <button onClick={() => router.push("/check")} className="hover:text-[#1B3A6B] transition-colors">Find Benefits</button>
            <button onClick={() => router.push("/chat")} className="hover:text-[#1B3A6B] transition-colors">AI Assistant</button>
          </div>

          <button
            onClick={() => router.push("/check")}
            className="bg-[#D97706] hover:bg-amber-600 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow-md"
          >
            Check Eligibility
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A6B] via-[#1e4080] to-[#1B3A6B]">
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px"
          }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-white/20 bg-white/10 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-sm font-medium tracking-wide">Free Access · No Registration Required</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-6" style={{ fontFamily: "'Noto Serif', serif" }}>
              Discover Every
              <span className="block text-amber-400">Government Benefit</span>
              You Deserve
            </h1>

            <p className="text-blue-100 text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-light">
              India has 700+ welfare schemes. Most citizens miss out because the system is complex. Our AI finds every benefit you qualify for — in under 2 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/check")}
                className="bg-[#D97706] hover:bg-amber-500 text-white font-bold text-base px-8 py-4 rounded-lg transition-all shadow-lg hover:shadow-amber-500/25 hover:scale-105"
              >
                Check My Eligibility
              </button>
              <button
                onClick={() => router.push("/chat")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base px-8 py-4 rounded-lg transition-all backdrop-blur-sm"
              >
                Talk to AI Assistant
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "30+", label: "Verified Schemes" },
              { number: "8", label: "Indian Languages" },
              { number: "100%", label: "Free Forever" },
              { number: "2 min", label: "Average Time" },
            ].map((stat, i) => (
              <div key={i} className="border border-white/10 bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-amber-400 mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
                  {stat.number}
                </div>
                <div className="text-blue-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tricolor bottom */}
        <div className="flex h-1">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-[#138808]" />
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Simple Process</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A6B]" style={{ fontFamily: "'Noto Serif', serif" }}>
              How Yojana AI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share Your Profile",
                desc: "Enter basic details — age, income, state, occupation, and category. Takes under 2 minutes.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                )
              },
              {
                step: "02",
                title: "AI Matches Schemes",
                desc: "Our AI engine scans 30+ verified government schemes and identifies every benefit you qualify for.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                )
              },
              {
                step: "03",
                title: "Apply with Guidance",
                desc: "Get step-by-step instructions, document checklists, and direct links to official government portals.",
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="9 11 12 14 22 4"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                )
              },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all border border-gray-100 group">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-[#EEF2FF] text-[#1B3A6B] flex items-center justify-center group-hover:bg-[#1B3A6B] group-hover:text-white transition-all">
                    {item.icon}
                  </div>
                  <span className="text-5xl font-black text-gray-100 group-hover:text-gray-200 transition-colors" style={{ fontFamily: "'Noto Serif', serif" }}>
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-[#1B3A6B] mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-semibold text-sm tracking-widest uppercase mb-3">Scheme Categories</p>
            <h2 className="text-3xl font-bold text-[#1B3A6B]" style={{ fontFamily: "'Noto Serif', serif" }}>
              Who Can Benefit
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Farmers", count: "6 schemes", icon: "M" },
              { label: "Students", count: "8 schemes", icon: "S" },
              { label: "Business", count: "7 schemes", icon: "B" },
              { label: "Women", count: "5 schemes", icon: "W" },
              { label: "Health", count: "3 schemes", icon: "H" },
              { label: "Housing", count: "3 schemes", icon: "H" },
              { label: "Workers", count: "5 schemes", icon: "W" },
              { label: "SC/ST/OBC", count: "3 schemes", icon: "S" },
            ].map((cat, i) => (
              <button
                key={i}
                onClick={() => router.push("/check")}
                className="group bg-gray-50 hover:bg-[#1B3A6B] border border-gray-200 hover:border-[#1B3A6B] rounded-xl p-5 text-left transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-white group-hover:bg-white/10 border border-gray-200 group-hover:border-white/20 flex items-center justify-center mb-3 transition-all">
                  <span className="text-[#1B3A6B] group-hover:text-white font-bold text-sm transition-colors">
                    {cat.icon}
                  </span>
                </div>
                <div className="font-semibold text-gray-800 group-hover:text-white text-sm mb-0.5 transition-colors">{cat.label}</div>
                <div className="text-xs text-gray-400 group-hover:text-blue-200 transition-colors">{cat.count}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-16 px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { title: "Official Data", desc: "All scheme information sourced directly from myScheme.gov.in and official ministry portals" },
              { title: "No Registration", desc: "Use Yojana AI completely without creating an account or sharing sensitive documents" },
              { title: "Privacy First", desc: "Your profile data stays on your device. We never store or share personal information" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-4">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h3 className="font-bold text-[#1B3A6B] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#1B3A6B]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Noto Serif', serif" }}>
            Find Your Benefits Today
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            Takes less than 2 minutes. Completely free. No login required.
          </p>
          <button
            onClick={() => router.push("/check")}
            className="bg-[#D97706] hover:bg-amber-500 text-white font-bold text-lg px-10 py-4 rounded-lg transition-all hover:scale-105 shadow-xl"
          >
            Check My Eligibility
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] text-gray-400 py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1B3A6B] flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-white font-semibold" style={{ fontFamily: "'Noto Serif', serif" }}>Yojana AI</span>
            </div>
            <p className="text-xs text-center">
              Not affiliated with Government of India · Scheme data sourced from official portals · Always verify at myscheme.gov.in
            </p>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => router.push("/language")} className="hover:text-white transition-colors">Language</button>
              <button onClick={() => router.push("/chat")} className="hover:text-white transition-colors">AI Assistant</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}