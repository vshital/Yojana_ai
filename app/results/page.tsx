"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { translations } from "@/lib/lang";

const ALL_SCHEMES = [
  // AGRICULTURE
  { id: 1, name: "PM-Kisan Samman Nidhi", emoji: "🌾", ministry: "Ministry of Agriculture", benefit: "₹6,000/year (₹2,000 × 3 installments) direct to bank", tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200", documents: ["Aadhaar Card", "Land Records", "Bank Passbook", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/pmksny", condition: (f: any) => f.occupation === "farmer" },
  { id: 2, name: "PM Fasal Bima Yojana", emoji: "🌦️", ministry: "Ministry of Agriculture", benefit: "Crop insurance against natural disasters, pests & disease", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Sowing Certificate"], applyUrl: "https://www.myscheme.gov.in/schemes/pmfby", condition: (f: any) => f.occupation === "farmer" },
  { id: 3, name: "Kisan Credit Card (KCC)", emoji: "💳", ministry: "Ministry of Agriculture", benefit: "Credit up to ₹3 lakh at 4% interest for farming needs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Land Records", "Passport Photo", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/kcc", condition: (f: any) => f.occupation === "farmer" },
  { id: 4, name: "PM Kisan Maandhan Yojana", emoji: "👨‍🌾", ministry: "Ministry of Agriculture", benefit: "₹3,000/month pension for small farmers after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Age Proof"], applyUrl: "https://www.myscheme.gov.in/schemes/pmkmdy", condition: (f: any) => f.occupation === "farmer" && Number(f.age) >= 18 && Number(f.age) <= 40 },
  { id: 5, name: "PM KUSUM Solar Pump", emoji: "☀️", ministry: "Ministry of Agriculture", benefit: "Solar pump subsidy up to 60% — reduce electricity cost for irrigation", tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Electricity Bill"], applyUrl: "https://www.myscheme.gov.in/schemes/pm-kusum", condition: (f: any) => f.occupation === "farmer" },
  { id: 6, name: "National Agriculture Market (eNAM)", emoji: "🛒", ministry: "Ministry of Agriculture", benefit: "Sell crops online at best price — access to 1000+ mandis across India", tag: "Market", tagColor: "bg-lime-100 text-lime-700 border-lime-200", documents: ["Aadhaar Card", "Land Records", "Bank Account", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/enam", condition: (f: any) => f.occupation === "farmer" },
  // HEALTH
  { id: 7, name: "Ayushman Bharat – PMJAY", emoji: "🏥", ministry: "Ministry of Health", benefit: "₹5 lakh free health insurance per family — covers 1,500+ treatments", tag: "Health", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "Ration Card / BPL Card", "Family ID"], applyUrl: "https://www.myscheme.gov.in/schemes/pmjay", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" || f.special?.includes("bpl") },
  { id: 8, name: "PM Suraksha Bima Yojana", emoji: "🛡️", ministry: "Ministry of Finance", benefit: "₹2 lakh accident insurance at just ₹20/year", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Bank Account (auto-debit)"], applyUrl: "https://www.myscheme.gov.in/schemes/pmsby", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 70 },
  { id: 9, name: "PM Jeevan Jyoti Bima Yojana", emoji: "🌟", ministry: "Ministry of Finance", benefit: "₹2 lakh life insurance cover at only ₹436/year", tag: "Insurance", tagColor: "bg-teal-100 text-teal-700 border-teal-200", documents: ["Aadhaar Card", "Bank Account (auto-debit)"], applyUrl: "https://www.myscheme.gov.in/schemes/pmjjby", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 50 },
  { id: 10, name: "Janani Suraksha Yojana", emoji: "🤰", ministry: "Ministry of Health", benefit: "₹1,400 (rural) / ₹1,000 (urban) cash for institutional delivery", tag: "Health", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "BPL Card", "Pregnancy Record", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/jsy", condition: (f: any) => f.gender === "female" && Number(f.age) >= 18 && Number(f.age) <= 45 },
  { id: 11, name: "Rashtriya Arogya Nidhi", emoji: "💊", ministry: "Ministry of Health", benefit: "Financial assistance up to ₹15 lakh for life-threatening diseases", tag: "Health", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "BPL Card", "Medical Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/ran", condition: (f: any) => f.special?.includes("bpl") || f.income === "below1L" },
  // EDUCATION
  { id: 12, name: "National Scholarship Portal", emoji: "🎓", ministry: "Ministry of Education", benefit: "₹10,000–₹1,20,000/year for school & college students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Marksheets", "Income Certificate", "Bank Account", "Caste Certificate"], applyUrl: "https://www.myscheme.gov.in/schemes/nsp", condition: (f: any) => f.occupation === "student" && (f.income === "below1L" || f.income === "1to2L" || f.income === "2to5L") },
  { id: 13, name: "Vidya Lakshmi Education Loan", emoji: "📚", ministry: "Ministry of Education", benefit: "Education loans up to ₹6.5 lakh at subsidized interest rates", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Admission Letter", "Fee Structure", "Income Proof", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/vls", condition: (f: any) => f.occupation === "student" },
  { id: 14, name: "Post-Matric Scholarship SC", emoji: "📖", ministry: "Ministry of Social Justice", benefit: "Full tuition fee + maintenance allowance for SC students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Caste Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmscs", condition: (f: any) => f.category === "sc" && f.occupation === "student" },
  { id: 15, name: "Post-Matric Scholarship ST", emoji: "🏫", ministry: "Ministry of Tribal Affairs", benefit: "Full tuition + living allowance for ST students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Tribe Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmsts", condition: (f: any) => f.category === "st" && f.occupation === "student" },
  { id: 16, name: "Dr. Ambedkar Scholarship OBC", emoji: "🎒", ministry: "Ministry of Social Justice", benefit: "Tuition fee + maintenance allowance for OBC postgrad students", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "OBC Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/dapmsfobc", condition: (f: any) => f.category === "obc" && f.occupation === "student" },
  { id: 17, name: "Divyangjan Scholarship", emoji: "♿", ministry: "Ministry of Social Justice", benefit: "₹14,000–₹35,000/year for students with disabilities", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Disability Certificate (40%+)", "Aadhaar Card", "Marksheets", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/ssdpwd", condition: (f: any) => f.special?.includes("disabled") && f.occupation === "student" },
  { id: 18, name: "Begum Hazrat Mahal Scholarship", emoji: "📕", ministry: "Ministry of Minority Affairs", benefit: "₹5,000–₹6,000/year for minority girl students (Class 9–12)", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Minority Certificate", "Marksheets", "Income Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/bhmnss", condition: (f: any) => f.gender === "female" && f.special?.includes("minority") && f.occupation === "student" },
  { id: 19, name: "PM Scholarship (WARB)", emoji: "🪖", ministry: "Ministry of Home Affairs", benefit: "₹2,500–₹3,000/month for children of police/paramilitary personnel", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Service Certificate of Parent", "Marksheets", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmss-warb", condition: (f: any) => f.occupation === "student" && Number(f.age) <= 25 },
  // BUSINESS
  { id: 20, name: "MUDRA Yojana – Shishu", emoji: "🏪", ministry: "Ministry of Finance", benefit: "Loan up to ₹50,000 — no collateral, no guarantor required", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "PAN Card", "Business Address Proof", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/pmmy", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 21, name: "MUDRA Yojana – Kishore", emoji: "📈", ministry: "Ministry of Finance", benefit: "Loan ₹50,000–₹5 lakh for growing businesses", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "PAN Card", "2-year Business Proof", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/pmmy", condition: (f: any) => f.occupation === "business" },
  { id: 22, name: "MUDRA Yojana – Tarun", emoji: "🚀", ministry: "Ministry of Finance", benefit: "Loan ₹5 lakh–₹10 lakh for established businesses", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "PAN Card", "3-year Business Proof", "IT Returns", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/pmmy", condition: (f: any) => f.occupation === "business" && (f.income === "2to5L" || f.income === "above5L") },
  { id: 23, name: "Stand Up India – SC/ST/Women", emoji: "💪", ministry: "Ministry of Finance", benefit: "Loan ₹10 lakh–₹1 crore for SC/ST/Women first-time entrepreneurs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar", "PAN", "Business Plan", "SC/ST or Woman proof", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/sui", condition: (f: any) => (f.category === "sc" || f.category === "st" || f.special?.includes("woman_entrepreneur")) && f.occupation === "business" },
  { id: 24, name: "PMEGP Self Employment", emoji: "🏭", ministry: "Ministry of MSME", benefit: "15–35% subsidy on project cost up to ₹50 lakh for new businesses", tag: "Subsidy", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "PAN Card", "8th Pass Certificate", "Project Report"], applyUrl: "https://www.myscheme.gov.in/schemes/pmegp", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  { id: 25, name: "Udyam Registration (MSME)", emoji: "🔖", ministry: "Ministry of MSME", benefit: "Free MSME certificate — unlocks 50+ government subsidies & priority loans", tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", documents: ["Aadhaar Card", "PAN Card", "Business Details"], applyUrl: "https://www.myscheme.gov.in/schemes/uam", condition: (f: any) => f.occupation === "business" },
  { id: 26, name: "PM Vishwakarma Yojana", emoji: "⚒️", ministry: "Ministry of MSME", benefit: "₹15,000 toolkit + ₹3L loan at 5% + free skill training for artisans", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/pmvy", condition: (f: any) => f.occupation === "business" || f.occupation === "employed" },
  // HOUSING
  { id: 27, name: "PM Awas Yojana – Urban", emoji: "🏠", ministry: "Ministry of Housing", benefit: "Home loan interest subsidy up to ₹2.67 lakh for first home", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "Income Proof", "Property Documents", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/pmay-u", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 28, name: "PM Awas Yojana – Gramin", emoji: "🏡", ministry: "Ministry of Rural Development", benefit: "₹1.2–1.3 lakh direct grant to build a pucca house in rural areas", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "BPL Ration Card", "Land Proof", "Bank Account", "Job Card"], applyUrl: "https://www.myscheme.gov.in/schemes/pmay-g", condition: (f: any) => f.special?.includes("bpl") || f.income === "below1L" },
  { id: 29, name: "PM Gramin Awaas Yojana (PMGAY)", emoji: "🏘️", ministry: "Ministry of Rural Development", benefit: "Interest subsidy on home loans for EWS/LIG category families", tag: "Housing", tagColor: "bg-orange-100 text-orange-700 border-orange-200", documents: ["Aadhaar Card", "Income Certificate", "Land Documents", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmgay", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  // WOMEN
  { id: 30, name: "PM Ujjwala Yojana", emoji: "🔥", ministry: "Ministry of Petroleum", benefit: "Free LPG connection + ₹1,600 financial assistance for BPL women", tag: "Subsidy", tagColor: "bg-red-100 text-red-700 border-red-200", documents: ["Aadhaar Card", "BPL Ration Card", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmuy", condition: (f: any) => f.gender === "female" && (f.special?.includes("bpl") || f.income === "below1L") },
  { id: 31, name: "Sukanya Samriddhi Yojana", emoji: "👧", ministry: "Ministry of Finance", benefit: "8.2% p.a. savings scheme for girl child's education & marriage", tag: "Savings", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Girl Child's Birth Certificate", "Parent's Aadhaar & PAN", "Post Office / Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/ssy", condition: (f: any) => f.gender === "female" && Number(f.age) <= 35 },
  { id: 32, name: "PM Matru Vandana Yojana", emoji: "🤱", ministry: "Ministry of Women & Child Development", benefit: "₹6,500 cash benefit for first pregnancy — direct bank transfer", tag: "Cash Transfer", tagColor: "bg-green-100 text-green-700 border-green-200", documents: ["Aadhaar Card", "MCP Card", "Bank Account", "Pregnancy Certificate"], applyUrl: "https://www.myscheme.gov.in/schemes/pmmvy", condition: (f: any) => f.gender === "female" && Number(f.age) >= 19 && Number(f.age) <= 45 },
  { id: 33, name: "Mahila Shakti Kendra", emoji: "👩‍💼", ministry: "Ministry of Women & Child Development", benefit: "Free skill development + digital literacy + employment support for rural women", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Residence Proof"], applyUrl: "https://www.myscheme.gov.in/schemes/msk", condition: (f: any) => f.gender === "female" && (f.income === "below1L" || f.income === "1to2L") },
  { id: 34, name: "Free Silai Machine Yojana", emoji: "🧵", ministry: "Ministry of Women & Child Development", benefit: "Free sewing machine for economic independence of poor women", tag: "Equipment", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Age Proof (20-40 years)", "Income Certificate"], applyUrl: "https://www.myscheme.gov.in/schemes/fsmy", condition: (f: any) => f.gender === "female" && Number(f.age) >= 20 && Number(f.age) <= 40 && (f.income === "below1L" || f.income === "1to2L") },
  // WORKERS
  { id: 35, name: "e-Shram Card", emoji: "👷", ministry: "Ministry of Labour", benefit: "₹2 lakh accident insurance + access to 50+ welfare schemes", tag: "Registration", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number linked to Aadhaar"], applyUrl: "https://www.myscheme.gov.in/schemes/eshram", condition: (f: any) => f.occupation === "unemployed" || f.occupation === "farmer" || f.occupation === "business" },
  { id: 36, name: "MGNREGS – Job Card", emoji: "⛏️", ministry: "Ministry of Rural Development", benefit: "100 days guaranteed employment at ₹220–₹357/day — right to work", tag: "Employment", tagColor: "bg-lime-100 text-lime-700 border-lime-200", documents: ["Aadhaar Card", "Residence Proof", "Passport Photo", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/mgnregs", condition: (f: any) => f.income === "below1L" || f.occupation === "unemployed" },
  { id: 37, name: "Atal Pension Yojana", emoji: "👴", ministry: "Ministry of Finance", benefit: "₹1,000–₹5,000/month guaranteed pension after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/apy", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 },
  { id: 38, name: "PM Shram Yogi Maandhan", emoji: "🔧", ministry: "Ministry of Labour", benefit: "₹3,000/month pension for unorganised workers after age 60", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "Bank Account", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/pmsym", condition: (f: any) => Number(f.age) >= 18 && Number(f.age) <= 40 && (f.income === "below1L" || f.income === "1to2L") },
  { id: 39, name: "PM Jan Dhan Yojana", emoji: "🏦", ministry: "Ministry of Finance", benefit: "Zero-balance bank account + ₹10,000 overdraft + RuPay card + ₹2L insurance", tag: "Banking", tagColor: "bg-blue-100 text-blue-700 border-blue-200", documents: ["Aadhaar Card", "Passport Photo"], applyUrl: "https://www.myscheme.gov.in/schemes/pmjdy", condition: (f: any) => f.income === "below1L" || f.income === "1to2L" },
  { id: 40, name: "PM SVANidhi – Street Vendor Loan", emoji: "🛺", ministry: "Ministry of Housing & Urban Affairs", benefit: "Loan ₹10,000–₹50,000 for street vendors — no collateral needed", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Vending Certificate", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmsvanidhi", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  // SKILL
  { id: 41, name: "PM Kaushal Vikas Yojana 4.0", emoji: "🛠️", ministry: "Ministry of Skill Development", benefit: "Free skill training in 300+ job roles + ₹8,000 reward on certification", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Educational Certificates", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/pmkvy", condition: (f: any) => f.occupation === "unemployed" || f.occupation === "student" },
  { id: 42, name: "DDU Grameen Kaushalya Yojana", emoji: "🌱", ministry: "Ministry of Rural Development", benefit: "Free residential skill training + guaranteed placement for rural youth", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Residence Proof", "Educational Certificates", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/ddugky", condition: (f: any) => f.occupation === "unemployed" && (f.income === "below1L" || f.income === "1to2L") },
  { id: 43, name: "Startup India Seed Fund", emoji: "💡", ministry: "Ministry of Commerce", benefit: "Up to ₹50 lakh seed funding for early-stage startups via incubators", tag: "Funding", tagColor: "bg-indigo-100 text-indigo-700 border-indigo-200", documents: ["Aadhaar Card", "DPIIT Recognition", "Business Plan", "PAN Card"], applyUrl: "https://www.myscheme.gov.in/schemes/sisfs", condition: (f: any) => f.occupation === "business" && (f.income === "2to5L" || f.income === "above5L") },
  { id: 44, name: "PM Wani Free WiFi Scheme", emoji: "📶", ministry: "Ministry of Communications", benefit: "Set up a public WiFi hotspot & earn income — free registration", tag: "Digital", tagColor: "bg-cyan-100 text-cyan-700 border-cyan-200", documents: ["Aadhaar Card", "PAN Card", "Bank Account", "Mobile Number"], applyUrl: "https://www.myscheme.gov.in/schemes/pm-wani", condition: (f: any) => f.occupation === "business" || f.occupation === "unemployed" },
  // SC/ST/OBC/MINORITY
  { id: 45, name: "National Overseas Scholarship SC/ST", emoji: "✈️", ministry: "Ministry of Social Justice", benefit: "Full scholarship for SC/ST students for higher education abroad", tag: "Scholarship", tagColor: "bg-yellow-100 text-yellow-700 border-yellow-200", documents: ["Aadhaar Card", "Caste Certificate", "Admission Letter (foreign)", "Passport", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/nos", condition: (f: any) => (f.category === "sc" || f.category === "st") && f.occupation === "student" },
  { id: 46, name: "Nai Roshni – Minority Women Leadership", emoji: "✨", ministry: "Ministry of Minority Affairs", benefit: "Free leadership & skill training program for minority women", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Minority Certificate", "Residence Proof"], applyUrl: "https://www.myscheme.gov.in/schemes/nrmw", condition: (f: any) => f.gender === "female" && f.special?.includes("minority") },
  { id: 47, name: "Seekho Aur Kamao – Minority Skill", emoji: "🎯", ministry: "Ministry of Minority Affairs", benefit: "Free market-linked skill training + placement for minority youth", tag: "Skill", tagColor: "bg-pink-100 text-pink-700 border-pink-200", documents: ["Aadhaar Card", "Minority Certificate", "Educational Certificates", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/sak", condition: (f: any) => f.special?.includes("minority") && (f.occupation === "student" || f.occupation === "unemployed") },
  { id: 48, name: "Venture Capital Fund for SC/ST", emoji: "💰", ministry: "Ministry of Social Justice", benefit: "Concessional loans up to ₹30 lakh for SC/ST entrepreneurs", tag: "Loan", tagColor: "bg-purple-100 text-purple-700 border-purple-200", documents: ["Aadhaar Card", "Caste Certificate", "Business Plan", "PAN Card", "Bank Statement"], applyUrl: "https://www.myscheme.gov.in/schemes/vcfsc", condition: (f: any) => (f.category === "sc" || f.category === "st") && f.occupation === "business" },
  // DISABILITY / SENIOR
  { id: 49, name: "Indira Gandhi Disability Pension", emoji: "♿", ministry: "Ministry of Rural Development", benefit: "₹300/month pension for BPL persons with severe disabilities", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "BPL Card", "Disability Certificate (80%+)", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/igndps", condition: (f: any) => f.special?.includes("disabled") && (f.special?.includes("bpl") || f.income === "below1L") },
  { id: 50, name: "Indira Gandhi Old Age Pension", emoji: "👵", ministry: "Ministry of Rural Development", benefit: "₹200–₹500/month pension for BPL senior citizens above 60 years", tag: "Pension", tagColor: "bg-gray-100 text-gray-700 border-gray-200", documents: ["Aadhaar Card", "BPL Card", "Age Proof", "Bank Account"], applyUrl: "https://www.myscheme.gov.in/schemes/ignoaps", condition: (f: any) => Number(f.age) >= 60 && (f.special?.includes("bpl") || f.income === "below1L") },
];

function Results() {
  const params = useSearchParams();
  const router = useRouter();
  const [lang, setLang] = useState("en");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => { setLang(localStorage.getItem("lang") || "en"); }, []);

  const t = translations[lang];

  const form = {
    name: params.get("name"), age: params.get("age"), gender: params.get("gender"),
    state: params.get("state"), category: params.get("category"),
    occupation: params.get("occupation"), income: params.get("income"),
    special: params.get("special")?.split(",") || [],
  };

  const matched = ALL_SCHEMES.filter((s) => s.condition(form));
  const tags = ["all", ...Array.from(new Set(matched.map((s) => s.tag)))];
  const filtered = filter === "all" ? matched : matched.filter((s) => s.tag === filter);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="bg-[#1a3a6b] text-white text-xs py-1.5 px-4">🇮🇳 Government of India Initiative</div>
      <nav className="bg-white border-b-4 border-[#f97316] shadow-sm sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/home")} className="text-[#1a3a6b] hover:underline text-sm">🏠 Home</button>
            <span className="text-gray-300">›</span>
            <button onClick={() => router.push("/check")} className="text-[#1a3a6b] hover:underline text-sm">Edit Profile</button>
            <span className="text-gray-300">›</span>
            <span className="text-gray-500 text-sm">Results</span>
          </div>
          <button onClick={() => router.push("/chat")} className="bg-[#1a3a6b] text-white text-sm px-4 py-2 rounded hover:bg-[#15306b] transition-all">🤖 Ask AI</button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {matched.length > 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🎯</div>
            <div>
              <div className="font-bold text-green-800">{matched.length} schemes found for {form.name}!</div>
              <div className="text-green-600 text-sm">Click "Apply Now" — opens official myScheme.gov.in page with full details & form</div>
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
          {[{ label: "Name", val: form.name }, { label: "Age", val: form.age }, { label: "State", val: form.state }, { label: "Category", val: form.category?.toUpperCase() }, { label: "Occupation", val: form.occupation }].map((item) => item.val && (
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
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${filter === tag ? "bg-[#1a3a6b] text-white border-[#1a3a6b]" : "bg-white text-gray-600 border-gray-200 hover:border-[#1a3a6b]"}`}>
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
                      {expandedId === scheme.id ? "Hide ▲" : "Docs ▾"}
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
                  <p className="text-gray-400 text-xs">💡 The Apply Now button opens myScheme.gov.in — India's official scheme portal with complete application form & guidance</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {matched.length > 0 && (
          <div onClick={() => router.push("/chat")} className="mt-6 cursor-pointer bg-[#1a3a6b] rounded-xl p-5 flex items-center gap-4 hover:bg-[#15306b] transition-all">
            <span className="text-4xl">🤖</span>
            <div>
              <div className="font-bold text-white">Confused? Ask Sahayak AI</div>
              <div className="text-blue-200 text-sm">Get step-by-step help in Hindi, English or Marathi</div>
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