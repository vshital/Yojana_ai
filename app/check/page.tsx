"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

const TOTAL_STEPS = 2;

export default function Check() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [lang, setLang] = useState("en");
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    state: "",
    category: "",
    occupation: "",
    income: "",
    special: [] as string[],
  });

  useEffect(() => {
    setLang(localStorage.getItem("lang") || "en");
  }, []);

  const t = translations[lang];

  const states = [
    "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
    "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
    "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
    "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
    "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Puducherry",
  ];

  const toggleSpecial = (val: string) => {
    setForm((prev) => ({
      ...prev,
      special: prev.special.includes(val)
        ? prev.special.filter((s) => s !== val)
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

  const btnBase = "w-full py-3.5 rounded-lg border-2 font-semibold text-sm transition-all text-left px-4 flex items-center gap-3";
  const btnActive = "border-[#1a3a6b] bg-[#eef2ff] text-[#1a3a6b]";
  const btnInactive = "border-gray-200 bg-white text-gray-600 hover:border-gray-300";

  return (
    <div className="min-h-screen bg-[#f5f7fa]">

      {/* Header */}
      <div className="bg-[#1a3a6b] text-white px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button
            onClick={() => step === 1 ? router.push("/home") : setStep(1)}
            className="text-blue-200 hover:text-white text-sm"
          >
            ← {t.back}
          </button>
          <div className="flex-1">
            <div className="text-sm font-semibold">{t.form_title}</div>
            <div className="text-blue-300 text-xs">{t.step} {step} {t.of} {TOTAL_STEPS}</div>
          </div>
          <div className="text-orange-300 text-sm font-bold">
            {step === 1 ? "50%" : "100%"}
          </div>
        </div>
        {/* Progress bar */}
        <div className="max-w-lg mx-auto mt-3">
          <div className="h-2 bg-blue-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#f97316] rounded-full transition-all duration-500"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Step 1 — Who are you */}
        {step === 1 && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
              <h2 className="text-[#1a3a6b] font-bold text-lg mb-1">
                {lang === "hi" ? "आपकी जानकारी" : lang === "mr" ? "तुमची माहिती" : "Your Basic Details"}
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                {lang === "hi" ? "सही जानकारी भरें — बेहतर परिणाम मिलेंगे" : "Fill correctly for best results"}
              </p>

              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.name} *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === "hi" ? "जैसे: रमेश कुमार" : "e.g. Ramesh Kumar"}
                  className="w-full border-2 border-gray-200 focus:border-[#1a3a6b] rounded-lg px-4 py-3 text-gray-800 text-sm outline-none transition-all"
                />
              </div>

              {/* Age */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.age} *
                </label>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  placeholder={lang === "hi" ? "जैसे: 28" : "e.g. 28"}
                  min="1" max="100"
                  className="w-full border-2 border-gray-200 focus:border-[#1a3a6b] rounded-lg px-4 py-3 text-gray-800 text-sm outline-none transition-all"
                />
              </div>

              {/* Gender */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.gender} *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: "male", label: lang === "hi" ? "👨 पुरुष" : "👨 Male" },
                    { val: "female", label: lang === "hi" ? "👩 महिला" : "👩 Female" },
                    { val: "other", label: lang === "hi" ? "🧑 अन्य" : "🧑 Other" },
                  ].map((g) => (
                    <button
                      key={g.val}
                      onClick={() => setForm({ ...form, gender: g.val })}
                      className={`py-3 rounded-lg border-2 font-semibold text-sm transition-all
                        ${form.gender === g.val
                          ? "border-[#1a3a6b] bg-[#eef2ff] text-[#1a3a6b]"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                        }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.state} *
                </label>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-[#1a3a6b] rounded-lg px-4 py-3 text-gray-800 text-sm outline-none bg-white transition-all"
                >
                  <option value="">{lang === "hi" ? "राज्य चुनें" : "Select your state"}</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed()}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all
                ${canProceed()
                  ? "bg-[#1a3a6b] hover:bg-[#15306b] text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {t.next}
            </button>
          </div>
        )}

        {/* Step 2 — Your situation */}
        {step === 2 && (
          <div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-4">
              <h2 className="text-[#1a3a6b] font-bold text-lg mb-1">
                {lang === "hi" ? "आपकी स्थिति" : lang === "mr" ? "तुमची परिस्थिती" : "Your Situation"}
              </h2>
              <p className="text-gray-400 text-sm mb-5">
                {lang === "hi" ? "यह जानकारी योजनाएं खोजने में मदद करती है" : "This helps us match the right schemes"}
              </p>

              {/* Category */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.category} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "general", label: "General" },
                    { val: "obc", label: "OBC" },
                    { val: "sc", label: "SC (Dalit)" },
                    { val: "st", label: "ST (Tribal)" },
                  ].map((c) => (
                    <button
                      key={c.val}
                      onClick={() => setForm({ ...form, category: c.val })}
                      className={`${btnBase} ${form.category === c.val ? btnActive : btnInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.category === c.val ? "border-[#1a3a6b] bg-[#1a3a6b]" : "border-gray-300"}`} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occupation */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.occupation} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "student", label: lang === "hi" ? "🎓 छात्र" : "🎓 Student" },
                    { val: "farmer", label: lang === "hi" ? "🌾 किसान" : "🌾 Farmer" },
                    { val: "business", label: lang === "hi" ? "💼 व्यवसाय" : "💼 Business" },
                    { val: "employed", label: lang === "hi" ? "👔 नौकरी" : "👔 Employed" },
                    { val: "unemployed", label: lang === "hi" ? "🔍 बेरोजगार" : "🔍 Unemployed" },
                  ].map((o) => (
                    <button
                      key={o.val}
                      onClick={() => setForm({ ...form, occupation: o.val })}
                      className={`${btnBase} ${form.occupation === o.val ? btnActive : btnInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.occupation === o.val ? "border-[#1a3a6b] bg-[#1a3a6b]" : "border-gray-300"}`} />
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Income */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.income} *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: "below1L", label: "Below ₹1 Lakh" },
                    { val: "1to2L", label: "₹1L – ₹2L" },
                    { val: "2to5L", label: "₹2L – ₹5L" },
                    { val: "above5L", label: "Above ₹5L" },
                  ].map((inc) => (
                    <button
                      key={inc.val}
                      onClick={() => setForm({ ...form, income: inc.val })}
                      className={`${btnBase} ${form.income === inc.val ? btnActive : btnInactive}`}
                    >
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${form.income === inc.val ? "border-[#1a3a6b] bg-[#1a3a6b]" : "border-gray-300"}`} />
                      {inc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Special */}
              <div>
                <label className="block text-gray-700 font-semibold text-sm mb-1.5">
                  {t.special} <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <div className="space-y-2">
                  {[
                    { val: "bpl", label: lang === "hi" ? "BPL कार्ड धारक" : "BPL Card Holder" },
                    { val: "disabled", label: lang === "hi" ? "दिव्यांग" : "Differently Abled" },
                    { val: "woman_entrepreneur", label: lang === "hi" ? "महिला उद्यमी" : "Woman Entrepreneur" },
                    { val: "minority", label: lang === "hi" ? "अल्पसंख्यक" : "Minority Community" },
                  ].map((s) => (
                    <button
                      key={s.val}
                      onClick={() => toggleSpecial(s.val)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all text-left
                        ${form.special.includes(s.val)
                          ? "border-[#1a3a6b] bg-[#eef2ff] text-[#1a3a6b]"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                    >
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${form.special.includes(s.val) ? "border-[#1a3a6b] bg-[#1a3a6b]" : "border-gray-300"}`}>
                        {form.special.includes(s.val) && <span className="text-white text-xs">✓</span>}
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
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all
                ${canProceed()
                  ? "bg-[#f97316] hover:bg-orange-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {t.submit}
            </button>

            <p className="text-center text-gray-400 text-xs mt-3">
              🔒 {lang === "hi" ? "आपकी जानकारी सुरक्षित है" : "Your information is safe & private"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}