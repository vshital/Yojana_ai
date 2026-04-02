"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { translations } from "@/lib/lang";

const ALL_SCHEMES = [
  // ── AGRICULTURE ──────────────────────────────────────────
  {
    id: 1,
    name: "PM-Kisan Samman Nidhi",
    emoji: "🌾",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000 per year (₹2,000 × 3 installments) direct to bank",
    tag: "Cash Transfer",
    tagColor: "bg-green-500/15 text-green-400",
    documents: ["Aadhaar Card", "Land Records (Khata/Khasra)", "Bank Passbook", "Mobile Number"],
    applyUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 2,
    name: "PM Fasal Bima Yojana",
    emoji: "🌦️",
    ministry: "Ministry of Agriculture",
    benefit: "Crop insurance against natural disasters, pests & disease",
    tag: "Insurance",
    tagColor: "bg-teal-500/15 text-teal-400",
    documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
    applyUrl: "https://pmfby.gov.in/farmerRegistrationNewUser",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC)",
    emoji: "💳",
    ministry: "Ministry of Agriculture",
    benefit: "Credit up to ₹3 lakh at 4% interest for farming needs",
    tag: "Loan",
    tagColor: "bg-purple-500/15 text-purple-400",
    documents: ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"],
    applyUrl: "https://www.myscheme.gov.in/schemes/kcc",
    condition: (f: any) => f.occupation === "farmer",
  },

  // ── HEALTH ───────────────────────────────────────────────
  {
    id: 4,
    name: "Ayushman Bharat – PMJAY",
    emoji: "🏥",
    ministry: "Ministry of Health",
    benefit: "₹5 lakh free health insurance per family per year",
    tag: "Health",
    tagColor: "bg-blue-500/15 text-blue-400",
    documents: ["Aadhaar Card", "Ration Card / BPL Card", "Family ID"],
    applyUrl: "https://beneficiary.nha.gov.in",
    condition: (f: any) =>
      f.income === "below1L" || f.income === "1to2L" || f.special?.includes("bpl"),
  },
  {
    id: 5,
    name: "Pradhan Mantri Suraksha Bima Yojana",
    emoji: "🛡️",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh accident insurance at just ₹20/year premium",
    tag: "Insurance",
    tagColor: "bg-teal-500/15 text-teal-400",
    documents: ["Aadhaar Card", "Bank Account (auto-debit)"],
    applyUrl: "https://www.myscheme.gov.in/schemes/pmsby",
    condition: (f: any) =>
      Number(f.age) >= 18 && Number(f.age) <= 70,
  },
  {
    id: 6,
    name: "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    emoji: "🌟",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh life insurance at ₹436/year premium",
    tag: "Insurance",
    tagColor: "bg-teal-500/15 text-teal-400",
    documents: ["Aadhaar Card", "Bank Account (auto-debit)"],
    applyUrl: "https://www.myscheme.gov.in/schemes/pmjjby",
    condition: (f: any) =>
      Number(f.age) >= 18 && Number(f.age) <= 50,
  },

  // ── EDUCATION ────────────────────────────────────────────
  {
    id: 7,
    name: "National Scholarship Portal (NSP)",
    emoji: "🎓",
    ministry: "Ministry of Education",
    benefit: "₹10,000 – ₹1,20,000/year for school & college students",
    tag: "Scholarship",
    tagColor: "bg-yellow-500/15 text-yellow-400",
    documents: ["Aadhaar Card", "Marksheets (last 2 years)", "Income Certificate", "Bank Account", "Caste Certificate"],
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.occupation === "student" &&
      (f.income === "below1L" || f.income === "1to2L" || f.income === "2to5L"),
  },
  {
    id: 8,
    name: "Pradhan Mantri Vidya Lakshmi",
    emoji: "📚",
    ministry: "Ministry of Education",
    benefit: "Education loans up to ₹6.5 lakh at subsidized rates",
    tag: "Loan",
    tagColor: "bg-purple-500/15 text-purple-400",
    documents: ["Aadhaar Card", "Admission Letter", "Fee Structure", "Income Proof", "Bank Account"],
    applyUrl: "https://www.vidyalakshmi.co.in/Students/registerStudent",
    condition: (f: any) => f.occupation === "student",
  },
  {
    id: 9,
    name: "Divyangjan Scholarship",
    emoji: "♿",
    ministry: "Ministry of Social Justice",
    benefit: "₹14,000 – ₹35,000/year for students with disabilities",
    tag: "Scholarship",
    tagColor: "bg-yellow-500/15 text-yellow-400",
    documents: ["Disability Certificate (40%+)", "Aadhaar Card", "Marksheets", "Bank Account"],
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.special?.includes("disabled") && f.occupation === "student",
  },

  // ── BUSINESS / MSME ──────────────────────────────────────
  {
    id: 10,
    name: "MUDRA Yojana – Shishu",
    emoji: "🏪",
    ministry: "Ministry of Finance",
    benefit: "Loan up to ₹50,000 — no collateral, no guarantor",
    tag: "Loan",
    tagColor: "bg-purple-500/15 text-purple-400",
    documents: ["Aadhaar Card", "PAN Card", "Business Address Proof", "Bank Statement (6 months)"],
    applyUrl: "https://www.mudra.org.in/Home/PMMY",
    condition: (f: any) =>
      f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 11,
    name: "MUDRA Yojana – Kishore",
    emoji: "📈",
    ministry: "Ministry of Finance",
    benefit: "Loan ₹50,000 – ₹5 lakh for growing businesses",
    tag: "Loan",
    tagColor: "bg-purple-500/15 text-purple-400",
    documents: ["Aadhaar Card", "PAN Card", "2-year Business Proof", "IT Returns", "Bank Statement"],
    applyUrl: "https://www.mudra.org.in/Home/PMMY",
    condition: (f: any) => f.occupation === "business",
  },
  {
    id: 12,
    name: "Stand Up India – SC/ST/Women",
    emoji: "💪",
    ministry: "Ministry of Finance",
    benefit: "Loan ₹10 lakh – ₹1 crore for new enterprises",
    tag: "Loan",
    tagColor: "bg-purple-500/15 text-purple-400",
    documents: ["Aadhaar", "PAN", "Business Plan", "SC/ST or Woman proof", "Bank Statement"],
    applyUrl: "https://www.standupmitra.in/Login/Register",
    condition: (f: any) =>
      (f.category === "sc" || f.category === "st" || f.special?.includes("woman_entrepreneur")) &&
      f.occupation === "business",
  },
  {
    id: 13,
    name: "PMEGP – Self Employment",
    emoji: "🏭",
    ministry: "Ministry of MSME",
    benefit: "15–35% subsidy on project cost up to ₹50 lakh",
    tag: "Subsidy",
    tagColor: "bg-orange-500/15 text-orange-400",
    documents: ["Aadhaar Card", "PAN Card", "8th Pass Certificate", "Project Report", "Caste Certificate (if SC/ST)"],
    applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    condition: (f: any) =>
      f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 14,
    name: "Udyam Registration (MSME)",
    emoji: "🔖",
    ministry: "Ministry of MSME",
    benefit: "Free MSME certificate — unlocks 50+ govt subsidies & priority loans",
    tag: "Registration",
    tagColor: "bg-indigo-500/15 text-indigo-400",
    documents: ["Aadhaar Card", "PAN Card", "Business Details"],
    applyUrl: "https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm",
    condition: (f: any) => f.occupation === "business",
  },

  // ── HOUSING ──────────────────────────────────────────────
  {
    id: 15,
    name: "PM Awas Yojana – Urban",
    emoji: "🏠",
    ministry: "Ministry of Housing",
    benefit: "Home loan interest subsidy up to ₹2.67 lakh",
    tag: "Housing",
    tagColor: "bg-orange-500/15 text-orange-400",
    documents: ["Aadhaar Card", "Income Proof", "Property Documents", "Bank Statement"],
    applyUrl: "https://pmaymis.gov.in",
    condition: (f: any) =>
      f.income === "below1L" || f.income === "1to2L",
  },
  {
    id: 16,
    name: "PM Awas Yojana – Gramin",
    emoji: "🏡",
    ministry: "Ministry of Rural Development",
    benefit: "₹1.2–1.3 lakh grant to build a pucca house",
    tag: "Housing",
    tagColor: "bg-orange-500/15 text-orange-400",
    documents: ["Aadhaar Card", "BPL Ration Card", "Land Proof", "Bank Account", "Job Card (MGNREGS)"],
    applyUrl: "https://pmayg.nic.in",
    condition: (f: any) =>
      f.special?.includes("bpl") || f.income === "below1L",
  },

  // ── WOMEN ────────────────────────────────────────────────
  {
    id: 17,
    name: "PM Ujjwala Yojana",
    emoji: "🔥",
    ministry: "Ministry of Petroleum",
    benefit: "Free LPG connection + ₹1,600 financial assistance",
    tag: "Subsidy",
    tagColor: "bg-red-500/15 text-red-400",
    documents: ["Aadhaar Card", "BPL Ration Card", "Bank Account"],
    applyUrl: "https://www.pmuy.gov.in/ujjwala2.html",
    condition: (f: any) =>
      f.gender === "female" &&
      (f.special?.includes("bpl") || f.income === "below1L"),
  },
  {
    id: 18,
    name: "Sukanya Samriddhi Yojana",
    emoji: "👧",
    ministry: "Ministry of Finance",
    benefit: "8.2% p.a. savings for girl child's education & marriage",
    tag: "Savings",
    tagColor: "bg-pink-500/15 text-pink-400",
    documents: ["Girl Child's Birth Certificate", "Parent's Aadhaar & PAN", "Post Office / Bank Account"],
    applyUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samridhi-Yojana.aspx",
    condition: (f: any) =>
      f.gender === "female" && Number(f.age) <= 30,
  },
  {
    id: 19,
    name: "Pradhan Mantri Matru Vandana Yojana",
    emoji: "🤱",
    ministry: "Ministry of Women & Child Development",
    benefit: "₹6,500 cash benefit for first pregnancy",
    tag: "Cash Transfer",
    tagColor: "bg-green-500/15 text-green-400",
    documents: ["Aadhaar Card", "MCP Card", "Bank Account", "Pregnancy Certificate"],
    applyUrl: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    condition: (f: any) =>
      f.gender === "female" &&
      Number(f.age) >= 19 &&
      Number(f.age) <= 45,
  },
  {
    id: 20,
    name: "Mahila Shakti Kendra",
    emoji: "👩‍💼",
    ministry: "Ministry of Women & Child Development",
    benefit: "Skill development, digital literacy & employment support for rural women",
    tag: "Skill",
    tagColor: "bg-pink-500/15 text-pink-400",
    documents: ["Aadhaar Card", "Residence Proof"],
    applyUrl: "https://wcd.nic.in/schemes/mahila-shakti-kendra-msk",
    condition: (f: any) =>
      f.gender === "female" &&
      (f.income === "below1L" || f.income === "1to2L"),
  },

  // ── WORKERS / INFORMAL ───────────────────────────────────
  {
    id: 21,
    name: "e-Shram Card",
    emoji: "👷",
    ministry: "Ministry of Labour",
    benefit: "₹2 lakh accident insurance + access to 50+ welfare schemes",
    tag: "Registration",
    tagColor: "bg-indigo-500/15 text-indigo-400",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number linked to Aadhaar"],
    applyUrl: "https://eshram.gov.in/home/registerNow",
    condition: (f: any) =>
      f.occupation === "unemployed" || f.occupation === "farmer" || f.occupation === "business",
  },
  {
    id: 22,
    name: "MGNREGS – Job Card",
    emoji: "⛏️",
    ministry: "Ministry of Rural Development",
    benefit: "100 days guaranteed employment at ₹220–₹357/day",
    tag: "Employment",
    tagColor: "bg-lime-500/15 text-lime-400",
    documents: ["Aadhaar Card", "Residence Proof", "Passport Photo", "Bank Account"],
    applyUrl: "https://nrega.nic.in/MGNREGA_new/Nrega_JSP_Page/JobCardApplicationForm.aspx",
    condition: (f: any) =>
      f.income === "below1L" || f.occupation === "unemployed",
  },
  {
    id: 23,
    name: "Atal Pension Yojana",
    emoji: "👴",
    ministry: "Ministry of Finance",
    benefit: "₹1,000–₹5,000/month guaranteed pension after age 60",
    tag: "Pension",
    tagColor: "bg-gray-500/15 text-gray-400",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
    applyUrl: "https://www.npscra.nsdl.co.in/scheme-details.php",
    condition: (f: any) =>
      Number(f.age) >= 18 && Number(f.age) <= 40,
  },
  {
    id: 24,
    name: "PM Shram Yogi Maandhan",
    emoji: "🔧",
    ministry: "Ministry of Labour",
    benefit: "₹3,000/month pension for unorganised workers after 60",
    tag: "Pension",
    tagColor: "bg-gray-500/15 text-gray-400",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
    applyUrl: "https://maandhan.in/shramyogi",
    condition: (f: any) =>
      Number(f.age) >= 18 &&
      Number(f.age) <= 40 &&
      (f.income === "below1L" || f.income === "1to2L"),
  },

  // ── SC / ST / OBC ─────────────────────────────────────────
  {
    id: 25,
    name: "Post-Matric Scholarship SC Students",
    emoji: "📖",
    ministry: "Ministry of Social Justice",
    benefit: "Full tuition fee + maintenance allowance for SC students",
    tag: "Scholarship",
    tagColor: "bg-yellow-500/15 text-yellow-400",
    documents: ["Aadhaar Card", "Caste Certificate", "Marksheets", "Income Certificate (<₹2.5L)", "Bank Account"],
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.category === "sc" && f.occupation === "student",
  },
  {
    id: 26,
    name: "Post-Matric Scholarship ST Students",
    emoji: "🏫",
    ministry: "Ministry of Tribal Affairs",
    benefit: "Full tuition + living allowance for ST students",
    tag: "Scholarship",
    tagColor: "bg-yellow-500/15 text-yellow-400",
    documents: ["Aadhaar Card", "Tribe Certificate", "Marksheets", "Income Certificate", "Bank Account"],
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.category === "st" && f.occupation === "student",
  },
  {
    id: 27,
    name: "Dr. Ambedkar Post-Matric Scholarship (OBC)",
    emoji: "🎒",
    ministry: "Ministry of Social Justice",
    benefit: "Tuition fee + maintenance for OBC students studying abroad/postgrad",
    tag: "Scholarship",
    tagColor: "bg-yellow-500/15 text-yellow-400",
    documents: ["Aadhaar Card", "OBC Certificate", "Marksheets", "Income Certificate (<₹1L)", "Bank Account"],
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.category === "obc" && f.occupation === "student",
  },

  // ── DIGITAL / SKILL ──────────────────────────────────────
  {
    id: 28,
    name: "PM Kaushal Vikas Yojana (PMKVY)",
    emoji: "🛠️",
    ministry: "Ministry of Skill Development",
    benefit: "Free skill training + ₹8,000 reward on certification",
    tag: "Skill",
    tagColor: "bg-pink-500/15 text-pink-400",
    documents: ["Aadhaar Card", "Educational Certificates", "Bank Account"],
    applyUrl: "https://www.pmkvyofficial.org/Index.aspx",
    condition: (f: any) =>
      f.occupation === "unemployed" || f.occupation === "student",
  },
  {
    id: 29,
    name: "PM Jan Dhan Yojana",
    emoji: "🏦",
    ministry: "Ministry of Finance",
    benefit: "Zero-balance bank account + ₹10,000 overdraft + RuPay card + ₹2L insurance",
    tag: "Banking",
    tagColor: "bg-blue-500/15 text-blue-400",
    documents: ["Aadhaar Card", "Passport Photo"],
    applyUrl: "https://www.pmjdy.gov.in/account",
    condition: (f: any) =>
      f.income === "below1L" || f.income === "1to2L",
  },
  {
    id: 30,
    name: "PM Vishwakarma Yojana",
    emoji: "⚒️",
    ministry: "Ministry of MSME",
    benefit: "₹15,000 toolkit grant + ₹3L loan at 5% + free skill training",
    tag: "Skill",
    tagColor: "bg-pink-500/15 text-pink-400",
    documents: ["Aadhaar Card", "Caste Certificate (if applicable)", "Bank Account", "Mobile Number"],
    applyUrl: "https://pmvishwakarma.gov.in",
    condition: (f: any) =>
      f.occupation === "business" || f.occupation === "employed",
  },
];

export default function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "en");
  }, []);

  const t = translations[lang];

  const form = {
    name: params.get("name"),
    age: params.get("age"),
    gender: params.get("gender"),
    state: params.get("state"),
    category: params.get("category"),
    occupation: params.get("occupation"),
    income: params.get("income"),
    special: params.get("special")?.split(",") || [],
  };

  const matched = ALL_SCHEMES.filter((s) => s.condition(form));
  const tags = ["all", ...Array.from(new Set(matched.map((s) => s.tag)))];
  const filtered = filter === "all" ? matched : matched.filter((s) => s.tag === filter);

  // Estimate total benefit value for banner
  const totalSchemes = matched.length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5">
        <div className="px-6 py-4 max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/home")}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              🏠
            </button>
            <button
              onClick={() => router.push("/check")}
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              ← Edit
            </button>
          </div>
          <div className="text-center">
            <div className="text-white font-bold">{t.results_title}</div>
            <div className="text-orange-400 text-xs font-medium">
              {totalSchemes} {t.scheme_count}
            </div>
          </div>
          <button
            onClick={() => router.push("/chat")}
            className="bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm px-3 py-1.5 rounded-xl hover:bg-orange-500/20 transition-all"
          >
            🤖 AI
          </button>
        </div>
      </div>

      <div className="px-6 py-6 max-w-2xl mx-auto">
        {/* User summary pills */}
        <div className="bg-white/3 border border-white/8 rounded-2xl p-4 mb-6 flex flex-wrap gap-2">
          {[
            { label: "Name", val: form.name },
            { label: "Age", val: form.age },
            { label: "State", val: form.state },
            { label: "Category", val: form.category?.toUpperCase() },
            { label: "Income", val: form.income },
          ].map(
            (item) =>
              item.val && (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-lg px-3 py-1.5 text-sm"
                >
                  <span className="text-white/30">{item.label}: </span>
                  <span className="text-white font-medium">{item.val}</span>
                </div>
              )
          )}
        </div>

        {/* Result count banner */}
        {matched.length > 0 ? (
          <div className="bg-gradient-to-r from-green-500/10 to-orange-500/10 border border-green-500/20 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <div className="font-bold text-green-400">
                {totalSchemes} schemes found for you!
              </div>
              <div className="text-white/40 text-sm">
                Click "Apply Now" on any scheme to go directly to the official application page
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 text-white/30">
            <div className="text-5xl mb-4">😔</div>
            <p>{t.results_none}</p>
            <button
              onClick={() => router.push("/check")}
              className="mt-4 text-orange-400 hover:text-orange-300 text-sm"
            >
              ← Try again
            </button>
          </div>
        )}

        {/* Filter tabs */}
        {tags.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all
                  ${
                    filter === tag
                      ? "bg-orange-500 text-white"
                      : "bg-white/5 border border-white/10 text-white/40 hover:text-white"
                  }`}
              >
                {tag === "all" ? `All (${matched.length})` : tag}
              </button>
            ))}
          </div>
        )}

        {/* Scheme Cards */}
        <div className="space-y-4">
          {filtered.map((scheme) => (
            <div
              key={scheme.id}
              className="bg-white/3 border border-white/8 hover:border-orange-500/30 rounded-2xl overflow-hidden transition-all"
            >
              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl flex-shrink-0 mt-0.5">
                      {scheme.emoji}
                    </span>
                    <div>
                      <div className="font-bold text-white leading-tight">
                        {scheme.name}
                      </div>
                      <div className="text-white/30 text-xs mt-0.5">
                        {scheme.ministry}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${scheme.tagColor}`}
                  >
                    {scheme.tag}
                  </span>
                </div>

                {/* Benefit box */}
                <div className="mt-4 bg-white/5 rounded-xl p-3">
                  <div className="text-white/40 text-xs mb-1">{t.benefit}</div>
                  <div className="text-white font-semibold text-sm">
                    {scheme.benefit}
                  </div>
                </div>

                {/* Actions row */}
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-green-400 text-sm font-semibold">
                    {t.eligible}
                  </span>
                  <div className="flex-1" />
                  <button
                    onClick={() =>
                      setExpandedId(
                        expandedId === scheme.id ? null : scheme.id
                      )
                    }
                    className="text-white/30 hover:text-white text-sm transition-colors px-2"
                  >
                    {expandedId === scheme.id ? "Less ▲" : "Docs ▾"}
                  </button>
                  {/* DIRECT APPLY LINK */}
                  <a
                    href={scheme.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-400 active:scale-95 text-white text-sm font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/20 flex items-center gap-1.5"
                  >
                    Apply Now
                    <span className="text-xs opacity-70">↗</span>
                  </a>
                </div>
              </div>

              {/* Expanded documents */}
              {expandedId === scheme.id && (
                <div className="border-t border-white/5 px-5 py-4 bg-white/2">
                  <div className="text-white/40 text-xs mb-3 uppercase tracking-widest">
                    {t.documents} Required
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {scheme.documents.map((doc, i) => (
                      <span
                        key={i}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 flex items-center gap-1.5"
                      >
                        <span className="text-orange-400 text-xs">📄</span>
                        {doc}
                      </span>
                    ))}
                  </div>
                  <p className="text-white/20 text-xs mt-3">
                    💡 Tip: Keep Aadhaar + Bank Passbook ready — required for almost all schemes
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ask AI CTA */}
        {matched.length > 0 && (
          <div
            onClick={() => router.push("/chat")}
            className="mt-8 cursor-pointer bg-gradient-to-r from-orange-500/10 to-blue-600/10 border border-orange-500/20 rounded-2xl p-5 flex items-center gap-4 hover:border-orange-500/40 transition-all group"
          >
            <span className="text-4xl">🤖</span>
            <div>
              <div className="font-bold text-white">{t.ask_ai}</div>
              <div className="text-white/40 text-sm">
                Confused about eligibility or documents? Ask Sahayak
              </div>
            </div>
            <span className="ml-auto text-orange-400 text-xl group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        )}

        {/* Footer space */}
        <div className="h-8" />
      </div>
    </div>
  );
}