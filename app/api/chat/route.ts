import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, user, lang } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ API key not found. Add GROQ_API_KEY to .env.local and restart server.",
      });
    }

    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    };
    const selectedLanguage = languageMap[lang] || "English";

    const userProfile = user
      ? `User: ${user.name}, Age ${user.age}, ${user.gender}, ${user.state}, ${user.category?.toUpperCase()}, ${user.occupation}, Income: ${user.income}`
      : "No profile.";

    const prompt = `You are Sahayak AI helping Indian citizens find government welfare schemes.

${userProfile}

Reply in ${selectedLanguage} only. Under 150 words. Simple language.
Mention scheme name, benefit amount, and apply link (gov.in websites).
If unsure say: verify at myscheme.gov.in

User: ${message}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      console.error("Groq error:", err);
      return NextResponse.json({
        reply: `AI error: ${err?.error?.message || "Unknown"}`,
      });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, try again.";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({
      reply: "Server error. Restart dev server and try again.",
    });
  }
}