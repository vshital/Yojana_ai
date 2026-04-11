"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { translations } from "@/lib/lang";

const ALL_SCHEMES = [
  {
    id: 1,
    name: "PM-Kisan Samman Nidhi",
    emoji: "🌾",
    ministry: "Ministry of Agriculture",
    benefit: "₹6,000/year direct to bank — ₹2,000 every 4 months",
    tag: "Cash Transfer",
    tagColor: "bg-green-100 text-green-700 border-green-200",
    applyMode: "online",
    time: "15 minutes",
    helpline: "155261",
    documents: [
      "Aadhaar Card",
      "Land Records (Khata/Khasra/7-12)",
      "Bank Passbook (linked to Aadhaar)",
      "Mobile Number"
    ],
    steps: [
      "Go to pmkisan.gov.in OR visit nearest CSC center",
      "Click 'Farmers Corner' → 'New Farmer Registration'",
      "Select Rural or Urban farmer, enter Aadhaar number & state",
      "Fill your personal details, land details and bank account",
      "Submit — note your reference number",
      "First installment arrives within 2-3 months"
    ],
    offline: "Visit nearest CSC (Common Service Centre) with all documents — they will register for free",
    applyUrl: "https://pmkisan.gov.in/RegistrationFormNew.aspx",
    condition: (f: any) => f.occupation === "farmer",
  },
  {
    id: 2,
    name: "Ayushman Bharat – PMJAY",
    emoji: "🏥",
    ministry: "Ministry of Health",
    benefit: "₹5 lakh free hospital treatment per year — 1,500+ hospitals",
    tag: "Health",
    tagColor: "bg-blue-100 text-blue-700 border-blue-200",
    applyMode: "both",
    time: "10 minutes",
    helpline: "14555",
    documents: [
      "Aadhaar Card",
      "Ration Card (if available)",
      "Mobile Number"
    ],
    steps: [
      "First check eligibility at beneficiary.nha.gov.in",
      "Enter your mobile number or Aadhaar to check",
      "If eligible — go to any empanelled hospital",
      "Show Aadhaar at hospital's Ayushman desk",
      "Hospital verifies and issues Ayushman card free",
      "Treatment starts immediately — no payment needed"
    ],
    offline: "Visit any government hospital or Jan Aushadhi Kendra — they have Ayushman enrollment counters",
    applyUrl: "https://beneficiary.nha.gov.in",
    condition: (f: any) =>
      f.income === "below1L" || f.income === "1to2L" || f.special?.includes("bpl"),
  },
  {
    id: 3,
    name: "PM Suraksha Bima Yojana",
    emoji: "🛡️",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh accident insurance — costs only ₹20/year (auto-debit)",
    tag: "Insurance",
    tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    applyMode: "both",
    time: "5 minutes",
    helpline: "1800-180-1111",
    documents: [
      "Aadhaar Card linked to bank account",
      "Bank account with minimum balance"
    ],
    steps: [
      "Visit your bank branch OR use your bank's mobile app",
      "Ask for 'PMSBY enrollment' at the counter",
      "Fill the one-page form with Aadhaar and bank details",
      "₹20 auto-deducted from your account every June",
      "You get SMS confirmation — save it",
      "Valid for 1 year — auto-renews every year"
    ],
    offline: "Walk into any bank branch with Aadhaar — takes 5 minutes at the counter",
    applyUrl: "https://www.myscheme.gov.in/schemes/pmsby",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 70,
  },
  {
    id: 4,
    name: "PM Jeevan Jyoti Bima Yojana",
    emoji: "🌟",
    ministry: "Ministry of Finance",
    benefit: "₹2 lakh life insurance — costs only ₹436/year (₹1.19/day)",
    tag: "Insurance",
    tagColor: "bg-teal-100 text-teal-700 border-teal-200",
    applyMode: "both",
    time: "5 minutes",
    helpline: "1800-180-1111",
    documents: [
      "Aadhaar Card linked to bank account",
      "Bank account with minimum balance"
    ],
    steps: [
      "Visit your bank branch OR use mobile banking app",
      "Ask for 'PMJJBY enrollment'",
      "Fill one-page form — takes 5 minutes",
      "₹436 auto-deducted from account every May 25",
      "Nominee gets ₹2 lakh if policyholder dies",
      "Auto-renews every year"
    ],
    offline: "Any bank branch with Aadhaar — same counter as PMSBY",
    applyUrl: "https://www.myscheme.gov.in/schemes/pmjjby",
    condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 50,
  },
  {
    id: 5,
    name: "National Scholarship Portal",
    emoji: "🎓",
    ministry: "Ministry of Education",
    benefit: "₹10,000–₹1,20,000/year for studies — direct to bank",
    tag: "Scholarship",
    tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200",
    applyMode: "online",
    time: "30 minutes",
    helpline: "0120-6619540",
    documents: [
      "Aadhaar Card",
      "Last year marksheet",
      "Income Certificate (from tehsil/taluka office)",
      "Caste Certificate (if SC/ST/OBC)",
      "Bank account in student's name",
      "Current institution's bonafide certificate"
    ],
    steps: [
      "Go to scholarships.gov.in — click 'New Registration'",
      "Select your state, scholarship type and category",
      "Fill personal details with Aadhaar",
      "Upload all required documents (JPG/PDF under 200KB)",
      "Fill academic details and bank account",
      "Submit before deadline — note application ID",
      "Track status on same portal after 30 days"
    ],
    offline: "Visit your school/college — they have scholarship coordinators who help students apply",
    applyUrl: "https://scholarships.gov.in/fresh/newstdRegfrmInstruction",
    condition: (f: any) =>
      f.occupation === "student" &&
      (f.income === "below1L" || f.income === "1to2L" || f.income === "2to5L"),
  },
  {
    id: 6,
    name: "MUDRA Yojana – Shishu Loan",
    emoji: "🏪",
    ministry: "Ministry of Finance",
    benefit: "Loan up to ₹50,000 — no collateral, no guarantor needed",
    tag: "Loan",
    tagColor: "bg-purple-100 text-purple-700 border-purple-200",
    applyMode: "offline",
    time: "1-2 weeks (bank processing)",
    helpline: "1800-180-1111",
    documents: [
      "Aadhaar Card",
      "PAN Card",
      "Business address proof (rent agreement/electricity bill)",
      "2 passport photos",
      "Bank statement (6 months)",
      "Business plan (simple 1-page description)"
    ],
    steps: [
      "Visit any nationalized bank, SBI, or microfinance institution",
      "Ask for 'MUDRA Shishu loan application form'",
      "Fill the form with your business details",
      "Submit documents — bank may visit your business location",
      "Loan approved in 7-10 working days",
      "Amount credited directly to your account",
      "Repay in 3-5 years at low interest rate"
    ],
    offline: "Must visit bank in person — bring all documents. SBI and Bank of Baroda process fastest",
    applyUrl: "https://www.myscheme.gov.in/schemes/pmmy",
    condition: (f: any) =>
      f.occupation === "business" || f.occupation === "unemployed",
  },
  {
    id: 7,
    name: "e-Shram Card",
    emoji: "👷",
    ministry: "Ministry of Labour",
    benefit: "₹2 lakh accident insurance + single card for 50+ welfare schemes",
    tag: "Registration",
    tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200",
    applyMode: "online",
    time: "10 minutes",
    helpline: "14434",
    documents: [
      "Aadhaar Card linked to mobile number",
      "Bank account number",
      "IFSC code"
    ],
    steps: [
      "Go to eshram.gov.in — click 'Register on e-Shram'",
      "Enter Aadhaar-linked mobile number",
      "Enter OTP received on mobile",
      "Aadhaar details auto-filled — verify them",
      "Add occupation, bank details",
      "Submit — e-Shram card generated instantly",
      "Download your UAN card — valid lifelong"
    ],
    offline: "Visit nearest CSC center — they register for ₹0 to ₹20 service charge",
    applyUrl: "https://eshram.gov.in/home/registerNow",
    condition: (f: any) =>
      f.occupation === "unemployed" ||
      f.occupation === "farmer" ||
      f.occupation === "business",
  },
  {
    id: 8,
    name: "PM Ujjwala Yojana",
    emoji: "🔥",
    ministry: "Ministry of Petroleum",
    benefit: "Free LPG gas connection + ₹1,600 assistance for cylinder & stove",
    tag: "Subsidy",
    tagColor: "bg-red-100 text-red-700 border-red-200",
    applyMode: "offline",
    time: "1-2 weeks",
    helpline: "1906",
    documents: [
      "Aadhaar Card",
      "BPL Ration Card OR any BPL proof",
      "Bank account passbook",
      "Passport photo",
      "Self-declaration of no LPG connection"
    ],
    steps: [
      "Visit nearest LPG distributor (HP/Bharat/Indane gas agency)",
      "Ask for 'Ujjwala Yojana KYC form'",
      "Fill form with personal and bank details",
      "Submit documents with photos",
      "Distributor verifies and sends to company",
      "Connection approved in 7-10 days",
      "First cylinder delivered to your home free"
    ],
    offline: "Go directly to your nearest gas agency — this cannot be applied online",
    applyUrl: "https://www.myscheme.gov.in/schemes/pmuy",
    condition: (f: any) =>
      f.gender === "female" &&
      (f.special?.includes("bpl") || f.income === "below1L"),
  },
  {
    id: 9,
    name: "PM Awas Yojana – Gramin",
    emoji: "🏡",
    ministry: "Ministry of Rural Development",
    benefit: "₹1.2–1.3 lakh grant to build permanent pucca house — no repayment",
    tag: "Housing",
    tagColor: "bg-orange-100 text-orange-700 border-orange-200",
    applyMode: "offline",
    time: "1-3 months (government verification)",
    helpline: "1800-11-6446",
    documents: [
      "Aadhaar Card",
      "BPL Ration Card",
      "Land ownership proof",
      "Bank account linked to Aadhaar",
      "MGNREGS Job Card (if available)",
      "Passport photo"
    ],
    steps: [
      "Contact your Gram Panchayat office first",
      "Ask to be included in PMAY-G waiting list",
      "Gram Sabha selects beneficiaries from SECC data",
      "If selected — you get SMS notification",
      "Open AwaasSoft account through Panchayat",
      "First installment of ₹40,000 released after foundation",
      "Second ₹40,000 after walls, third after roof completion",
      "Total ₹1.2 lakh released in 3 installments"
    ],
    offline: "Must apply through Gram Panchayat only — no online option for new applications",
    applyUrl: "https://www.myscheme.gov.in/schemes/pmay-g",
    condition: (f: any) =>
      f.special?.includes("bpl") || f.income === "below1L",
  },
  {
    id: 10,
    name: "PM Kaushal Vikas Yojana 4.0",
    emoji: "🛠️",
    ministry: "Ministry of Skill Development",
    benefit: "Free skill training (3-6 months) + ₹8,000 reward + job placement help",
    tag: "Skill",
    tagColor: "bg-pink-100 text-pink-700 border-pink-200",
    applyMode: "online",
    time: "15 minutes to apply — training starts within 30 days",
    helpline: "088000-55555",
    documents: [
      "Aadhaar Card",
      "10th/12th marksheet OR any education proof",
      "Bank account",
      "Passport photo",
      "Mobile number"
    ],
    steps: [
      "Go to pmkvyofficial.org — click 'Find Training Centre'",
      "Enter your location and preferred skill/trade",
      "Select nearest training center and course",
      "Register online with Aadhaar details",
      "Training center calls you within 3-5 days",
      "Attend FREE training — 3 to 6 months",
      "Clear assessment — get NSDC certificate",
      "₹8,000 reward credited to your bank account"
    ],
    offline: "Visit nearest PMKVY training center directly — list at pmkvyofficial.org",
    applyUrl: "https://www.pmkvyofficial.org/find-training-center",
    condition: (f: any) =>
      f.occupation === "unemployed" || f.occupation === "student",
  },
  // Keep remaining 40 schemes with myscheme links
  { id: 11, name: "PM Fasal Bima Yojana", emoji: "🌦️", ministry: "Ministry of Agriculture", benefit: "Crop insurance against natural disasters, pests & disease", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", applyMode: "both", time: "20 minutes", helpline: "1800-200-7710", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"], steps: ["Visit pmfby.gov.in or nearest bank/CSC", "Register as farmer with Aadhaar", "Select your crop and coverage", "Pay small premium amount", "Get policy number via SMS"], offline: "Visit nearest bank branch before crop season starts", applyUrl: "https://www.myscheme.gov.in/schemes/pmfby", condition: (f: any) => f.occupation === "farmer" },
  { id: 12, name: "Kisan Credit Card", emoji: "💳", ministry: "Ministry of Agriculture", benefit: "Credit up to ₹3 lakh at 4% interest for farming needs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", applyMode: "offline", time: "1-2 weeks", helpline: "1800-425-1541", documents: ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"], steps: ["Visit nearest bank with land documents", "Ask for KCC application form", "Fill and submit with documents", "Bank verifies land ownership", "Card issued in 7-10 days"], offline: "Bank visit mandatory — SBI and cooperative banks process fastest", applyUrl: "https://www.myscheme.gov.in/schemes/kcc", condition: (f: any) => f.occupation === "farmer" },
  { id: 13, name: "National Scholarship SC Students", emoji: "📖", ministry: "Ministry of Social Justice", benefit: "Full tuition + maintenance allowance for SC students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", applyMode: "online", time: "30 minutes", helpline: "0120-6619540", documents: ["Aadhaar Card", "Caste Certificate", "Marksheets", "Income Certificate", "Bank Account"], steps: ["Go to scholarships.gov.in", "Register with Aadhaar", "Select SC Post-Matric scholarship", "Upload documents", "Submit before deadline"], offline: "School/college scholarship coordinator can help", applyUrl: "https://www.myscheme.gov.in/schemes/pmscs", condition: (f: any) => f.category === "sc" && f.occupation === "student" },
  { id: 14, name: "National Scholarship ST Students", emoji: "🏫", ministry: "Ministry of Tribal Affairs", benefit: "Full tuition + living allowance for ST students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", applyMode: "online", time: "30 minutes", helpline: "0120-6619540", documents: ["Aadhaar Card", "Tribe Certificate", "Marksheets", "Income Certificate", "Bank Account"], steps: ["Go to scholarships.gov.in", "Register with Aadhaar", "Select ST Post-Matric scholarship", "Upload documents", "Submit before October deadline"], offline: "Tribal welfare office in your district can assist", applyUrl: "https://www.myscheme.gov.in/schemes/pmsts", condition: (f: any) => f.category === "st" && f.occupation === "student" },
  { id: 15, name: "Dr. Ambedkar OBC Scholarship", emoji: "🎒", ministry: "Ministry of Social Justice", benefit: "Tuition fee + maintenance for OBC postgrad students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", applyMode: "online", time: "30 minutes", helpline: "0120-6619540", documents: ["Aadhaar Card", "OBC Certificate", "Marksheets", "Income Certificate (<₹1L)", "Bank Account"], steps: ["Go to scholarships.gov.in", "Register as new student", "Select OBC Post-Matric scholarship", "Fill academic and income details", "Upload and submit documents"], offline: "College welfare officer helps with OBC scholarship applications", applyUrl: "https://www.myscheme.gov.in/schemes/dapmsfobc", condition: (f: any) => f.category === "obc" && f.occupation === "student" },
  { id: 16, name: "MUDRA Kishore Loan", emoji: "📈", ministry: "Ministry of Finance", benefit: "Loan ₹50,000–₹5 lakh for growing businesses", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", applyMode: "offline", time: "2-3 weeks", helpline: "1800-180-1111", documents: ["Aadhaar Card", "PAN Card", "2-year Business Proof", "Bank Statement", "IT Returns"], steps: ["Visit bank where you have account", "Request MUDRA Kishore loan form", "Submit 2 years business documents", "Bank evaluates business performance", "Loan sanctioned in 2-3 weeks"], offline: "Same bank where your business account is — fastest approval", applyUrl: "https://www.myscheme.gov.in/schemes/pmmy", condition: (f: any) => f.occupation === "business" },
  { id: 17, name: "Stand Up India SC/ST/Women", emoji: "💪", ministry: "Ministry of Finance", benefit: "Loan ₹10 lakh–₹1 crore for first-time SC/ST/Women entrepreneurs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", applyMode: "both", time: "3-4 weeks", helpline: "1800-180-1111", documents: ["Aadhaar", "PAN", "Business Plan", "SC/ST or Woman proof", "Bank Statement"], steps: ["Apply at standupmitra.in OR visit bank directly", "Submit business plan and documents", "Bank evaluates and may visit site", "Loan sanctioned — collateral free upto ₹1Cr", "Repay over 7 years"], offline: "Any scheduled commercial bank branch — ask for Stand Up India desk", applyUrl: "https://www.myscheme.gov.in/schemes/sui", condition: (f: any) => (f.category === "sc" || f.category === "st" || f.special?.includes("woman_entrepreneur")) && f.occupation === "business" },
  { id: 18, name: "PMEGP Self Employment", emoji: "🏭", ministry: "Ministry of MSME", benefit: "15–35% subsidy on project cost up to ₹50 lakh", tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200", applyMode: "online", time: "1-2 months", helpline: "1800-121-6763", documents: ["Aadhaar Card", "PAN Card", "8th Pass Certificate", "Project Report", "Caste Certificate"], steps: ["Apply at kviconline.gov.in/pmegpeportal", "Fill detailed project report", "Interview at KVIC/KVIB office", "Loan sanctioned through bank", "Subsidy credited after 3 years of repayment"], offline: "Visit nearest KVIC/KVIB district office — they guide through entire process", applyUrl: "https://www.myscheme.gov.in/schemes/pmegp", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 19, name: "Udyam MSME Registration", emoji: "🔖", ministry: "Ministry of MSME", benefit: "Free certificate — unlocks 50+ subsidies, priority bank loans, govt tenders", tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", applyMode: "online", time: "10 minutes", helpline: "1800-111-955", documents: ["Aadhaar Card", "PAN Card", "Business bank account"], steps: ["Go to udyamregistration.gov.in", "Click 'For New Entrepreneurs'", "Enter Aadhaar and PAN — auto-verified", "Fill business details and NIC code", "Submit — certificate generated instantly", "Download Udyam certificate — valid lifelong"], offline: "CSC centers help with Udyam registration for ₹50-100 service fee", applyUrl: "https://www.myscheme.gov.in/schemes/uam", condition: (f: any) => f.occupation === "business" },
  { id: 20, name: "PM Awas Yojana Urban", emoji: "🏠", ministry: "Ministry of Housing", benefit: "Home loan interest subsidy up to ₹2.67 lakh for first home", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", applyMode: "both", time: "1-2 months", helpline: "1800-11-3377", documents: ["Aadhaar Card", "Income Proof", "Property Documents", "Bank Statement"], steps: ["Apply at pmaymis.gov.in OR through any bank/HFC", "Submit income and property documents", "Bank verifies eligibility", "Subsidy amount calculated and approved", "Subsidy credited to your loan account", "Your EMI reduces automatically"], offline: "Any housing finance company or bank offering home loans — ask for PMAY-U subsidy", applyUrl: "https://www.myscheme.gov.in/schemes/pmay-u", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 21, name: "PM Jan Dhan Yojana", emoji: "🏦", ministry: "Ministry of Finance", benefit: "Zero-balance account + ₹10,000 overdraft + RuPay card + ₹2L insurance", tag: "Banking", tagColor: "bg-blue-100 text-blue-700 border-blue-200", applyMode: "offline", time: "30 minutes", helpline: "1800-11-0001", documents: ["Aadhaar Card", "Passport photo"], steps: ["Visit any bank branch or BC (Bank Mitra)", "Ask for Jan Dhan account opening form", "Fill form with Aadhaar details", "Submit photo and sign form", "Account opens same day", "RuPay debit card delivered in 7-10 days"], offline: "Visit bank branch OR nearest Bank Mitra/CSC in your village", applyUrl: "https://www.myscheme.gov.in/schemes/pmjdy", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 22, name: "Atal Pension Yojana", emoji: "👴", ministry: "Ministry of Finance", benefit: "₹1,000–₹5,000/month guaranteed pension after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", applyMode: "both", time: "10 minutes", helpline: "1800-110-069", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], steps: ["Visit bank branch OR use net banking/mobile app", "Ask for APY enrollment form", "Choose monthly pension amount (₹1K to ₹5K)", "Auto-debit set up from your account", "Small monthly contribution based on your age", "Get pension from age 60 for life"], offline: "Any bank branch — younger you enroll, lower your monthly contribution", applyUrl: "https://www.myscheme.gov.in/schemes/apy", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 },
  { id: 23, name: "PM Shram Yogi Maandhan", emoji: "🔧", ministry: "Ministry of Labour", benefit: "₹3,000/month pension for unorganised workers after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", applyMode: "both", time: "10 minutes", helpline: "1800-267-6888", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], steps: ["Visit nearest CSC center OR maandhan.in", "Enter Aadhaar and bank details", "Choose monthly contribution amount", "Auto-debit activated", "Govt matches your contribution equally", "Get ₹3,000/month pension at 60"], offline: "CSC centers enroll for free — bring Aadhaar and bank passbook", applyUrl: "https://www.myscheme.gov.in/schemes/pmsym", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 && (f.income === "below1L" || f.income === "1to2L") },
  { id: 24, name: "Sukanya Samriddhi Yojana", emoji: "👧", ministry: "Ministry of Finance", benefit: "8.2% interest savings for girl child — highest safe investment in India", tag: "Savings", tagColor: "bg-pink-100 text-pink-700 border-pink-200", applyMode: "offline", time: "30 minutes", helpline: "1800-266-6868", documents: ["Girl child's birth certificate", "Parent's Aadhaar and PAN", "Passport photo of parent"], steps: ["Visit Post Office OR any authorized bank", "Ask for Sukanya Samriddhi Yojana form", "Fill with girl's and parent's details", "Deposit minimum ₹250 to open account", "Deposit any amount every year (max ₹1.5L)", "Account matures when girl turns 21"], offline: "Post Office nearest to you — fastest option, no minimum balance issues", applyUrl: "https://www.myscheme.gov.in/schemes/ssy", condition: (f: any) => f.gender === "female" && Number(f.age) <= 35 },
  { id: 25, name: "PM Matru Vandana Yojana", emoji: "🤱", ministry: "Ministry of Women & Child Dev", benefit: "₹6,500 cash for first pregnancy — 3 installments direct to bank", tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200", applyMode: "offline", time: "20 minutes", helpline: "1800-111-565", documents: ["Aadhaar Card", "MCP Card (from Anganwadi)", "Bank Account passbook", "Pregnancy registration certificate"], steps: ["Register pregnancy at nearest Anganwadi center first", "Get MCP (Mother Child Protection) card", "Visit Anganwadi with bank passbook and Aadhaar", "Fill PMMVY form with Anganwadi worker's help", "First ₹3,000 after pregnancy registration", "Second ₹2,000 after 6 months checkup", "Third ₹2,000 after child's birth and vaccination"], offline: "Apply ONLY through Anganwadi center — no online option", applyUrl: "https://www.myscheme.gov.in/schemes/pmmvy", condition: (f: any) => f.gender === "female" && Number(f.age) >= 19 && Number(f.age) <= 45 },
  { id: 26, name: "Divyangjan Scholarship", emoji: "♿", ministry: "Ministry of Social Justice", benefit: "₹14,000–₹35,000/year for students with disabilities", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", applyMode: "online", time: "30 minutes", helpline: "0120-6619540", documents: ["Disability Certificate (40%+)", "Aadhaar Card", "Marksheets", "Bank Account"], steps: ["Get disability certificate from district hospital first", "Go to scholarships.gov.in", "Select Disability scholarship category", "Upload disability certificate and documents", "Submit before November deadline"], offline: "School/college disability coordinator can assist with application", applyUrl: "https://www.myscheme.gov.in/schemes/ssdpwd", condition: (f: any) => f.special?.includes("disabled") && f.occupation === "student" },
  { id: 27, name: "PM SVANidhi Street Vendor Loan", emoji: "🛺", ministry: "Ministry of Housing", benefit: "Loan ₹10,000–₹50,000 for street vendors — no collateral needed", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", applyMode: "both", time: "1 week", helpline: "1800-11-1979", documents: ["Aadhaar Card", "Vending Certificate or Letter of Recommendation from ULB", "Bank Account"], steps: ["Get vending certificate from your municipal office first", "Apply at pmsvanidhi.mohua.gov.in OR visit bank", "Submit vending certificate and Aadhaar", "₹10,000 first loan approved in 5-7 days", "Repay on time — get ₹20,000 next time", "Timely repayment gets ₹1,200 annual cashback"], offline: "Visit nearest SHG bank linkage or microfinance institution with vending certificate", applyUrl: "https://www.myscheme.gov.in/schemes/pmsvanidhi", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 28, name: "PM KUSUM Solar Pump", emoji: "☀️", ministry: "Ministry of Agriculture", benefit: "Solar pump subsidy up to 60% — save ₹10,000-50,000 on electricity", tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200", applyMode: "online", time: "1-2 months", helpline: "1800-180-3333", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Electricity Bill", "Quotation from solar vendor"], steps: ["Apply at your state's agriculture/energy portal", "Submit land and electricity documents", "Get approved — choose empanelled solar vendor", "Pay only 30-40% of cost", "Subsidy directly paid to vendor", "Solar pump installed within 3 months"], offline: "Agriculture department office in your district — ask for PM KUSUM scheme", applyUrl: "https://www.myscheme.gov.in/schemes/pm-kusum", condition: (f: any) => f.occupation === "farmer" },
  { id: 29, name: "MGNREGS Job Card", emoji: "⛏️", ministry: "Ministry of Rural Development", benefit: "100 days guaranteed work at ₹220-357/day — legal right of every rural family", tag: "Employment", tagColor: "bg-lime-100 text-lime-700 border-lime-200", applyMode: "offline", time: "15 days", helpline: "1800-111-555", documents: ["Aadhaar Card", "Residence Proof", "Passport Photo", "Bank Account"], steps: ["Visit Gram Panchayat office with documents", "Fill Job Card application form", "Gram Panchayat verifies residence", "Job Card issued within 15 days", "Demand work at Panchayat — must be given within 15 days", "Payment directly to bank account within 15 days of work"], offline: "Gram Panchayat office only — this is a village-level program", applyUrl: "https://www.myscheme.gov.in/schemes/mgnregs", condition: (f: any) => f.income === "below1L" || f.occupation === "unemployed" },
  { id: 30, name: "PM Vishwakarma Yojana", emoji: "⚒️", ministry: "Ministry of MSME", benefit: "₹15,000 toolkit + ₹3L loan at 5% + free training for artisans & craftsmen", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", applyMode: "online", time: "1 month", helpline: "1800-267-7777", documents: ["Aadhaar Card", "Caste Certificate (if applicable)", "Bank Account", "Mobile Number", "Photo of your work/craft"], steps: ["Go to pmvishwakarma.gov.in", "Check if your trade is in the 18 eligible crafts", "Register with Aadhaar and mobile OTP", "Complete 5-day basic training at nearby center", "Get PM Vishwakarma certificate", "Apply for ₹15,000 toolkit grant", "Eligible for ₹1L loan (then ₹2L) at 5% interest"], offline: "CSC center or District Industry Centre (DIC) in your city", applyUrl: "https://www.myscheme.gov.in/schemes/pmvy", condition: (f: any) => f.occupation === "business" || f.occupation === "employed" },
];

function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState<"steps" | "docs">("docs");

  useEffect(() => {
    localStorage.setItem("matchedSchemes", JSON.stringify(matched));
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

  // Sort by ease — online + less docs first
  const sorted = [...filtered].sort((a, b) => {
    const aScore = (a as any).applyMode === "online" ? 0 : 1;
    const bScore = (b as any).applyMode === "online" ? 0 : 1;
    return aScore - bScore;
  });

  const shareOnWhatsApp = () => {
    const schemeNames = matched.slice(0, 5).map(s => `• ${s.name}`).join("\n");
    const text = `🇮🇳 Yojana AI ne mujhe ${matched.length} sarkari yojanaon ke liye eligible bataya:\n\n${schemeNames}\n\nAap bhi check karein: https://yojana-ai-nine.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Govt strip */}
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4">
        🇮🇳 Government of India Initiative — Scheme data sourced from myScheme.gov.in
      </div>

      {/* Nav */}
      <nav className="bg-white border-b-4 border-[#f97316] shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/home")} className="text-[#1a3a6b] hover:underline text-sm">🏠 Home</button>
            <span className="text-gray-300">›</span>
            <button onClick={() => router.push("/check")} className="text-[#1a3a6b] hover:underline text-sm">Edit</button>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500 text-sm">Results</span>
          </div>
          <button onClick={() => router.push("/chat")} className="bg-[#1a3a6b] text-white text-sm px-4 py-2 rounded hover:bg-[#15306b] transition-all">
            🤖 Ask AI
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Result banner */}
        {matched.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-3xl">🎯</span>
              <div className="flex-1">
                <div className="font-bold text-green-800 text-lg">
                  {matched.length} schemes found for {form.name}!
                </div>
                <div className="text-green-600 text-sm mt-0.5">
                  Sorted by easiest to apply first. Each scheme shows exact steps.
                </div>
              </div>
            </div>
            {/* WhatsApp share */}
            <button
              onClick={shareOnWhatsApp}
              className="mt-3 w-full bg-[#25D366] hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>📤</span> Share Results on WhatsApp
            </button>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center mb-5">
            <div className="text-4xl mb-2">😔</div>
            <p className="text-yellow-800 font-semibold">{t.results_none}</p>
            <button onClick={() => router.push("/check")} className="mt-3 text-[#1a3a6b] underline text-sm">← Edit your details</button>
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
                {tag === "all" ? `All (${matched.length})` : tag}
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
                  <div className="flex-1">
                    <div className="font-bold text-[#1a3a6b] text-base leading-tight">{scheme.name}</div>
                    <div className="text-gray-400 text-xs mt-0.5">{scheme.ministry}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border flex-shrink-0 ${scheme.tagColor}`}>
                    {scheme.tag}
                  </span>
                </div>

                {/* Benefit */}
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3">
                  <div className="text-blue-400 text-xs mb-0.5 font-medium uppercase tracking-wide">Benefit</div>
                  <div className="text-blue-900 font-semibold text-sm">{scheme.benefit}</div>
                </div>

                {/* Meta row */}
                <div className="flex items-center gap-3 mb-3 text-xs">
                  <span className={`flex items-center gap-1 font-medium px-2 py-1 rounded-full
                    ${scheme.applyMode === "online" ? "bg-green-50 text-green-700" :
                      scheme.applyMode === "offline" ? "bg-orange-50 text-orange-700" :
                        "bg-blue-50 text-blue-700"}`}>
                    {scheme.applyMode === "online" ? "💻 Apply Online" :
                      scheme.applyMode === "offline" ? "🏢 Visit Office" : "💻🏢 Online or Office"}
                  </span>
                  <span className="text-gray-400">⏱ {scheme.time}</span>
                  {scheme.helpline && (
                    <a href={`tel:${scheme.helpline}`} className="text-[#1a3a6b] hover:underline">
                      📞 {scheme.helpline}
                    </a>
                  )}
                </div>

                {/* Eligible + actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                    <span className="text-green-700 text-sm font-semibold">You are eligible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExpandedId(expandedId === scheme.id ? null : scheme.id)}
                      className="text-gray-400 hover:text-[#1a3a6b] text-sm border border-gray-200 rounded-lg px-3 py-1.5 hover:border-[#1a3a6b] transition-all"
                    >
                      {expandedId === scheme.id ? "Hide ▲" : "How to Apply ▾"}
                    </button>
                    <a
                      href={scheme.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#f97316] hover:bg-orange-600 text-white font-bold text-sm px-5 py-2 rounded-lg transition-all flex items-center gap-1"
                    >
                      Apply ↗
                    </a>
                  </div>
                </div>
              </div>

              {/* Expanded section */}
              {expandedId === scheme.id && (
                <div className="border-t border-gray-100 bg-gray-50">
                  {/* Tab switcher */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setView("steps")}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-all
                        ${view === "steps" ? "bg-white text-[#1a3a6b] border-b-2 border-[#1a3a6b]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      📋 Step-by-Step Guide
                    </button>
                    <button
                      onClick={() => setView("docs")}
                      className={`flex-1 py-2.5 text-sm font-semibold transition-all
                        ${view === "docs" ? "bg-white text-[#1a3a6b] border-b-2 border-[#1a3a6b]" : "text-gray-400 hover:text-gray-600"}`}
                    >
                      📄 Documents Needed
                    </button>
                  </div>

                  <div className="px-5 py-4">
                    {view === "steps" && scheme.steps && (
                      <div>
                        <div className="space-y-2 mb-4">
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
                            <div className="text-orange-600 text-xs font-semibold mb-1">🏢 OFFLINE OPTION</div>
                            <p className="text-orange-800 text-sm">{scheme.offline}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {view === "docs" && (
                      <div>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {scheme.documents.map((doc: string, i: number) => (
                            <span key={i} className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-gray-700 flex items-center gap-1.5">
                              <span className="text-orange-400">📄</span> {doc}
                            </span>
                          ))}
                        </div>
                        <p className="text-gray-400 text-xs">
                          💡 Tip: Keep all documents as JPG/PDF photos on your phone — saves time at offices
                        </p>
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
              <div className="font-bold text-white">Still confused? Ask Sahayak AI</div>
              <div className="text-blue-200 text-sm">Get personalized help in Hindi, English or Marathi</div>
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
          <p className="text-gray-500 text-sm">Loading your schemes...</p>
        </div>
      </div>
    }>
      <Results />
    </Suspense>
  );
}