# Design Document: Bedrock Chat Integration

## Overview

This design integrates the AWS Lambda + Amazon Bedrock API into the VaaniBiz AI Next.js application, enabling users to have interactive conversations about their business ideas. The integration adds a chat interface to the /idea page while preserving the existing UI design and user experience.

The solution follows a client-side architecture where the Next.js frontend communicates directly with the AWS Lambda endpoint. The design emphasizes simplicity, error resilience, and maintaining the existing visual design system.

## Architecture

### High-Level Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  /idea Page     │────────▶│  API Client      │────────▶│  AWS Lambda     │
│  (React)        │         │  (fetch)         │         │  + Bedrock      │
│                 │◀────────│                  │◀────────│                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
       │
       │ uses
       ▼
┌─────────────────┐
│  ChatInterface  │
│  Component      │
│  - Messages     │
│  - ChatInput    │
│  - Loading      │
│  - Errors       │
└─────────────────┘
```

### Component Hierarchy

```
IdeaPage
├── ChatInterface (new)
│   ├── MessageList (new)
│   │   ├── UserMessage (new)
│   │   ├── AIMessage (new)
│   │   └── LoadingMessage (new)
│   ├── ErrorDisplay (new)
│   └── ChatInput (existing)
└── LanguageSelector (existing)
```

## Components and Interfaces

### 1. API Client Service

**Location:** `frontend/lib/bedrockApi.ts`

**Purpose:** Handles HTTP communication with the AWS Lambda endpoint.

**Interface:**

```typescript
interface BedrockApiResponse {
  reply: string;
}

interface BedrockApiError {
  message: string;
  type: 'network' | 'server' | 'timeout';
}

async function sendMessageToBedrock(
  message: string
): Promise<BedrockApiResponse>
```

**Implementation Details:**
- Uses native `fetch` API for HTTP requests
- Sets 30-second timeout for API calls
- Throws typed errors for different failure scenarios
- Validates response structure before returning

### 2. Message Type Definitions

**Location:** `frontend/lib/types.ts`

**Purpose:** Define the structure of chat messages and conversation state.

**Interface:**

```typescript
type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

interface ConversationState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
}
```

### 3. ChatInterface Component

**Location:** `frontend/components/ChatInterface.tsx`

**Purpose:** Main container component that manages conversation state and orchestrates child components.

**Props:**

```typescript
interface ChatInterfaceProps {
  placeholder?: string;
  className?: string;
}
```

**State Management:**

```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Key Methods:**

```typescript
async function handleMessageSend(message: string): Promise<void> {
  // 1. Add user message to state
  // 2. Set loading state
  // 3. Call API
  // 4. Add AI response to state
  // 5. Clear loading state
  // 6. Handle errors
}

function handleRetry(): void {
  // Retry the last failed message
}
```

### 4. MessageList Component

**Location:** `frontend/components/MessageList.tsx`

**Purpose:** Renders the list of messages with auto-scrolling behavior.

**Props:**

```typescript
interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
}
```

**Features:**
- Auto-scrolls to bottom when new messages arrive
- Uses `useRef` for scroll container
- Uses `useEffect` to trigger scroll on message changes

### 5. UserMessage Component

**Location:** `frontend/components/UserMessage.tsx`

**Purpose:** Renders a user message with appropriate styling.

**Props:**

```typescript
interface UserMessageProps {
  content: string;
  timestamp: Date;
}
```

**Styling:**
- Right-aligned
- Uses gradient-primary background
- White text
- Rounded corners with card-shadow

### 6. AIMessage Component

**Location:** `frontend/components/AIMessage.tsx`

**Purpose:** Renders an AI assistant message with appropriate styling.

**Props:**

```typescript
interface AIMessageProps {
  content: string;
  timestamp: Date;
}
```

**Styling:**
- Left-aligned
- White background with card-shadow
- Dark text
- Rounded corners

### 7. LoadingMessage Component

**Location:** `frontend/components/LoadingMessage.tsx`

**Purpose:** Displays a loading indicator while waiting for AI response.

**Features:**
- Animated dots or spinner
- Left-aligned (appears as AI message)
- Uses existing animation patterns from framer-motion

### 8. ErrorDisplay Component

**Location:** `frontend/components/ErrorDisplay.tsx`

**Purpose:** Shows error messages with retry functionality.

**Props:**

```typescript
interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
  onDismiss: () => void;
}
```

**Features:**
- Red/warning color scheme
- Retry button
- Dismiss button
- Animated entrance with framer-motion

## Data Models

### ChatMessage

```typescript
interface ChatMessage {
  id: string;           // Unique identifier (UUID)
  role: MessageRole;    // 'user' or 'assistant'
  content: string;      // Message text content
  timestamp: Date;      // When message was created
}
```

**Invariants:**
- `id` must be unique within a conversation
- `content` must not be empty
- `timestamp` must be a valid Date object
- `role` must be either 'user' or 'assistant'

### ConversationState

```typescript
interface ConversationState {
  messages: ChatMessage[];  // Ordered list of messages
  isLoading: boolean;       // Whether API call is in progress
  error: string | null;     // Current error message, if any
}
```

**Invariants:**
- `messages` array maintains chronological order
- `isLoading` is true only when an API call is active
- `error` is null when no error exists
- When `isLoading` is true, the last message should be from the user

### API Request/Response

**Request:**
```typescript
interface BedrockApiRequest {
  message: string;  // User's message text
}
```

**Response:**
```typescript
interface BedrockApiResponse {
  reply: string;    // AI's response text
}
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: API Request Body Format

*For any* user message string, when sent to the API, the request body should have the structure `{"message": "<content>"}` where `<content>` is the user's message.

**Validates: Requirements 1.2**

### Property 2: API Response Parsing

*For any* valid API response with structure `{"reply": "<content>"}`, the API client should successfully parse and return the reply content.

**Validates: Requirements 1.3**

### Property 3: Error Handling

*For any* API failure (network, server, timeout), the API client should return a typed error with descriptive information and error type classification.

**Validates: Requirements 1.4, 4.5**

### Property 4: Message State Management

*For any* message sent (user or AI), the conversation state should be updated to include that message with correct role, content, and timestamp.

**Validates: Requirements 2.1, 2.2, 7.1, 7.3**

### Property 5: Message Visual Distinction

*For any* rendered message, user messages and AI messages should have different visual styling (CSS classes or inline styles).

**Validates: Requirements 2.3**

### Property 6: Chronological Message Ordering

*For any* sequence of messages in the conversation state, they should be ordered by timestamp in ascending order (oldest first).

**Validates: Requirements 2.5**

### Property 7: Auto-scroll Behavior

*For any* new message added to the conversation, the message list should scroll to display the latest message at the bottom.

**Validates: Requirements 2.4**

### Property 8: Loading State Lifecycle

*For any* message send operation, the loading state should be true during the API call and false after completion (success or error).

**Validates: Requirements 3.1, 3.3, 3.4**

### Property 9: Input Disabled During Loading

*For any* time when loading state is true, the ChatInput component should be disabled and prevent message submission.

**Validates: Requirements 3.2, 6.3**

### Property 10: Error Display

*For any* error that occurs (network, server, timeout), an error message should be displayed to the user with retry functionality.

**Validates: Requirements 4.1, 4.2, 4.3**

### Property 11: Conversation History Preservation

*For any* error that occurs, the existing messages in the conversation state should remain unchanged (no messages removed or modified).

**Validates: Requirements 4.4**

### Property 12: Input Clearing After Send

*For any* successfully sent message, the ChatInput component should clear its content and be ready for the next message.

**Validates: Requirements 6.5**

### Property 13: Input Re-enabled After Response

*For any* completed API call (success or error), the ChatInput component should be re-enabled to allow sending the next message.

**Validates: Requirements 6.4**

### Property 14: API Callback Integration

*For any* message entered in ChatInput and submitted, the onMessageSend callback should trigger the API call to the Bedrock endpoint.

**Validates: Requirements 6.2**

### Property 15: Message ID Uniqueness

*For any* two messages in the conversation state, they should have different unique identifiers.

**Validates: Data Model Invariants**

### Property 16: Non-empty Message Content

*For any* message in the conversation state, the content field should not be empty.

**Validates: Data Model Invariants**

## Error Handling

### Error Types

The system handles three categories of errors:

1. **Network Errors**: Connection failures, DNS resolution issues, offline state
2. **Server Errors**: HTTP 4xx/5xx responses from the Lambda endpoint
3. **Timeout Errors**: Requests exceeding 30-second timeout

### Error Handling Strategy

**API Client Level:**
```typescript
try {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);
  
  const response = await fetch(BEDROCK_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
    signal: controller.signal
  });
  
  clearTimeout(timeoutId);
  
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
  
} catch (error) {
  if (error.name === 'AbortError') {
    throw { type: 'timeout', message: 'Request timed out' };
  }
  if (error instanceof TypeError) {
    throw { type: 'network', message: 'Network connection failed' };
  }
  throw { type: 'server', message: error.message };
}
```

**Component Level:**
- Display user-friendly error messages
- Provide retry button for failed requests
- Maintain conversation history during errors
- Log errors to console for debugging

### Error Recovery

**Retry Mechanism:**
- Store the last failed message
- Retry button re-attempts the same API call
- Clear error state on successful retry
- Limit retries to prevent infinite loops (handled by user action)

**Graceful Degradation:**
- Conversation history preserved during errors
- User can continue sending new messages after error
- Error messages are dismissible
- No data loss on temporary failures

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Both testing approaches are complementary and necessary. Unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across many generated inputs.

### Property-Based Testing

**Library:** We will use `fast-check` for TypeScript property-based testing.

**Configuration:**
- Minimum 100 iterations per property test
- Each test tagged with format: `Feature: bedrock-chat-integration, Property {number}: {property_text}`
- Each correctness property implemented by a SINGLE property-based test

**Example Property Test:**

```typescript
import fc from 'fast-check';

// Feature: bedrock-chat-integration, Property 1: API Request Body Format
test('API request body format', () => {
  fc.assert(
    fc.property(fc.string({ minLength: 1 }), (message) => {
      const requestBody = createRequestBody(message);
      expect(requestBody).toEqual({ message });
    }),
    { numRuns: 100 }
  );
});
```

### Unit Testing

**Focus Areas:**
- Specific error scenarios (network failure, 404, 500 errors)
- Initial state (empty conversation on load)
- Component rendering (ChatInput usage, styling classes)
- Edge cases (empty responses, malformed JSON)

**Example Unit Test:**

```typescript
test('displays error message on network failure', async () => {
  // Mock fetch to throw network error
  global.fetch = jest.fn(() => Promise.reject(new TypeError('Network error')));
  
  const { getByText, getByRole } = render(<ChatInterface />);
  
  // Send message
  const input = getByRole('textbox');
  fireEvent.change(input, { target: { value: 'Hello' } });
  fireEvent.submit(input.closest('form'));
  
  // Verify error display
  await waitFor(() => {
    expect(getByText(/network connection failed/i)).toBeInTheDocument();
    expect(getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
```

### Test Coverage Goals

- API client: 100% coverage (critical path)
- ChatInterface component: 90%+ coverage
- Message components: 80%+ coverage
- Error handling: 100% coverage (all error types)

### Integration Testing

While not part of the initial implementation, integration tests should verify:
- End-to-end message flow (user input → API → display)
- Error recovery flows
- Loading state transitions
- Scroll behavior with multiple messages

These can be implemented using Playwright or Cypress for browser-based testing.
