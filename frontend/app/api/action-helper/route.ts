import { NextRequest, NextResponse } from "next/server";

const BEDROCK_API_URL =
  "https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat";

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: "Respond in English.",
  hindi: "हिंदी में जवाब दें।",
  tamil: "தமிழில் பதிலளிக்கவும்.",
  telugu: "తెలుగులో సమాధానం ఇవ్వండి.",
  marathi: "मराठीत उत्तर द्या.",
  bengali: "বাংলায় উত্তর দিন।",
  gujarati: "ગુજરાતીમાં જવાબ આપો.",
  kannada: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ.",
  malayalam: "മലയാളത്തിൽ ഉത്തരം നൽകുക.",
};

// Each action type has a completely distinct, specific prompt
function buildPrompt(actionType: string, businessIdea: string, stepTitle: string, userInput: string): string {
  switch (actionType) {
    case "whatsapp-message":
      return `Write 3 professional WhatsApp templates for: "${businessIdea}"
Context: "${stepTitle}"

Message 1 (Announcement): Short, exciting, with emojis.
Message 2 (Offer): Focus on a specific deal/benefit.
Message 3 (Follow-up): Gentle reminder, high trust.

Use a friendly Indian conversational style. Include [My Name] and [Contact] placeholders.`;

    case "thumbnail-creator":
      return `Generate 3 high-CTR thumbnail concepts for: "${businessIdea}"
Brand Name: "${userInput || "Your Brand"}"
Context: "${stepTitle}"

Design Concepts:
- VIBE: [What emotion to trigger?]
- COLORS: [Hex codes for contrast]
- CONCEPT 1: [Text & Visual description]
- CONCEPT 2: [Text & Visual description]
- CONCEPT 3: [Text & Visual description]`;

    case "email-creator":
      return `Write a professional business email for: "${businessIdea}"
Context: "${stepTitle}"

Provide:
SUBJECT: (Professional & Clickable)
BODY: (Formal greeting, clear purpose, specific details related to the step, and a professional sign-off)

Maintain a polite, business-standard tone suitable for Indian clients or partners.`;

    case "reel-ideas":
      return `Generate 5 viral Reel/Shorts ideas for: "${businessIdea}"
Context: "${stepTitle}"

For each idea include:
- HOOK: First 3 seconds to grab attention.
- CONTENT: What happens in the middle.
- CTA: What should they do after watching.
- AUDIO: Suggested vibe or trending style.`;

    case "caption-generator":
      return `Write 5 catchy social media captions for: "${businessIdea}"
Context: "${stepTitle}"

Include: 
- 1 Short & Punchy caption
- 1 Story-based caption
- 1 Educational/Tip caption
- 1 Question-based caption
- 1 Hard-sell caption
- 10 Trending Hashtags (relevant to India and the business type)`;

    case "poster-generator":
      return `Analyze this business: "${businessIdea}"
Context: "${stepTitle}"

Create a business-specific poster design concept. 
Provide:
- BUSINESS_ANALYSIS: [1-sentence analysis of the business vibe]
- THEME_COLOR: [A specific hex code that fits best]
- ACCENT_COLOR: [A supporting hex code]
- HEADLINE: [Bold & Catchy]
- SUBHEADLINE: [Value proposition]
- 3_POINTS: [Short benefits]
- CTA_TEXT: [e.g. Visit Us, Call Now]`;

    case "video-pitch":
    case "video-script":
      return `Write a detailed 60-second video script for: "${businessIdea}"
Context: "${stepTitle}"

Break it down:
[0-10s] Hook & Problem
[10-40s] Your Solution & Why it's better
[40-60s] Conclusion & CTA

Add VISUAL CUES (what to show) and MUSIC VIBE.`;

    case "supplier-message":
      return `Write a supplier inquiry message for: "${businessIdea}"
Context: "${stepTitle}"

Ask about:
- Product availability/MOQ
- Price lists for wholesale
- Payment terms (COD/Credit)
- Delivery timelines

Include a professional introduction of your business.`;

    case "license-guide":
      return `List essential registrations/licenses for: "${businessIdea}"
Context: "${stepTitle}"

Provide a checklist with:
1. License Name
2. Where to Apply (Website)
3. Est. Cost (INR)
4. Timeline

Add 3 "Common Mistakes" to avoid in the legal process.`;

    case "budget-calculator":
      return `Create a startup budget for: "${businessIdea}"
Context: "${stepTitle}"

Format as a simple table:
- Setup Costs (One-time)
- Monthly Ops Costs (Recurring)
- Total Capital Needed
- 3 Money-Saving Tips for an Indian startup.`;

    case "location-finder":
      return `Location guide for: "${businessIdea}"
Context: "${stepTitle}"

List:
- 5 Ideal location traits.
- 10-point selection checklist.
- 3 Rent negotiation tips for Indian landlords.
- Red flags to watch out for.`;

    case "brand-name-generator":
    case "name-generator":
      return `Suggest 15 creative brand names for: "${businessIdea}"
Context: "${stepTitle}"

Variations:
- 5 Modern English names
- 5 Traditional/Sanskrit-based names
- 5 Catchy "Hinglish" combinations

Also, provide a one-line meaning for each.`;

    case "logo-generator":
      return `Analyze this business idea: "${businessIdea}"
Proposed Brand Name: "${userInput || "Your Brand"}"

Provide a structured design concept for 3 logos:
- ANALYSIS: [1-sentence business vibe analysis]
- PRIMARY_COLOR: [Best hex code for this business type]
- SECONDARY_COLOR: [Supporting hex code]
- ACCENT_COLOR: [Punchy accent hex code]

Then for 3 concepts:
CONCEPT 1 (Modern): [Symbol idea]
CONCEPT 2 (Traditional): [Symbol idea]
CONCEPT 3 (Minimal): [Symbol idea]

TAGLINE: [A catchy tagline]`;

    case "generic-helper":
    default:
      return `Expert guidance for: "${businessIdea}"
Step: "${stepTitle}"

Provide:
- WHAT TO DO (3-5 clear steps)
- RESOURCES NEEDED
- PRO TIP (Specific to Indian market)`;
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      actionType,
      stepTitle,
      businessIdea,
      userInput = "",
      language = "english",
    } = await request.json();

    console.log("Action helper called:", { actionType, stepTitle, businessIdea, language });

    const languageInstruction =
      LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS["english"];

    const taskPrompt = buildPrompt(actionType, businessIdea, stepTitle, userInput);

    const fullMessage = `You are an expert business consultant helping first-time entrepreneurs in India.
${languageInstruction}
Use simple language. Be specific. Use INR (₹) for costs. Consider Indian market context.

${taskPrompt}`;

    const response = await fetch(BEDROCK_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // ✅ Correct format your Lambda expects
      body: JSON.stringify({ message: fullMessage }),
    });

    const responseText = await response.text();
    console.log("Bedrock status:", response.status);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Bedrock API error: ${response.status}`, details: responseText },
        { status: response.status }
      );
    }

    let data: any;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ error: "Invalid JSON from Bedrock" }, { status: 500 });
    }

    // Handle all Lambda response shapes
    const content =
      data?.reply ||
      data?.response ||
      data?.content ||
      data?.message ||
      data?.text ||
      (typeof data === "string" ? data : null);

    if (!content) {
      console.error("No content in response:", data);
      return NextResponse.json({ error: "No content in response", raw: data }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Action helper error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}