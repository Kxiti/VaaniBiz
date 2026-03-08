import { NextResponse } from 'next/server';

const BEDROCK_API_URL = 'https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat';

const SYSTEM_INSTRUCTION = `You are a startup mentor and business analyst.

When a user describes a business idea, you must analyze the idea and provide structured business insights instead of generic advice.

Your response must include:
- Business summary (1–2 sentences explaining the idea)
- Market opportunity and demand
- Target customers
- Revenue model
- Legal considerations or regulations
- Required equipment or resources
- Startup cost estimate (low / medium / high)
- Key challenges and risks
- One suggestion to improve or differentiate the idea

Keep the response concise and practical. Use bullet points or sections.`;

export async function GET() {
    try {
        console.log('Testing Bedrock API connection...');

        const testMessage = 'I want to start a tea stall near my college';
        const enhancedMessage = `${SYSTEM_INSTRUCTION}\n\nUser's business idea: ${testMessage}`;

        const response = await fetch(BEDROCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: enhancedMessage }),
        });

        const responseText = await response.text();

        return NextResponse.json({
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            body: responseText,
            parsedBody: (() => {
                try {
                    return JSON.parse(responseText);
                } catch {
                    return null;
                }
            })(),
        });

    } catch (error) {
        return NextResponse.json({
            error: 'Test failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}
