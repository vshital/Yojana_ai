"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { translations } from "@/lib/lang";

const ALL_SCHEMES = [
  { id: 1, name: "PM-Kisan Samman Nidhi", emoji: "🌾", ministry: "Ministry of Agriculture", benefit: "₹6,000 per year (₹2,000 × 3 installments) direct to bank", tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200", documents: ["Aadhaar Card", "Land Records (Khata/Khasra)", "Bank Passbook", "Mobile Number"], applyUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx", condition: (f: any) => f.occupation === "farmer" },
  { id: 2, name: "PM Fasal Bima Yojana", emoji: "🌦️", ministry: "Ministry of Agriculture", benefit: "Crop insurance against natural disasters, pests & disease", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"], applyUrl: "https://pmfby.gov.in/farmerRegistrationNewUser", condition: (f: any) => f.occupation === "farmer" },
  { id: 3, name: "Kisan Credit Card (KCC)", emoji: "💳", ministry: "Ministry of Agriculture", benefit: "Credit up to ₹3 lakh at 4% interest for farming needs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/kcc", condition: (f: any) => f.occupation === "farmer" },
  { id: 4, name: "Ayushman Bharat – PMJAY", emoji: "🏥", ministry: "Ministry of Health", benefit: "₹5 lakh free health insurance per family per year", tag: "Health", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "Ration Card / BPL Card", "Family ID"], applyUrl: "https://beneficiary.nha.gov.in", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" || f.special?.includes("bpl") },
  { id: 5, name: "PM Suraksha Bima Yojana", emoji: "🛡️", ministry: "Ministry of Finance", benefit: "₹2 lakh accident insurance at just ₹20/year", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Bank Account (auto-debit)"], applyUrl: "https://www.myscheme.gov.in/schemes/pmsby", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 70 },
  { id: 6, name: "PM Jeevan Jyoti Bima Yojana", emoji: "🌟", ministry: "Ministry of Finance", benefit: "₹2 lakh life insurance at ₹436/year", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Bank Account (auto-debit)"], applyUrl: "https://www.myscheme.gov.in/schemes/pmjjby", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 50 },
  { id: 7, name: "National Scholarship Portal", emoji: "🎓", ministry: "Ministry of Education", benefit: "₹10,000 – ₹1,20,000/year for school & college students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Marksheets", "Income Certificate", "Bank Account", "Caste Certificate"], applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction", condition: (f: any) => f.occupation === "student" && (f.income === "below1L" || f.income === "1to2L" || f.income === "2to5L") },
  { id: 8, name: "Vidya Lakshmi Education Loan", emoji: "📚", ministry: "Ministry of Education", benefit: "Education loans up to ₹6.5 lakh at subsidized interest rates", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Admission Letter", "Fee Structure", "Income Proof"], applyUrl: "https://www.vidyalakshmi.co.in/Students/registerStudent", condition: (f: any) => f.occupation === "student" },
  { id: 9, name: "Divyangjan Scholarship", emoji: "♿", ministry: "Ministry of Social Justice", benefit: "₹14,000 – ₹35,000/year for students with disabilities", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Disability Certificate (40%+)", "Aadhaar Card", "Marksheets", "Bank Account"], applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction", condition: (f: any) => f.special?.includes("disabled") && f.occupation === "student" },
  { id: 10, name: "MUDRA Yojana – Shishu", emoji: "🏪", ministry: "Ministry of Finance", benefit: "Loan up to ₹50,000 — no collateral, no guarantor needed", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "PAN Card", "Business Address Proof", "Bank Statement"], applyUrl: "https://www.mudra.org.in/Home/PMMY", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 11, name: "MUDRA Yojana – Kishore", emoji: "📈", ministry: "Ministry of Finance", benefit: "Loan ₹50,000 – ₹5 lakh for growing businesses", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "PAN Card", "2-year Business Proof", "Bank Statement"], applyUrl: "https://www.mudra.org.in/Home/PMMY", condition: (f: any) => f.occupation === "business" },
  { id: 12, name: "Stand Up India – SC/ST/Women", emoji: "💪", ministry: "Ministry of Finance", benefit: "Loan ₹10 lakh – ₹1 crore for new enterprises", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar", "PAN", "Business Plan", "SC/ST or Woman proof"], applyUrl: "https://www.standupmitra.in/Login/Register", condition: (f: any) => (f.category === "sc" || f.category === "st" || f.special?.includes("woman_entrepreneur")) && f.occupation === "business" },
  { id: 13, name: "PMEGP Self Employment", emoji: "🏭", ministry: "Ministry of MSME", benefit: "15–35% subsidy on project cost up to ₹50 lakh", tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "PAN Card", "8th Pass Certificate", "Project Report"], applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 14, name: "Udyam Registration (MSME)", emoji: "🔖", ministry: "Ministry of MSME", benefit: "Free MSME certificate — unlocks 50+ govt subsidies & priority loans", tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", documents: ["Aadhaar Card", "PAN Card", "Business Details"], applyUrl: "https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm", condition: (f: any) => f.occupation === "business" },
  { id: 15, name: "PM Awas Yojana – Urban", emoji: "🏠", ministry: "Ministry of Housing", benefit: "Home loan interest subsidy up to ₹2.67 lakh", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "Income Proof", "Property Documents", "Bank Statement"], applyUrl: "https://pmaymis.gov.in", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 16, name: "PM Awas Yojana – Gramin", emoji: "🏡", ministry: "Ministry of Rural Development", benefit: "₹1.2–1.3 lakh grant to build a pucca house", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "BPL Ration Card", "Land Proof", "Bank Account"], applyUrl: "https://pmayg.nic.in", condition: (f: any) => f.special?.includes("bpl") || f.income === "below1L" },
  { id: 17, name: "PM Ujjwala Yojana", emoji: "🔥", ministry: "Ministry of Petroleum", benefit: "Free LPG connection + ₹1,600 financial assistance", tag: "Subsidy", tagColor: "bg-red-100 text-red-700 border-red-200", documents: ["Aadhaar Card", "BPL Ration Card", "Bank Account"], applyUrl: "https://www.pmuy.gov.in/ujjwala2.html", condition: (f: any) => f.gender === "female" && (f.special?.includes("bpl") || f.income === "below1L") },
  { id: 18, name: "Sukanya Samriddhi Yojana", emoji: "👧", ministry: "Ministry of Finance", benefit: "8.2% p.a. savings for girl child's education & marriage", tag: "Savings", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Girl Child's Birth Certificate", "Parent's Aadhaar & PAN", "Post Office / Bank Account"], applyUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samridhi-Yojana.aspx", condition: (f: any) => f.gender === "female" && Number(f.age) <= 35 },
  { id: 19, name: "PM Matru Vandana Yojana", emoji: "🤱", ministry: "Ministry of Women & Child Development", benefit: "₹6,500 cash benefit for first pregnancy", tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200", documents: ["Aadhaar Card", "MCP Card", "Bank Account", "Pregnancy Certificate"], applyUrl: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana", condition: (f: any) => f.gender === "female" && Number(f.age) >= 19 && Number(f.age) <= 45 },
  { id: 20, name: "e-Shram Card", emoji: "👷", ministry: "Ministry of Labour", benefit: "₹2 lakh accident insurance + access to 50+ welfare schemes", tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number linked to Aadhaar"], applyUrl: "https://eshram.gov.in/home/registerNow", condition: (f: any) => f.occupation === "unemployed" || f.occupation === "farmer" || f.occupation === "business" },
  { id: 21, name: "MGNREGS – Job Card", emoji: "⛏️", ministry: "Ministry of Rural Development", benefit: "100 days guaranteed employment at ₹220–₹357/day", tag: "Employment", tagColor: "bg-lime-100 text-lime-700 border-lime-200", documents: ["Aadhaar Card", "Residence Proof", "Passport Photo", "Bank Account"], applyUrl: "https://nrega.nic.in/MGNREGA_new/Nrega_JSP_Page/JobCardApplicationForm.aspx", condition: (f: any) => f.income === "below1L" || f.occupation === "unemployed" },
  { id: 22, name: "Atal Pension Yojana", emoji: "👴", ministry: "Ministry of Finance", benefit: "₹1,000–₹5,000/month guaranteed pension after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://www.npscra.nsdl.co.in/scheme-details.php", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 },
  { id: 23, name: "PM Shram Yogi Maandhan", emoji: "🔧", ministry: "Ministry of Labour", benefit: "₹3,000/month pension for unorganised workers after 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://maandhan.in/shramyogi", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 && (f.income === "below1L" || f.income === "1to2L") },
  { id: 24, name: "Post-Matric Scholarship SC", emoji: "📖", ministry: "Ministry of Social Justice", benefit: "Full tuition fee + maintenance allowance for SC students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Caste Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction", condition: (f: any) => f.category === "sc" && f.occupation === "student" },
  { id: 25, name: "Post-Matric Scholarship ST", emoji: "🏫", ministry: "Ministry of Tribal Affairs", benefit: "Full tuition + living allowance for ST students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Tribe Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction", condition: (f: any) => f.category === "st" && f.occupation === "student" },
  { id: 26, name: "Dr. Ambedkar Scholarship OBC", emoji: "🎒", ministry: "Ministry of Social Justice", benefit: "Tuition fee + maintenance for OBC students in postgrad", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "OBC Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction", condition: (f: any) => f.category === "obc" && f.occupation === "student" },
  { id: 27, name: "PM Kaushal Vikas Yojana", emoji: "🛠️", ministry: "Ministry of Skill Development", benefit: "Free skill training + ₹8,000 reward on certification", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Educational Certificates", "Bank Account"], applyUrl: "https://www.pmkvyofficial.org/Index.aspx", condition: (f: any) => f.occupation === "unemployed" || f.occupation === "student" },
  { id: 28, name: "PM Jan Dhan Yojana", emoji: "🏦", ministry: "Ministry of Finance", benefit: "Zero-balance account + ₹10,000 overdraft + ₹2L accident insurance", tag: "Banking", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "Passport Photo"], applyUrl: "https://www.pmjdy.gov.in/account", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 29, name: "PM Vishwakarma Yojana", emoji: "⚒️", ministry: "Ministry of MSME", benefit: "₹15,000 toolkit grant + ₹3L loan at 5% + free skill training", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://pmvishwakarma.gov.in", condition: (f: any) => f.occupation === "business" || f.occupation === "employed" },
  { id: 30, name: "Mahila Shakti Kendra", emoji: "👩‍💼", ministry: "Ministry of Women & Child Development", benefit: "Skill development + digital literacy + employment support for women", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Residence Proof"], applyUrl: "https://wcd.nic.in/schemes/mahila-shakti-kendra-msk", condition: (f: any) => f.gender === "female" && (f.income === "below1L" || f.income === "1to2L") },
];

function Results() {
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

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4">
        <span>🇮🇳 Government of India Initiative</span>
      </div>
      <nav className="bg-white border-b-4 border-[#f97316] shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/home")} className="text-[#1a3a6b] hover:underline text-sm">🏠 Home</button>
            <span className="text-gray-300">›</span>
            <button onClick={() => router.push("/check")} className="text-[#1a3a6b] hover:underline text-sm">Edit Profile</button>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500 text-sm">Results</span>
          </div>
          <button onClick={() => router.push("/chat")} className="bg-[#1a3a6b] text-white text-sm px-4 py-2 rounded hover:bg-[#15306b] transition-all">
            🤖 Ask AI
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {matched.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🎯</div>
            <div>
              <div className="font-bold text-green-800">{matched.length} schemes found for {form.name}!</div>
              <div className="text-green-600 text-sm">Click "Apply Now" to go directly to the official government portal</div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-5">
            <div className="text-4xl mb-2">😔</div>
            <p className="text-yellow-800 font-semibold">{t.results_none}</p>
            <button onClick={() => router.push("/check")} className="mt-3 text-[#1a3a6b] underline text-sm">← Edit your details</button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-2">
          {[
            { label: "Name", val: form.name },
            { label: "Age", val: form.age },
            { label: "State", val: form.state },
            { label: "Category", val: form.category?.toUpperCase() },
            { label: "Occupation", val: form.occupation },
          ].map((item) => item.val && (
            <div key={item.label} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm">
              <span className="text-gray-400">{item.label}: </span>
              <span className="text-gray-800 font-semibold">{item.val}</span>
            </div>
          ))}
        </div>

        {tags.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
            {tags.map((tag) => (
              <button key={tag} onClick={() => setFilter(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${filter === tag ? "bg-[#1a3a6b] text-white border-[#1a3a6b]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b]"}`}>
                {tag === "all" ? `All (${matched.length})` : tag}
              </button>
            ))}
          </div>
        )}

        <div className="space-y-4">
          {filtered.map((scheme) => (
            <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{scheme.emoji}</span>
                  <div className="flex-1">
                    <div className="font-bold text-[#1a3a6b] text-base leading-tight">{scheme.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{scheme.ministry}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${scheme.tagColor}`}>{scheme.tag}</span>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <div className="text-blue-400 text-xs mb-0.5 font-medium">BENEFIT</div>
                  <div className="text-blue-900 font-semibold text-sm">{scheme.benefit}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span className="text-green-700 text-sm font-semibold">You are eligible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                      className="text-gray-400 hover:text-gray-600 text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:border-gray-300 transition-all">
                      {expandedId === scheme.id ? "Hide docs ▲" : "View docs ▾"}
                    </button>
                    <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="bg-[#f97316] hover:bg-orange-600 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all flex items-center gap-1">
                      Apply Now ↗
                    </a>
                  </div>
                </div>
              </div>
              {expandedId === scheme.id && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">Documents Required</div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {scheme.documents.map((doc, i) => (
                      <span key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 flex items-center gap-1.5">
                        <span className="text-orange-400">📄</span> {doc}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs">💡 Tip: Aadhaar + Bank Passbook required for almost all schemes</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {matched.length > 0 && (
          <div onClick={() => router.push("/chat")}
            className="mt-6 cursor-pointer bg-[#1a3a6b] rounded-xl p-5 flex items-center gap-4 hover:bg-[#15306b] transition-all">
            <span className="text-4xl">🤖</span>
            <div>
              <div className="font-bold text-white">Confused? Ask Sahayak AI</div>
              <div className="text-blue-200 text-sm">Get help with eligibility, documents, or how to apply</div>
            </div>
            <span className="ml-auto text-orange-300 text-xl">→</span>
          </div>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#1a3a6b] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading your schemes...</p>
        </div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}