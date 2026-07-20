import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, user, lang, matchedSchemes } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "API key not found. Add GROQ_API_KEY to .env.local",
      });
    }

    // AI speaks language natively — no Google Translate needed
    const languageInstructions: Record<string, string> = {
      en: "Reply in English only.",
      hi: "केवल हिंदी में जवाब दें। सरल और आसान हिंदी इस्तेमाल करें।",
      mr: "फक्त मराठीत उत्तर द्या. सोपी मराठी वापरा.",
      ta: "தமிழில் மட்டும் பதில் சொல்லுங்கள். எளிய தமிழ் பயன்படுத்துங்கள்.",
      te: "తెలుగులో మాత్రమే సమాధానం చెప్పండి. సులభమైన తెలుగు వాడండి.",
      bn: "শুধুমাত্র বাংলায় উত্তর দিন। সহজ বাংলা ব্যবহার করুন।",
      gu: "ફક્ત ગુજરાતીમાં જ જવાબ આપો. સરળ ગુજરાતી વાપરો.",
      pa: "ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। ਸਰਲ ਪੰਜਾਬੀ ਵਰਤੋ।",
    };

    const langInstruction = languageInstructions[lang] || languageInstructions.en;

    const userProfile = user ? `
User Profile:
- Name: ${user.name || "Not provided"}
- Age: ${user.age || "Not provided"}
- Gender: ${user.gender || "Not provided"}
- State: ${user.state || "Not provided"}
- Category: ${user.category?.toUpperCase() || "Not provided"}
- Occupation: ${user.occupation || "Not provided"}
- Income: ${user.income || "Not provided"}
- Special: ${Array.isArray(user.special) ? user.special.join(", ") : "None"}
` : "No profile loaded.";

    const schemesList = matchedSchemes && matchedSchemes.length > 0
      ? matchedSchemes.slice(0, 8).map((s: any) => `- ${s.name}: ${s.benefit}`).join("\n")
      : "No matched schemes available.";

    const systemPrompt = `You are Sahayak AI — a trusted government scheme advisor helping Indian citizens.

LANGUAGE INSTRUCTION (MOST IMPORTANT):
${langInstruction}

${userProfile}

Matched Schemes for this user:
${schemesList}

YOUR TASK:
1. Analyze the user's profile carefully
2. Select TOP 3 most relevant schemes for them
3. For each scheme explain:
   - Scheme name
   - Benefit amount
   - Why THIS user is eligible
   - Key documents needed
4. Give one clear next step at the end

RULES:
- Use very simple language (Class 6 level)
- Be warm and encouraging like a helpful elder
- Keep response under 250 words
- If unsure about any detail, say "Please verify at myscheme.gov.in"
- Never make up scheme details

OUTPUT FORMAT:
Start with one warm greeting using user's name.

Top schemes for you:

1. [Scheme Name]
   Benefit: 
   Why eligible: 
   Documents: 

2. [Scheme Name]
   Benefit:
   Why eligible:
   Documents:

3. [Scheme Name]
   Benefit:
   Why eligible:
   Documents:

Next step: [one clear action]`;

    const userMessage = message || "Based on my profile, which schemes should I apply for first?";

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        max_tokens: 700,
        temperature: 0.6,
      }),
    });

    if (!groqRes.ok) {  
      const err = await groqRes.json();
      return NextResponse.json({
        reply: `Error: ${err?.error?.message || "Please try again."}`,
      });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, please try again.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({
      reply: "Server error. Please restart and try again.",
    });
  }
}