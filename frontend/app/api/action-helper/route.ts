import { NextRequest, NextResponse } from "next/server";

const BEDROCK_API_URL =
  "https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat";

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  english: "Respond in English.",
  hindi: "हिंदी में जवाब दें। (Respond in Hindi)",
  tamil: "தமிழில் பதிலளிக்கவும். (Respond in Tamil)",
  telugu: "తెలుగులో సమాధానం ఇవ్వండి. (Respond in Telugu)",
  marathi: "मराठीत उत्तर द्या. (Respond in Marathi)",
  bengali: "বাংলায় উত্তর দিন। (Respond in Bengali)",
  gujarati: "ગુજરાતીમાં જવાબ આપો. (Respond in Gujarati)",
  kannada: "ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. (Respond in Kannada)",
  malayalam: "മലയാളത്തിൽ ഉത്തരം നൽകുക. (Respond in Malayalam)",
};

const ACTION_PROMPTS: Record<string, string> = {
  "whatsapp-message": `Create a professional WhatsApp message that is:
- Clear and easy to understand
- Friendly and approachable
- Under 200 words
- Includes relevant emojis
- Has a clear call-to-action
- Written in simple language for Tier 2/3 India audience`,

  "poster-generator": `Create poster content with:
- Catchy headline (5-7 words)
- Key information in bullet points
- Suggested colors and design elements
- Contact details placeholder
- Call-to-action
- Festival/seasonal tie-in if relevant`,

  "video-pitch": `Write a 60-90 second video script that:
- Opens with a hook
- Explains the business clearly
- Highlights key benefits
- Includes emotional appeal
- Ends with strong call-to-action
- Uses simple, conversational language`,

  "business-explainer": `Explain the business in a professional yet simple way:
- What the business does
- Who it serves
- Why it's needed
- How it makes money
- What makes it unique
- Written for bank officers/officials`,

  "supplier-message": `Create a professional supplier outreach message:
- Introduce the business
- State requirements clearly
- Ask for pricing/samples
- Mention order volume potential
- Request meeting/call
- Professional but friendly tone`,

  "customer-message": `Create an engaging customer message:
- Grab attention immediately
- Highlight key benefits
- Create urgency or excitement
- Include special offer if applicable
- Clear next steps
- Friendly, welcoming tone`,

  "social-media-post": `Create an engaging social media post:
- Attention-grabbing opening
- Visual description suggestions
- Relevant hashtags (5-8)
- Emoji usage
- Call-to-action
- Platform-appropriate length`,

  "budget-calculator": `Provide a detailed budget breakdown:
- Initial investment items with estimated costs
- Monthly recurring expenses
- One-time setup costs
- Emergency fund recommendation
- Total startup capital needed
- All costs in INR (₹)`,

  "location-finder": `Provide location selection guidance:
- Key factors to consider
- Ideal characteristics for this business
- Red flags to avoid
- How to evaluate foot traffic
- Rent negotiation tips
- Local market research tips`,

  "menu-creator": `Help create a menu/product list:
- Suggested items/services
- Pricing strategy for each
- Popular combinations
- Seasonal variations
- Presentation tips
- Competitive positioning`,

  "pricing-helper": `Provide pricing strategy guidance:
- Cost calculation method
- Competitive pricing analysis
- Profit margin recommendations
- Discount strategy
- Premium vs budget options
- Psychological pricing tips`,

  "license-guide": `Provide license and permit guidance:
- Required licenses for this business
- Registration process steps
- Required documents
- Approximate costs and timeline
- Where to apply
- Common mistakes to avoid`,

  "generic-helper": `Provide detailed step-by-step guidance:
- Break down the step into smaller tasks
- Provide specific action items
- List required resources
- Suggest timeline
- Highlight common challenges
- Give practical tips`,
};

export async function POST(request: NextRequest) {
  try {
    const {
      actionType,
      stepTitle,
      businessIdea,
      userInput,
      language = "english",
    } = await request.json();

    // Build the prompt
    const actionPrompt = ACTION_PROMPTS[actionType] || ACTION_PROMPTS["generic-helper"];
    const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS["english"];

    const systemPrompt = `You are a helpful business assistant for first-time entrepreneurs in India.
${actionPrompt}

${languageInstruction}

Keep language simple (6th grade reading level).
Be encouraging and supportive.
Provide practical, actionable content.
Consider Indian context (local resources, costs in INR, cultural factors).`;

    const userPrompt = `Business Idea: ${businessIdea}

Current Step: ${stepTitle}

${userInput ? `Additional Details: ${userInput}` : ""}

Please help me complete this step by generating the appropriate content.`;

    // Call Bedrock API
    const response = await fetch(BEDROCK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    const content = data.response || data.content || "Unable to generate content. Please try again.";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Action helper error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
