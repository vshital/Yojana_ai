"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

// ── Translations ──────────────────────────────────────────
const T: any = {
  en: {
    govStrip: "🇮🇳 Government of India Initiative",
    home: "🏠 Home",
    edit: "Edit Profile",
    results: "Results",
    askAI: "🤖 Ask AI",
    found: "benefits found for",
    applyNote: "Click Apply Now — opens the official government portal directly",
    noResult: "No benefits found. Try editing your details.",
    editLink: "← Edit your details",
    benefit: "BENEFIT",
    eligible: "✅ You are eligible",
    howToApply: "How to Apply ▾",
    hideGuide: "Hide ▲",
    docs: "Documents ▾",
    hideDocs: "Hide ▲",
    applyNow: "Apply Now ↗",
    stepGuide: "📋 Step-by-Step Guide",
    docsNeeded: "📄 Documents Needed",
    offlineOption: "🏢 OFFLINE OPTION",
    tip: "💡 Tip: Keep all documents as photos on your phone — saves time at offices",
    share: "📤 Share on WhatsApp",
    askAIBanner: "Confused? Ask Sahayak AI",
    askAIDesc: "Get help in Hindi, English or Marathi",
    online: "💻 Online",
    offline: "🏢 Visit Office",
    both: "💻🏢 Online or Office",
    filter: "All",
  },
  hi: {
    govStrip: "🇮🇳 भारत सरकार की पहल",
    home: "🏠 होम",
    edit: "प्रोफ़ाइल बदलें",
    results: "परिणाम",
    askAI: "🤖 AI से पूछें",
    found: "योजनाएं मिलीं",
    applyNote: "अभी आवेदन करें — सीधे सरकारी पोर्टल पर जाएं",
    noResult: "कोई योजना नहीं मिली। अपनी जानकारी बदलकर देखें।",
    editLink: "← जानकारी बदलें",
    benefit: "लाभ",
    eligible: "✅ आप पात्र हैं",
    howToApply: "कैसे आवेदन करें ▾",
    hideGuide: "छुपाएं ▲",
    docs: "दस्तावेज़ ▾",
    hideDocs: "छुपाएं ▲",
    applyNow: "अभी आवेदन करें ↗",
    stepGuide: "📋 चरण-दर-चरण गाइड",
    docsNeeded: "📄 आवश्यक दस्तावेज़",
    offlineOption: "🏢 ऑफलाइन विकल्प",
    tip: "💡 सभी दस्तावेज़ अपने फोन में फोटो रखें — कार्यालय में समय बचेगा",
    share: "📤 WhatsApp पर शेयर करें",
    askAIBanner: "उलझन है? सहायक AI से पूछें",
    askAIDesc: "हिंदी, अंग्रेज़ी या मराठी में मदद पाएं",
    online: "💻 ऑनलाइन",
    offline: "🏢 कार्यालय जाएं",
    both: "💻🏢 ऑनलाइन या कार्यालय",
    filter: "सभी",
  },
  mr: {
    govStrip: "🇮🇳 भारत सरकारचा उपक्रम",
    home: "🏠 मुख्यपृष्ठ",
    edit: "माहिती बदला",
    results: "निकाल",
    askAI: "🤖 AI ला विचारा",
    found: "योजना सापडल्या",
    applyNote: "अर्ज करा — थेट सरकारी पोर्टलवर जा",
    noResult: "कोणती योजना सापडली नाही. माहिती बदलून पहा.",
    editLink: "← माहिती बदला",
    benefit: "फायदा",
    eligible: "✅ तुम्ही पात्र आहात",
    howToApply: "अर्ज कसा करावा ▾",
    hideGuide: "लपवा ▲",
    docs: "कागदपत्रे ▾",
    hideDocs: "लपवा ▲",
    applyNow: "अर्ज करा ↗",
    stepGuide: "📋 चरण-दर-चरण मार्गदर्शन",
    docsNeeded: "📄 आवश्यक कागदपत्रे",
    offlineOption: "🏢 ऑफलाइन पर्याय",
    tip: "💡 सर्व कागदपत्रे फोनमध्ये फोटो ठेवा — कार्यालयात वेळ वाचेल",
    share: "📤 WhatsApp वर शेअर करा",
    askAIBanner: "गोंधळ आहे? सहायक AI ला विचारा",
    askAIDesc: "हिंदी, इंग्रजी किंवा मराठीत मदत मिळवा",
    online: "💻 ऑनलाइन",
    offline: "🏢 कार्यालयात जा",
    both: "💻🏢 ऑनलाइन किंवा कार्यालय",
    filter: "सर्व",
  },
};

// ── Schemes Data ──────────────────────────────────────────
const ALL_SCHEMES = [
  {
    id: 1, name: "PM-Kisan Samman Nidhi", emoji: "🌾",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year — ₹2,000 every 4 months, direct to bank",
    tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200",
    applyMode: "online", time: "15 min", helpline: "155261",
    documents: ["Aadhaar Card", "Land Records (7/12 or Khata)", "Bank Passbook", "Mobile Number"],
    steps: [
      "Go to pmkisan.gov.in",
      "Click 'Farmers Corner' → 'New Farmer Registration'",
      "Enter Aadhaar number and select your state",
      "Fill land details and bank account number",
      "Submit — note your application reference number",
      "First ₹2,000 arrives within 2–3 months"
    ],
    offline: "Visit nearest CSC (Common Service Centre) — they register for free",
    applyUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 2, name: "Ayushman Bharat – PMJAY", emoji: "🏥",
    ministry: "Ministry of Health",
    benefit: "₹5 lakh free hospital treatment per year — 1,500+ hospitals covered",
    tag: "Health", tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    applyMode: "both", time: "10 min", helpline: "14555",
    documents: ["Aadhaar Card", "Ration Card (if available)", "Mobile Number"],
    steps: [
      "Check eligibility at beneficiary.nha.gov.in",
      "Enter Aadhaar or mobile number to verify",
      "If eligible — visit any empanelled government hospital",
      "Show Aadhaar at the Ayushman Bharat help desk",
      "Hospital creates your Ayushman card free of cost",
      "Treatment starts immediately — no cash needed"
    ],
    offline: "Visit any government hospital — they have Ayushman enrollment counters",
    applyUrl: "https://beneficiary.nha.gov.in",
    condition: (f: any) => f.income === "below1L" || f.income === "1to2L" || f.special?.includes("bpl"),
  },
  {
    id: 3, name: "PM Suraksha Bima Yojana", emoji: "🛡️",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh accident insurance — only ₹20/year auto-deducted from bank",
    tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    applyMode: "both", time: "5 min", helpline: "1800-180-1111",
    documents: ["Aadhaar linked to bank account", "Bank account with balance"],
    steps: [
      "Visit your bank OR use mobile banking app",
      "Ask for 'PMSBY enrollment' at the counter",
      "Fill one-page form with Aadhaar and bank details",
      "₹20 auto-deducted from your account every June",
      "You get SMS confirmation — save it",
      "Coverage renews automatically every year"
    ],
    offline: "Walk into any bank branch with Aadhaar — done in 5 minutes",
    applyUrl: "https://www.jansuraksha.gov.in/Forms-PMSBY.aspx",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 70,
  },
  {
    id: 4, name: "PM Jeevan Jyoti Bima Yojana", emoji: "🌟",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh life insurance — only ₹436/year (₹1.19 per day)",
    tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    applyMode: "both", time: "5 min", helpline: "1800-180-1111",
    documents: ["Aadhaar linked to bank account", "Bank account"],
    steps: [
      "Visit your bank OR use net banking/mobile app",
      "Ask for 'PMJJBY enrollment'",
      "Fill one-page form — takes 5 minutes",
      "₹436 auto-deducted from account every May 25",
      "Nominee gets ₹2 lakh if policyholder passes away",
      "Auto-renews every year"
    ],
    offline: "Any bank branch — same counter as PMSBY",
    applyUrl: "https://www.jansuraksha.gov.in/Forms-PMJJBY.aspx",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 50,
  },
  {
    id: 5, name: "National Scholarship Portal", emoji: "🎓",
    ministry: "Ministry of Education",
    benefit: "₹10,000–₹1,20,000/year for studies — direct to student's bank account",
    tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online", time: "30 min", helpline: "0120-6619540",
    documents: ["Aadhaar Card", "Last year marksheet", "Income Certificate", "Caste Certificate (if SC/ST/OBC)", "Bank account in student's name", "College bonafide certificate"],
    steps: [
      "Go to scholarships.gov.in — click 'New Registration'",
      "Select your state, scholarship type and category",
      "Fill personal and Aadhaar details",
      "Upload all documents (JPG/PDF under 200KB each)",
      "Fill academic details and bank account number",
      "Submit before deadline — note your application ID",
      "Check status after 30 days on same portal"
    ],
    offline: "Visit your school/college — scholarship coordinator will help apply",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) => f.occupation === "student" && (f.income === "below1L" || f.income === "1to2L" || f.income === "2to5L"),
  },
  {
    id: 6, name: "MUDRA Yojana – Shishu Loan", emoji: "🏪",
    ministry: "Ministry of Finance",
    benefit: "Loan up to ₹50,000 — no collateral, no guarantor needed",
    tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "offline", time: "1–2 weeks", helpline: "1800-180-1111",
    documents: ["Aadhaar Card", "PAN Card", "Business address proof", "2 passport photos", "Bank statement (6 months)", "Simple business plan"],
    steps: [
      "Visit nearest bank or microfinance institution",
      "Ask for 'MUDRA Shishu loan application form'",
      "Fill business details and submit documents",
      "Bank may visit your business location",
      "Loan approved in 7–10 working days",
      "Amount credited directly to your account",
      "Repay over 3–5 years at low interest"
    ],
    offline: "Must visit bank in person — SBI and Bank of Baroda process fastest",
    applyUrl: "https://www.mudra.org.in/Home/PMMY",
    condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 7, name: "e-Shram Card", emoji: "👷",
    ministry: "Ministry of Labour",
    benefit: "₹2 lakh accident insurance + access to 50+ welfare schemes with one card",
    tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    applyMode: "online", time: "10 min", helpline: "14434",
    documents: ["Aadhaar Card linked to mobile", "Bank account number", "IFSC code"],
    steps: [
      "Go to eshram.gov.in — click 'Register on e-Shram'",
      "Enter your Aadhaar-linked mobile number",
      "Enter OTP received on mobile",
      "Aadhaar details auto-filled — verify them",
      "Add occupation and bank details",
      "Submit — e-Shram card generated instantly",
      "Download your UAN card — valid lifelong"
    ],
    offline: "Visit nearest CSC center — they register for free or ₹20 max",
    applyUrl: "https://eshram.gov.in/home/registerNow",
    condition: (f: any) => f.occupation === "unemployed" || f.occupation === "farmer" || f.occupation === "business",
  },
  {
    id: 8, name: "PM Ujjwala Yojana", emoji: "🔥",
    ministry: "Ministry of Petroleum",
    benefit: "Free LPG gas connection + ₹1,600 assistance for cylinder and stove",
    tag: "Subsidy", tagColor: "bg-red-100 text-red-700 border-red-200",
    applyMode: "offline", time: "1–2 weeks", helpline: "1906",
    documents: ["Aadhaar Card", "BPL Ration Card or BPL proof", "Bank passbook", "Passport photo", "Self-declaration of no LPG connection"],
    steps: [
      "Visit nearest LPG distributor (HP/Bharat/Indane gas agency)",
      "Ask for 'Ujjwala Yojana KYC form'",
      "Fill form with personal and bank details",
      "Submit all documents with photos",
      "Distributor verifies and sends to company",
      "Connection approved in 7–10 days",
      "First cylinder delivered to home — free"
    ],
    offline: "Go directly to your nearest gas agency — cannot be applied online",
    applyUrl: "https://www.pmuy.gov.in/ujjwala2.html",
    condition: (f: any) => f.gender === "female" && (f.special?.includes("bpl") || f.income === "below1L"),
  },
  {
    id: 9, name: "PM Awas Yojana – Gramin", emoji: "🏡",
    ministry: "Ministry of Rural Development",
    benefit: "₹1.2–1.3 lakh grant to build pucca house — no repayment needed",
    tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200",
    applyMode: "offline", time: "1–3 months", helpline: "1800-11-6446",
    documents: ["Aadhaar Card", "BPL Ration Card", "Land ownership proof", "Bank account linked to Aadhaar", "MGNREGS Job Card", "Passport photo"],
    steps: [
      "Contact your Gram Panchayat office first",
      "Ask to be included in PMAY-G waiting list",
      "Gram Sabha selects beneficiaries from SECC data",
      "If selected — you get an SMS notification",
      "Open AwaasSoft account through Panchayat",
      "First ₹40,000 released after foundation is laid",
      "Second ₹40,000 after walls, third after roof",
      "Total ₹1.2 lakh in 3 installments"
    ],
    offline: "Must apply through Gram Panchayat — no online option for new applications",
    applyUrl: "https://pmayg.nic.in",
    condition: (f: any) => f.special?.includes("bpl") || f.income === "below1L",
  },
  {
    id: 10, name: "PM Kaushal Vikas Yojana 4.0", emoji: "🛠️",
    ministry: "Ministry of Skill Development",
    benefit: "Free skill training (3–6 months) + ₹8,000 reward + job placement help",
    tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200",
    applyMode: "online", time: "15 min", helpline: "088000-55555",
    documents: ["Aadhaar Card", "10th/12th marksheet or any education proof", "Bank account", "Passport photo", "Mobile number"],
    steps: [
      "Go to pmkvyofficial.org — click 'Find Training Centre'",
      "Enter your location and preferred skill or trade",
      "Select nearest training center and course",
      "Register online with Aadhaar details",
      "Training center calls within 3–5 days",
      "Attend FREE training for 3–6 months",
      "Clear assessment — get NSDC certificate",
      "₹8,000 reward credited to your bank account"
    ],
    offline: "Visit nearest PMKVY training center directly",
    applyUrl: "https://www.pmkvyofficial.org/find-training-center",
    condition: (f: any) => f.occupation === "unemployed" || f.occupation === "student",
  },
  {
    id: 11, name: "PM Fasal Bima Yojana", emoji: "🌦️",
    ministry: "Ministry of Agriculture",
    benefit: "Crop insurance against floods, drought, pests — very low premium",
    tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    applyMode: "both", time: "20 min", helpline: "1800-200-7710",
    documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"],
    steps: ["Go to pmfby.gov.in or nearest bank", "Register as farmer with Aadhaar", "Select your crop and area", "Pay small premium", "Get policy number via SMS"],
    offline: "Visit nearest bank branch before crop season starts",
    applyUrl: "https://pmfby.gov.in/farmerRegistrationNewUser",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 12, name: "Kisan Credit Card", emoji: "💳",
    ministry: "Ministry of Agriculture",
    benefit: "Credit up to ₹3 lakh at just 4% interest for farming expenses",
    tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "offline", time: "1–2 weeks", helpline: "1800-425-1541",
    documents: ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"],
    steps: ["Visit nearest bank with land documents", "Ask for KCC application form", "Fill and submit with documents", "Bank verifies land ownership", "KCC card issued in 7–10 days"],
    offline: "SBI and cooperative banks process KCC fastest",
    applyUrl: "https://www.sbi.co.in/web/agri-rural/agriculture-banking/crop-loan/kisan-credit-card",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 13, name: "MUDRA Kishore Loan", emoji: "📈",
    ministry: "Ministry of Finance",
    benefit: "Loan ₹50,000–₹5 lakh for businesses that are already running",
    tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "offline", time: "2–3 weeks", helpline: "1800-180-1111",
    documents: ["Aadhaar Card", "PAN Card", "2 years business proof", "Bank Statement", "IT Returns"],
    steps: ["Visit bank where you have your business account", "Request MUDRA Kishore loan form", "Submit 2 years business documents", "Bank evaluates business performance", "Loan sanctioned in 2–3 weeks"],
    offline: "Your existing business bank gives fastest approval",
    applyUrl: "https://www.mudra.org.in/Home/PMMY",
    condition: (f: any) => f.occupation === "business",
  },
  {
    id: 14, name: "Stand Up India — SC/ST/Women", emoji: "💪",
    ministry: "Ministry of Finance",
    benefit: "Loan ₹10 lakh–₹1 crore for first enterprise — SC/ST/Women only",
    tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "both", time: "3–4 weeks", helpline: "1800-180-1111",
    documents: ["Aadhaar", "PAN", "Business Plan", "Caste/Woman certificate", "Bank Statement"],
    steps: ["Apply at standupmitra.in or visit bank directly", "Submit business plan and identity documents", "Bank evaluates and may visit site", "Loan approved — no collateral up to ₹1Cr", "Repay over 7 years"],
    offline: "Any scheduled commercial bank — ask for Stand Up India desk",
    applyUrl: "https://www.standupmitra.in/Login/Register",
    condition: (f: any) => (f.category === "sc" || f.category === "st" || f.special?.includes("woman_entrepreneur")) && f.occupation === "business",
  },
  {
    id: 15, name: "PMEGP Self Employment", emoji: "🏭",
    ministry: "Ministry of MSME",
    benefit: "15–35% subsidy on project cost up to ₹50 lakh for new businesses",
    tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200",
    applyMode: "online", time: "1–2 months", helpline: "1800-121-6763",
    documents: ["Aadhaar Card", "PAN Card", "8th Pass Certificate", "Project Report", "Caste Certificate"],
    steps: ["Apply at kviconline.gov.in/pmegpeportal", "Fill detailed project report", "Interview at KVIC/KVIB office", "Loan sanctioned through bank", "Subsidy credited after 3 years"],
    offline: "Visit nearest KVIC/KVIB district office — they guide entire process",
    applyUrl: "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp",
    condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 16, name: "Udyam MSME Registration", emoji: "🔖",
    ministry: "Ministry of MSME",
    benefit: "Free certificate — unlocks 50+ subsidies, priority loans, govt tenders",
    tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    applyMode: "online", time: "10 min", helpline: "1800-111-955",
    documents: ["Aadhaar Card", "PAN Card", "Business bank account"],
    steps: ["Go to udyamregistration.gov.in", "Click 'For New Entrepreneurs'", "Enter Aadhaar and PAN — auto-verified", "Fill business details", "Submit — certificate generated instantly", "Download Udyam certificate — valid lifelong"],
    offline: "CSC centers help for ₹50–100 service fee",
    applyUrl: "https://udyamregistration.gov.in/Government-India/Ministry-MSME-registration.htm",
    condition: (f: any) => f.occupation === "business",
  },
  {
    id: 17, name: "PM Awas Yojana – Urban", emoji: "🏠",
    ministry: "Ministry of Housing",
    benefit: "Home loan interest subsidy up to ₹2.67 lakh for buying first home",
    tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200",
    applyMode: "both", time: "1–2 months", helpline: "1800-11-3377",
    documents: ["Aadhaar Card", "Income Proof", "Property Documents", "Bank Statement"],
    steps: ["Apply at pmaymis.gov.in or through any bank", "Submit income and property documents", "Bank verifies eligibility", "Subsidy approved and credited to loan account", "Your EMI reduces automatically"],
    offline: "Any housing finance company or bank offering home loans",
    applyUrl: "https://pmaymis.gov.in",
    condition: (f: any) => f.income === "below1L" || f.income === "1to2L",
  },
  {
    id: 18, name: "Sukanya Samriddhi Yojana", emoji: "👧",
    ministry: "Ministry of Finance",
    benefit: "8.2% interest savings for girl child — highest safe savings in India",
    tag: "Savings", tagColor: "bg-pink-100 text-pink-700 border-pink-200",
    applyMode: "offline", time: "30 min", helpline: "1800-266-6868",
    documents: ["Girl child's birth certificate", "Parent's Aadhaar and PAN", "Passport photo of parent"],
    steps: ["Visit Post Office or any authorized bank", "Ask for Sukanya Samriddhi Yojana form", "Fill with girl's and parent's details", "Deposit minimum ₹250 to open account", "Deposit any amount yearly (max ₹1.5L)", "Account matures when girl turns 21"],
    offline: "Post Office nearest to you — fastest and easiest",
    applyUrl: "https://www.indiapost.gov.in/Financial/Pages/Content/Sukanya-Samridhi-Yojana.aspx",
    condition: (f: any) => f.gender === "female" && Number(f.age) <= 35,
  },
  {
    id: 19, name: "PM Matru Vandana Yojana", emoji: "🤱",
    ministry: "Ministry of Women & Child Dev",
    benefit: "₹6,500 cash for first pregnancy — 3 installments direct to bank",
    tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200",
    applyMode: "offline", time: "20 min", helpline: "1800-111-565",
    documents: ["Aadhaar Card", "MCP Card from Anganwadi", "Bank passbook", "Pregnancy registration certificate"],
    steps: ["Register pregnancy at nearest Anganwadi center", "Get MCP (Mother Child Protection) card", "Visit Anganwadi with Aadhaar and bank passbook", "Fill PMMVY form with Anganwadi worker's help", "₹3,000 after registration, ₹2,000 after 6 months, ₹1,500 after delivery"],
    offline: "Apply ONLY through Anganwadi center — no online option",
    applyUrl: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    condition: (f: any) => f.gender === "female" && Number(f.age) >= 19 && Number(f.age) <= 45,
  },
  {
    id: 20, name: "Atal Pension Yojana", emoji: "👴",
    ministry: "Ministry of Finance",
    benefit: "₹1,000–₹5,000/month guaranteed pension after age 60 — govt contributes too",
    tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200",
    applyMode: "both", time: "10 min", helpline: "1800-110-069",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
    steps: ["Visit bank branch or use net banking/mobile app", "Ask for APY enrollment form", "Choose pension amount (₹1K to ₹5K/month)", "Auto-debit set up from your account", "Small monthly contribution based on your age", "Get pension from age 60 for life"],
    offline: "Any bank branch — younger you enroll, lower your monthly contribution",
    applyUrl: "https://enps.nsdl.com/eNPS/National_Pension_System.html",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40,
  },
  {
    id: 21, name: "PM Jan Dhan Yojana", emoji: "🏦",
    ministry: "Ministry of Finance",
    benefit: "Zero-balance bank account + ₹10,000 overdraft + RuPay card + ₹2L insurance",
    tag: "Banking", tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    applyMode: "offline", time: "30 min", helpline: "1800-11-0001",
    documents: ["Aadhaar Card", "Passport photo"],
    steps: ["Visit any bank branch or Bank Mitra", "Ask for Jan Dhan account opening form", "Fill form with Aadhaar details", "Submit photo and sign form", "Account opens same day", "RuPay debit card delivered in 7–10 days"],
    offline: "Visit bank branch or nearest Bank Mitra/CSC in your village",
    applyUrl: "https://www.pmjdy.gov.in/account",
    condition: (f: any) => f.income === "below1L" || f.income === "1to2L",
  },
  {
    id: 22, name: "MGNREGS Job Card", emoji: "⛏️",
    ministry: "Ministry of Rural Development",
    benefit: "100 days guaranteed work at ₹220–₹357/day — your legal right",
    tag: "Employment", tagColor: "bg-lime-100 text-lime-700 border-lime-200",
    applyMode: "offline", time: "15 days", helpline: "1800-111-555",
    documents: ["Aadhaar Card", "Residence Proof", "Passport Photo", "Bank Account"],
    steps: ["Visit Gram Panchayat office with documents", "Fill Job Card application form", "Gram Panchayat verifies your residence", "Job Card issued within 15 days", "Demand work at Panchayat — must be given in 15 days", "Payment to bank within 15 days of work"],
    offline: "Gram Panchayat office only — village-level program",
    applyUrl: "https://nrega.nic.in/MGNREGA_new/Nrega_JSP_Page/JobCardApplicationForm.aspx",
    condition: (f: any) => f.income === "below1L" || f.occupation === "unemployed",
  },
  {
    id: 23, name: "Post-Matric Scholarship SC", emoji: "📖",
    ministry: "Ministry of Social Justice",
    benefit: "Full tuition fee + maintenance allowance — for SC students",
    tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online", time: "30 min", helpline: "0120-6619540",
    documents: ["Aadhaar Card", "Caste Certificate", "Marksheets", "Income Certificate (<₹2.5L)", "Bank Account"],
    steps: ["Go to scholarships.gov.in", "Register with Aadhaar", "Select SC Post-Matric scholarship", "Upload documents", "Submit before October deadline"],
    offline: "School/college scholarship coordinator can help",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) => f.category === "sc" && f.occupation === "student",
  },
  {
    id: 24, name: "Post-Matric Scholarship ST", emoji: "🏫",
    ministry: "Ministry of Tribal Affairs",
    benefit: "Full tuition + living allowance — for ST/Tribal students",
    tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online", time: "30 min", helpline: "0120-6619540",
    documents: ["Aadhaar Card", "Tribe Certificate", "Marksheets", "Income Certificate", "Bank Account"],
    steps: ["Go to scholarships.gov.in", "Select ST Post-Matric scholarship", "Fill details and upload documents", "Submit before October deadline", "Track status after 30 days"],
    offline: "Tribal welfare office in your district can assist",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) => f.category === "st" && f.occupation === "student",
  },
  {
    id: 25, name: "PM Shram Yogi Maandhan", emoji: "🔧",
    ministry: "Ministry of Labour",
    benefit: "₹3,000/month pension for unorganised workers after age 60",
    tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200",
    applyMode: "both", time: "10 min", helpline: "1800-267-6888",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
    steps: ["Visit nearest CSC center or maandhan.in", "Enter Aadhaar and bank details", "Choose monthly contribution amount", "Auto-debit activated", "Govt matches your contribution equally", "Get ₹3,000/month pension at age 60"],
    offline: "CSC centers enroll for free — bring Aadhaar and bank passbook",
    applyUrl: "https://maandhan.in/shramyogi",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 && (f.income === "below1L" || f.income === "1to2L"),
  },
  {
    id: 26, name: "PM SVANidhi — Street Vendor Loan", emoji: "🛺",
    ministry: "Ministry of Housing & Urban Affairs",
    benefit: "Loan ₹10,000–₹50,000 for street vendors — no collateral needed",
    tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "both", time: "1 week", helpline: "1800-11-1979",
    documents: ["Aadhaar Card", "Vending Certificate or Letter from ULB", "Bank Account"],
    steps: ["Get vending certificate from municipal office first", "Apply at pmsvanidhi.mohua.gov.in or visit bank", "Submit vending certificate and Aadhaar", "₹10,000 first loan approved in 5–7 days", "Repay on time — get ₹20,000 next", "Timely repayment gets ₹1,200 annual cashback"],
    offline: "Visit nearest SHG bank or microfinance institution",
    applyUrl: "https://pmsvanidhi.mohua.gov.in",
    condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 27, name: "PM Vishwakarma Yojana", emoji: "⚒️",
    ministry: "Ministry of MSME",
    benefit: "₹15,000 toolkit + ₹3L loan at 5% + free training for artisans",
    tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200",
    applyMode: "online", time: "1 month", helpline: "1800-267-7777",
    documents: ["Aadhaar Card", "Bank Account", "Mobile Number", "Photo of your craft/work"],
    steps: ["Go to pmvishwakarma.gov.in", "Check if your trade is in 18 eligible crafts", "Register with Aadhaar and OTP", "Complete 5-day basic training nearby", "Get PM Vishwakarma certificate", "Apply for ₹15,000 toolkit grant", "Eligible for ₹1L then ₹2L loan at 5%"],
    offline: "CSC center or District Industry Centre (DIC) in your city",
    applyUrl: "https://pmvishwakarma.gov.in",
    condition: (f: any) => f.occupation === "business" || f.occupation === "employed",
  },
  {
    id: 28, name: "Dr. Ambedkar OBC Scholarship", emoji: "🎒",
    ministry: "Ministry of Social Justice",
    benefit: "Tuition fee + maintenance allowance for OBC postgrad students",
    tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online", time: "30 min", helpline: "0120-6619540",
    documents: ["Aadhaar Card", "OBC Certificate", "Marksheets", "Income Certificate (<₹1L)", "Bank Account"],
    steps: ["Go to scholarships.gov.in", "Select OBC Post-Matric scholarship", "Fill academic and income details", "Upload documents", "Submit before deadline"],
    offline: "College welfare officer helps with OBC scholarship applications",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) => f.category === "obc" && f.occupation === "student",
  },
  {
    id: 29, name: "Divyangjan Scholarship", emoji: "♿",
    ministry: "Ministry of Social Justice",
    benefit: "₹14,000–₹35,000/year for students with disabilities",
    tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online", time: "30 min", helpline: "0120-6619540",
    documents: ["Disability Certificate (40%+)", "Aadhaar Card", "Marksheets", "Bank Account"],
    steps: ["Get disability certificate from district hospital first", "Go to scholarships.gov.in", "Select Disability scholarship", "Upload disability certificate and documents", "Submit before November deadline"],
    offline: "School/college disability coordinator can assist",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) => f.special?.includes("disabled") && f.occupation === "student",
  },
  {
    id: 30, name: "Indira Gandhi Old Age Pension", emoji: "👵",
    ministry: "Ministry of Rural Development",
    benefit: "₹200–₹500/month pension for BPL senior citizens above 60 years",
    tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200",
    applyMode: "offline", time: "1 month", helpline: "1800-111-555",
    documents: ["Aadhaar Card", "BPL Card", "Age Proof", "Bank Account"],
    steps: ["Visit your Gram Panchayat or Municipal office", "Ask for IGNOAPS application form", "Fill and submit with BPL and age proof", "Officer verifies and forwards to district", "Pension starts in 30–60 days", "Credited to bank every month"],
    offline: "Apply only through Gram Panchayat or Urban Local Body",
    applyUrl: "https://nsap.nic.in",
    condition: (f: any) => Number(f.age) >= 60 && (f.special?.includes("bpl") || f.income === "below1L"),
  },
];

// ── Main Component ────────────────────────────────────────
function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [expandedView, setExpandedView] = useState<"steps" | "docs">("steps");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const l = localStorage.getItem("lang") || "en";
    setLang(l);
  }, []);

  const t = T[lang] || T.en;

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

  useEffect(() => {
    if (matched.length > 0) {
      localStorage.setItem("matchedSchemes", JSON.stringify(
        matched.map(s => ({ name: s.name, benefit: s.benefit, tag: s.tag }))
      ));
    }
  }, []);

  const tags = ["all", ...Array.from(new Set(matched.map((s) => s.tag)))];
  const filtered = filter === "all" ? matched : matched.filter((s) => s.tag === filter);

  const sorted = [...filtered].sort((a, b) => {
    const score = (x: any) => x.applyMode === "online" ? 0 : x.applyMode === "both" ? 1 : 2;
    return score(a) - score(b);
  });

  const shareOnWhatsApp = () => {
    const names = matched.slice(0, 5).map(s => `• ${s.name}`).join("\n");
    const msgs: any = {
      en: `🇮🇳 Yojana AI found ${matched.length} government benefits I qualify for:\n\n${names}\n\nCheck yours: https://yojana-ai-nine.vercel.app`,
      hi: `🇮🇳 Yojana AI ne mujhe ${matched.length} sarkari yojanaon ke liye eligible bataya:\n\n${names}\n\nAap bhi check karein: https://yojana-ai-nine.vercel.app`,
      mr: `🇮🇳 Yojana AI ne mala ${matched.length} sarkari yojananasathi paatra saangitle:\n\n${names}\n\nTumhihi tpasa kara: https://yojana-ai-nine.vercel.app`,
    };
    window.open(`https://wa.me/?text=${encodeURIComponent(msgs[lang] || msgs.en)}`, "_blank");
  };

  const applyModeLabel = (mode: string) => {
    if (mode === "online") return t.online;
    if (mode === "offline") return t.offline;
    return t.both;
  };

  const applyModeColor = (mode: string) => {
    if (mode === "online") return "bg-green-50 text-green-700";
    if (mode === "offline") return "bg-orange-50 text-orange-700";
    return "bg-blue-50 text-blue-700";
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Govt strip */}
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4">{t.govStrip}</div>

      {/* Nav */}
      <nav className="bg-white border-b-4 border-[#f97316] shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <button onClick={() => router.push("/home")} className="text-[#1a3a6b] hover:underline">{t.home}</button>
            <span className="text-gray-300">›</span>
            <button onClick={() => router.push("/check")} className="text-[#1a3a6b] hover:underline">{t.edit}</button>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500">{t.results}</span>
          </div>
          <button onClick={() => router.push("/chat")} className="bg-[#1a3a6b] text-white text-sm px-4 py-2 rounded hover:bg-[#15306b] transition-all">
            {t.askAI}
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Result banner */}
        {matched.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="text-3xl">🎯</span>
              <div>
                <div className="font-bold text-green-800 text-lg">
                  {matched.length} {t.found} {form.name}!
                </div>
                <div className="text-green-600 text-sm">{t.applyNote}</div>
              </div>
            </div>
            <button onClick={shareOnWhatsApp}
              className="w-full bg-[#25D366] hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all">
              {t.share}
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-5">
            <div className="text-4xl mb-2">😔</div>
            <p className="text-yellow-800 font-semibold">{t.noResult}</p>
            <button onClick={() => router.push("/check")} className="mt-3 text-[#1a3a6b] underline text-sm">{t.editLink}</button>
          </div>
        )}

        {/* User summary */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4 flex flex-wrap gap-2">
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

        {/* Filter tabs */}
        {tags.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {tags.map((tag) => (
              <button key={tag} onClick={() => setFilter(tag)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${filter === tag ? "bg-[#1a3a6b] text-white border-[#1a3a6b]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b]"}`}>
                {tag === "all" ? `${t.filter} (${matched.length})` : tag}
              </button>
            ))}
          </div>
        )}

        {/* Scheme cards */}
        <div className="space-y-4">
          {sorted.map((scheme: any) => (
            <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{scheme.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#1a3a6b] text-base leading-tight">{scheme.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{scheme.ministry}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${scheme.tagColor}`}>
                    {scheme.tag}
                  </span>
                </div>

                {/* Benefit */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <div className="text-blue-400 text-xs font-semibold mb-0.5 uppercase tracking-wide">{t.benefit}</div>
                  <div className="text-blue-900 font-semibold text-sm">{scheme.benefit}</div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${applyModeColor(scheme.applyMode)}`}>
                    {applyModeLabel(scheme.applyMode)}
                  </span>
                  <span className="text-gray-400 text-xs">⏱ {scheme.time}</span>
                  {scheme.helpline && (
                    <a href={`tel:${scheme.helpline}`} className="text-[#1a3a6b] text-xs hover:underline">
                      📞 {scheme.helpline}
                    </a>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-green-700 text-sm font-semibold">{t.eligible}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (expandedId === scheme.id) {
                          setExpandedId(null);
                        } else {
                          setExpandedId(scheme.id);
                          setExpandedView("steps");
                        }
                      }}
                      className="text-gray-500 hover:text-[#1a3a6b] text-xs border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#1a3a6b] transition-all"
                    >
                      {expandedId === scheme.id && expandedView === "steps" ? t.hideGuide : t.howToApply}
                    </button>
                    <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer"
                      className="bg-[#f97316] hover:bg-orange-600 text-white font-bold text-sm px-4 py-2 rounded-lg transition-all flex items-center gap-1">
                      {t.applyNow}
                    </a>
                  </div>
                </div>
              </div>

              {/* Expanded */}
              {expandedId === scheme.id && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {/* Tab switcher */}
                  <div className="flex border-b border-gray-200">
                    <button onClick={() => setExpandedView("steps")}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-all
                        ${expandedView === "steps" ? "bg-white text-[#1a3a6b] border-b-2 border-[#1a3a6b]" : "text-gray-400"}`}>
                      {t.stepGuide}
                    </button>
                    <button onClick={() => setExpandedView("docs")}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-all
                        ${expandedView === "docs" ? "bg-white text-[#1a3a6b] border-b-2 border-[#1a3a6b]" : "text-gray-400"}`}>
                      {t.docsNeeded}
                    </button>
                  </div>

                  <div className="px-5 py-4">
                    {expandedView === "steps" && (
                      <div>
                        <div className="space-y-2.5 mb-4">
                          {scheme.steps.map((step: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <span className="w-6 h-6 bg-[#1a3a6b] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {i + 1}
                              </span>
                              <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                            </div>
                          ))}
                        </div>
                        {scheme.offline && (
                          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3">
                            <div className="text-orange-600 text-xs font-bold mb-1">{t.offlineOption}</div>
                            <p className="text-orange-800 text-sm">{scheme.offline}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {expandedView === "docs" && (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {scheme.documents.map((doc: string, i: number) => (
                            <span key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 flex items-center gap-1.5">
                              <span className="text-orange-400">📄</span> {doc}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs">{t.tip}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Ask AI */}
        {matched.length > 0 && (
          <div onClick={() => router.push("/chat")}
            className="mt-6 cursor-pointer bg-[#1a3a6b] rounded-xl p-5 flex items-center gap-4 hover:bg-[#15306b] transition-all group">
            <span className="text-4xl">🤖</span>
            <div>
              <div className="font-bold text-white">{t.askAIBanner}</div>
              <div className="text-blue-200 text-sm">{t.askAIDesc}</div>
            </div>
            <span className="ml-auto text-orange-300 text-xl group-hover:translate-x-1 transition-transform">→</span>
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
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}