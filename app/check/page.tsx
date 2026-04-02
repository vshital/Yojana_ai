"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/lang";

const TOTAL_STEPS = 4;

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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleSpecial = (val: string) => {
    setForm((prev) => ({
      ...prev,
      special: prev.special.includes(val)
        ? prev.special.filter((s) => s !== val)
        : [...prev.special, val],
    }));
  };

  const handleSubmit = () => {
    localStorage.setItem("user", JSON.stringify(form));
    const params = new URLSearchParams({
      name: form.name,
      age: form.age,
      gender: form.gender,
      state: form.state,
      category: form.category,
      occupation: form.occupation,
      income: form.income,
      special: form.special.join(","),
    });
    router.push(`/results?${params}`);
  };

  const canProceed = () => {
    if (step === 1) return form.name && form.age && form.gender;
    if (step === 2) return form.state && form.category;
    if (step === 3) return form.occupation && form.income;
    return true;
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/20 focus:outline-none focus:border-orange-500/60 focus:bg-white/8 transition-all";
  const selectCls =
    "w-full bg-[#0f0f18] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-orange-500/60 transition-all appearance-none";
  const labelCls = "block text-white/60 text-sm font-medium mb-2";

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-4">
        <button
          onClick={() => (step === 1 ? router.back() : setStep(step - 1))}
          className="text-white/40 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          ← {t.back}
        </button>
        <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-500"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <span className="text-white/30 text-sm">
          {t.step} {step} {t.of} {TOTAL_STEPS}
        </span>
      </div>

      {/* Form */}
      <div className="flex-1 px-6 py-6 max-w-lg mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">{t.form_title}</h1>
          <p className="text-white/30 text-sm">{t.form_subtitle}</p>
        </div>

        {/* Step 1 — Personal */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelCls}>{t.name}</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ramesh Kumar"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{t.age}</label>
              <input
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="e.g. 28"
                min="1"
                max="120"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{t.gender}</label>
              <div className="grid grid-cols-3 gap-3">
                {["male", "female", "other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setForm({ ...form, gender: g })}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all
                      ${form.gender === g
                        ? "bg-orange-500 border-orange-400 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-orange-500/30"
                      }`}
                  >
                    {g === "male" ? "👨 " : g === "female" ? "👩 " : "🧑 "}
                    {t[g]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Location & Category */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelCls}>{t.state}</label>
              <div className="relative">
                <select
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className={selectCls}
                >
                  <option value="">Select your state</option>
                  {states.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none">▾</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>{t.category}</label>
              <div className="grid grid-cols-2 gap-3">
                {["general", "obc", "sc", "st"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, category: c })}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all
                      ${form.category === c
                        ? "bg-orange-500 border-orange-400 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-orange-500/30"
                      }`}
                  >
                    {t[c]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 — Occupation & Income */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className={labelCls}>{t.occupation}</label>
              <div className="grid grid-cols-2 gap-3">
                {["student", "farmer", "business", "employed", "unemployed"].map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setForm({ ...form, occupation: o })}
                    className={`py-3 px-3 rounded-xl border font-medium text-sm transition-all text-left
                      ${form.occupation === o
                        ? "bg-orange-500 border-orange-400 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-orange-500/30"
                      }`}
                  >
                    {o === "student" ? "🎓 " : o === "farmer" ? "🌾 " : o === "business" ? "💼 " : o === "employed" ? "👔 " : "🔍 "}
                    {t[o]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>{t.income}</label>
              <div className="grid grid-cols-2 gap-3">
                {["below1L", "1to2L", "2to5L", "above5L"].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => setForm({ ...form, income: inc })}
                    className={`py-3 rounded-xl border font-medium text-sm transition-all
                      ${form.income === inc
                        ? "bg-orange-500 border-orange-400 text-white"
                        : "bg-white/5 border-white/10 text-white/50 hover:border-orange-500/30"
                      }`}
                  >
                    {t[inc]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Special Conditions */}
        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <p className="text-white/40 text-sm mb-5">
              Select all that apply (optional — helps us find more schemes)
            </p>
            <div className="space-y-3">
              {["bpl", "disabled", "woman_entrepreneur", "minority"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSpecial(s)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left
                    ${form.special.includes(s)
                      ? "bg-orange-500/10 border-orange-500/40 text-white"
                      : "bg-white/5 border-white/10 text-white/50 hover:border-orange-500/20"
                    }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all
                      ${form.special.includes(s)
                        ? "bg-orange-500 border-orange-400"
                        : "border-white/20"
                      }`}
                  >
                    {form.special.includes(s) && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className="font-medium text-sm">{t[s]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-10 flex gap-3">
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all
                ${canProceed()
                  ? "bg-orange-500 hover:bg-orange-400 text-white hover:scale-[1.02]"
                  : "bg-white/5 text-white/20 cursor-not-allowed"
                }`}
            >
              {t.next}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex-1 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white hover:scale-[1.02] transition-all"
            >
              {t.submit}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}