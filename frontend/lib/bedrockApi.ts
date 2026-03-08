/**
 * API client for AWS Lambda + Amazon Bedrock integration
 * Uses Next.js API route as proxy to avoid CORS issues
 */

const BEDROCK_API_URL = '/api/chat'; // Next.js API route proxy
const REQUEST_TIMEOUT = 30000; // 30 seconds

interface BedrockApiResponse {
    reply: string;
}

/**
 * Sends a message to the Bedrock API and returns the AI response
 * @param message - The user's message text
 * @returns Promise resolving to the AI's reply string
 * @throws Error with descriptive message on failure
 */
export async function sendMessageToBedrock(message: string): Promise<string> {
    console.log('Sending message to Bedrock API:', message);
    console.log('API URL:', BEDROCK_API_URL);

    try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

        // Make POST request to Bedrock API
        const response = await fetch(BEDROCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Check for HTTP errors
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('Server error response:', errorData);

            if (errorData.details) {
                throw new Error(`Server error: ${errorData.error || response.statusText}. ${errorData.details}`);
            }
            throw new Error(`Server error: ${errorData.error || response.statusText}`);
        }

        // Parse JSON response
        const data: BedrockApiResponse = await response.json();
        console.log('Received data:', data);

        // Validate response structure
        if (!data.reply || typeof data.reply !== 'string') {
            throw new Error('Invalid response format from API');
        }

        return data.reply;

    } catch (error) {
        console.error('API Error:', error);

        // Handle timeout errors
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again.');
        }

        // Handle network errors (including CORS)
        if (error instanceof TypeError) {
            throw new Error('Network connection failed. This might be a CORS issue or network problem. Check browser console for details.');
        }

        // Re-throw other errors with their original message
        if (error instanceof Error) {
            throw error;
        }

        // Fallback for unknown error types
        throw new Error('An unexpected error occurred');
    }
}
