"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const lang = localStorage.getItem("lang");
    if (!lang) {
      router.replace("/language");
    } else {
      router.replace("/home");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        <p className="text-white/50 text-sm font-medium tracking-widest uppercase">
          Loading
        </p>
      </div>
    </div>
  );
}