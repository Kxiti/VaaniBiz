import { NextRequest, NextResponse } from 'next/server';

const BEDROCK_API_URL = 'https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat';

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  hindi: 'हिंदी में जवाब दें। सरल और स्पष्ट भाषा का उपयोग करें।',
  tamil: 'தமிழில் பதிலளிக்கவும். எளிய மற்றும் தெளிவான மொழியைப் பயன்படுத்தவும்.',
  telugu: 'తెలుగులో సమాధానం ఇవ్వండి. సరళమైన మరియు స్పష్టమైన భాషను ఉపయోగించండి.',
  marathi: 'मराठीत उत्तर द्या. सोपी आणि स्पष्ट भाषा वापरा.',
  bengali: 'বাংলায় উত্তর দিন। সহজ এবং স্পষ্ট ভাষা ব্যবহার করুন।',
  gujarati: 'ગુજરાતીમાં જવાબ આપો. સરળ અને સ્પષ્ટ ભાષાનો ઉપયોગ કરો.',
  kannada: 'ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಸರಳ ಮತ್ತು ಸ್ಪಷ್ಟ ಭಾಷೆಯನ್ನು ಬಳಸಿ.',
  malayalam: 'മലയാളത്തിൽ ഉത്തരം നൽകുക. ലളിതവും വ്യക്തവുമായ ഭാഷ ഉപയോഗിക്കുക.',
  english: 'Respond in English. Use simple and clear language.',
};

const ROADMAP_SYSTEM_INSTRUCTION = `You are an expert startup mentor specializing in creating actionable, step-by-step business roadmaps for first-time entrepreneurs in India.

Given a business idea and its analysis, create a detailed startup roadmap with 5-8 concrete, actionable steps.

For each step, provide:
1. **Step Title**: Clear, action-oriented title
2. **Description**: What exactly needs to be done (2-3 sentences)
3. **Timeline**: Realistic time estimate (e.g., "1-2 weeks", "3-5 days")
4. **Resources Needed**: Specific items, documents, or people required
5. **Estimated Cost**: Cost range in INR (if applicable)
6. **Priority**: High/Medium/Low
7. **Success Criteria**: How to know this step is complete

Format your response as a structured roadmap with clear sections. Use this format:

## Step 1: [Title]
**Timeline:** [time estimate]
**Priority:** [High/Medium/Low]

**What to Do:**
[Detailed description]

**Resources Needed:**
- [Resource 1]
- [Resource 2]

**Estimated Cost:** ₹[amount] or [description]

**Success Criteria:**
- [Criterion 1]
- [Criterion 2]

---

Make the roadmap:
- Practical and specific to Indian context
- Sequential (each step builds on previous)
- Realistic for first-time entrepreneurs
- Include local resources (where to get licenses, suppliers, etc.)
- Consider budget constraints
- Include both setup and launch phases

Focus on actionable steps, not generic advice.`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { businessIdea, businessAnalysis, language = 'english' } = body;

        if (!businessIdea || typeof businessIdea !== 'string') {
            return NextResponse.json(
                { error: 'Business idea is required' },
                { status: 400 }
            );
        }

        console.log('Generating roadmap for:', businessIdea);
        console.log('Language:', language);

        // Get language-specific instruction
        const languageInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS['english'];

        // Create comprehensive prompt
        const roadmapPrompt = `${ROADMAP_SYSTEM_INSTRUCTION}

IMPORTANT: ${languageInstruction}

Business Idea: ${businessIdea}

${businessAnalysis ? `Previous Analysis:\n${businessAnalysis}\n` : ''}

Now create a detailed, step-by-step startup roadmap for this business.`;

        // Call Bedrock API
        const response = await fetch(BEDROCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ message: roadmapPrompt }),
            cache: 'no-store',
        });

        console.log('Bedrock API response status:', response.status);

        const responseText = await response.text();
        console.log('Bedrock API raw response:', responseText);

        if (!response.ok) {
            console.error('Bedrock API error response:', responseText);
            let errorData;
            try {
                errorData = JSON.parse(responseText);
            } catch {
                errorData = { error: responseText };
            }
            return NextResponse.json(
                { error: `API error: ${response.status}`, details: errorData },
                { status: response.status }
            );
        }

        // Parse successful response
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse response as JSON:', responseText);
            return NextResponse.json(
                { error: 'Invalid JSON response from API', details: responseText },
                { status: 500 }
            );
        }

        console.log('Roadmap generated successfully');
        return NextResponse.json(data);

    } catch (error) {
        console.error('Roadmap generation error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
