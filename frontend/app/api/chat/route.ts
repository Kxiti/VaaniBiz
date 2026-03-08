import { NextRequest, NextResponse } from 'next/server';

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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        console.log('Proxying request to Bedrock API:', message);

        // Combine system instruction with user message
        const enhancedMessage = `${SYSTEM_INSTRUCTION}\n\nUser's business idea: ${message}`;

        // Forward request to AWS Lambda with enhanced prompt
        const response = await fetch(BEDROCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ message: enhancedMessage }),
            cache: 'no-store',
        });

        console.log('Bedrock API response status:', response.status);
        console.log('Bedrock API response headers:', Object.fromEntries(response.headers.entries()));

        // Get response text first to see what we're getting
        const responseText = await response.text();
        console.log('Bedrock API raw response:', responseText);

        if (!response.ok) {
            console.error('Bedrock API error response:', responseText);

            // Try to parse as JSON
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

        console.log('Bedrock API parsed response:', data);
        return NextResponse.json(data);

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
