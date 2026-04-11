import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, user, lang, matchedSchemes } = await req.json();

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "⚠️ API key not found. Add GROQ_API_KEY to .env.local",
      });
    }

    const languageMap: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
    };
    const selectedLanguage = languageMap[lang] || "English";

    const userProfile = user ? `
- Name: ${user.name || "Not provided"}
- Age: ${user.age || "Not provided"}
- Gender: ${user.gender || "Not provided"}
- State: ${user.state || "Not provided"}
- Category: ${user.category?.toUpperCase() || "Not provided"}
- Occupation: ${user.occupation || "Not provided"}
- Annual Income: ${user.income || "Not provided"}
- Special Conditions: ${Array.isArray(user.special) ? user.special.join(", ") : "None"}
` : "No profile loaded.";

    const schemesList = matchedSchemes
      ? matchedSchemes.slice(0, 10).map((s: any) => `- ${s.name}: ${s.benefit}`).join("\n")
      : "No schemes data provided.";

    const systemPrompt = `You are Yojana AI, an intelligent assistant that helps Indian citizens find the BEST government schemes based on their personal profile.

You are NOT a generic chatbot. You are a decision-making system.

━━━━━━━━━━━━━━━━━━━━━━━
USER PROFILE:
${userProfile}

TOP MATCHED SCHEMES:
${schemesList}
━━━━━━━━━━━━━━━━━━━━━━━

YOUR TASK:

1. Analyze the user profile carefully:
- Age, Income, Category, Occupation, Gender, Special conditions

2. From the given schemes:
- Select TOP 3 most useful schemes for THIS specific user
- Rank them from BEST to least useful based on their profile

3. For EACH scheme explain:
- Scheme Name
- Benefit (money / loan / insurance / subsidy)
- WHY this user is specifically eligible
- Documents required (simple words)

4. Language Rules:
- Reply ONLY in ${selectedLanguage}
- Use VERY simple language (like explaining to a villager)
- Short sentences only

5. Style:
- Friendly and warm — like a helpful elder
- Not robotic
- Easy words only

6. Accuracy:
- Do NOT guess wrong info
- If unsure say: "Please verify on official government portal myscheme.gov.in"

━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT FORMAT:

Start with 1 warm greeting line using their name.

Then:

🔥 Best Schemes for You:

1. [Scheme Name]
   👉 Benefit: 
   👉 Why you qualify:
   👉 Documents needed:

2. [Scheme Name]
   👉 Benefit:
   👉 Why you qualify:
   👉 Documents needed:

3. [Scheme Name]
   👉 Benefit:
   👉 Why you qualify:
   👉 Documents needed:

End with one helpful next step suggestion.`;

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
        max_tokens: 800,
        temperature: 0.6,
      }),
    });

    if (!groqRes.ok) {
      const err = await groqRes.json();
      return NextResponse.json({
        reply: `AI error: ${err?.error?.message || "Unknown error"}`,
      });
    }

    const data = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() || "Sorry, try again.";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({
      reply: "Server error. Please restart and try again.",
    });
  }
}