"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const TOTAL_STEPS = 2;

export default function Check() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", age: "", gender: "", state: "",
    category: "", occupation: "", income: "",
    special: [] as string[],
  });

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Puducherry",
  ];

  const toggleSpecial = (val: string) => {
    setForm(prev => ({
      ...prev,
      special: prev.special.includes(val)
        ? prev.special.filter(s => s !== val)
        : [...prev.special, val],
    }));
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.age && form.gender && form.state;
    return form.occupation && form.income && form.category;
  };

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(form));
    const params = new URLSearchParams({
      name: form.name, age: form.age, gender: form.gender,
      state: form.state, category: form.category,
      occupation: form.occupation, income: form.income,
      special: form.special.join(","),
    });
    router.push(`/results?${params}`);
  };

  const inputCls = "w-full border border-gray-200 focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 rounded-lg px-4 py-3 text-gray-800 text-sm outline-none transition-all bg-white placeholder-gray-400";
  const selectCls = "w-full border border-gray-200 focus:border-[#1B3A6B] focus:ring-2 focus:ring-[#1B3A6B]/10 rounded-lg px-4 py-3 text-gray-800 text-sm outline-none transition-all bg-white appearance-none cursor-pointer";
  const optionActive = "border-[#1B3A6B] bg-[#EEF2FF] text-[#1B3A6B] font-semibold";
  const optionInactive = "border-gray-200 text-gray-600 hover:border-gray-300 bg-white";

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Noto+Serif:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="bg-[#1B3A6B] text-white">
        <div className="max-w-2xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => step === 1 ? router.push("/home") : setStep(1)}
              className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Back
            </button>
            <div className="text-center">
              <div className="font-bold text-sm tracking-wide" style={{ fontFamily: "'Noto Serif', serif" }}>
                Yojana AI
              </div>
              <div className="text-blue-300 text-xs">Step {step} of {TOTAL_STEPS}</div>
            </div>
            <div className="text-amber-400 font-bold text-sm">
              {step === 1 ? "50%" : "100%"}
            </div>
          </div>
          {/* Progress */}
          <div className="h-1.5 bg-blue-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-6 py-8">

        {/* Step 1 */}
        {step === 1 && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
                Personal Details
              </h1>
              <p className="text-gray-500 text-sm">Enter accurate information for best results</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Full Name</label>
                <input
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Age</label>
                <input
                  type="number"
                  value={form.age}
                  onChange={e => setForm({ ...form, age: e.target.value })}
                  placeholder="Your age in years"
                  min="1" max="100"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: "male", label: "Male" },
                    { val: "female", label: "Female" },
                    { val: "other", label: "Other" },
                  ].map(g => (
                    <button
                      key={g.val}
                      onClick={() => setForm({ ...form, gender: g.val })}
                      className={`py-3 rounded-lg border text-sm transition-all ${form.gender === g.val ? optionActive : optionInactive}`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">State / UT</label>
                <div className="relative">
                  <select
                    value={form.state}
                    onChange={e => setForm({ ...form, state: e.target.value })}
                    className={selectCls}
                  >
                    <option value="">Select your state</option>
                    {states.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed()}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-base transition-all ${canProceed() ? "bg-[#1B3A6B] hover:bg-[#15306b] text-white shadow-md hover:shadow-lg" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1B3A6B] mb-1" style={{ fontFamily: "'Noto Serif', serif" }}>
                Your Situation
              </h1>
              <p className="text-gray-500 text-sm">This helps us find the most relevant schemes</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">

              {/* Category */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Social Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "general", label: "General" },
                    { val: "obc", label: "OBC" },
                    { val: "sc", label: "SC (Dalit)" },
                    { val: "st", label: "ST (Tribal)" },
                  ].map(c => (
                    <button
                      key={c.val}
                      onClick={() => setForm({ ...form, category: c.val })}
                      className={`py-3 px-4 rounded-lg border text-sm transition-all text-left flex items-center gap-3 ${form.category === c.val ? optionActive : optionInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${form.category === c.val ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Occupation</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "student", label: "Student" },
                    { val: "farmer", label: "Farmer" },
                    { val: "business", label: "Self-Employed" },
                    { val: "employed", label: "Salaried" },
                    { val: "unemployed", label: "Unemployed" },
                  ].map(o => (
                    <button
                      key={o.val}
                      onClick={() => setForm({ ...form, occupation: o.val })}
                      className={`py-3 px-4 rounded-lg border text-sm transition-all text-left flex items-center gap-3 ${form.occupation === o.val ? optionActive : optionInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${form.occupation === o.val ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"}`} />
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Income */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-2">Annual Family Income</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "below1L", label: "Below ₹1 Lakh" },
                    { val: "1to2L", label: "₹1L – ₹2L" },
                    { val: "2to5L", label: "₹2L – ₹5L" },
                    { val: "above5L", label: "Above ₹5L" },
                  ].map(inc => (
                    <button
                      key={inc.val}
                      onClick={() => setForm({ ...form, income: inc.val })}
                      className={`py-3 px-4 rounded-lg border text-sm transition-all text-left flex items-center gap-3 ${form.income === inc.val ? optionActive : optionInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ${form.income === inc.val ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"}`} />
                      {inc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1">Additional Conditions <span className="text-gray-400 font-normal">(optional)</span></label>
                <p className="text-gray-400 text-xs mb-3">Select all that apply — unlocks more schemes</p>
                <div className="space-y-2">
                  {[
                    { val: "bpl", label: "BPL Card Holder" },
                    { val: "disabled", label: "Differently Abled (Divyangjan)" },
                    { val: "woman_entrepreneur", label: "Woman Entrepreneur" },
                    { val: "minority", label: "Minority Community" },
                  ].map(s => (
                    <button
                      key={s.val}
                      onClick={() => toggleSpecial(s.val)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${form.special.includes(s.val) ? optionActive : optionInactive}`}
                    >
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${form.special.includes(s.val) ? "border-[#1B3A6B] bg-[#1B3A6B]" : "border-gray-300"}`}>
                        {form.special.includes(s.val) && (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`w-full mt-6 py-4 rounded-xl font-bold text-base transition-all ${canProceed() ? "bg-[#D97706] hover:bg-amber-600 text-white shadow-md hover:shadow-lg" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
            >
              Find My Benefits
            </button>

            <p className="text-center text-gray-400 text-xs mt-3">
              <svg className="inline w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Your information is private and secure
            </p>
          </div>
        )}
      </div>
    </div>
  );
}