# Design Document: VaaniBiz AI Platform

## Overview

VaaniBiz AI is a serverless, voice-first GenAI platform built on AWS that empowers first-time entrepreneurs in Tier 2/Tier 3 India. The system orchestrates a multi-stage pipeline: voice input capture → business understanding → explainable analytics → actionable roadmap generation → context-aware opportunity discovery. The architecture prioritizes low latency, low bandwidth consumption, and accessibility for low-literacy users through Indic language support.

### Design Philosophy

1. **Voice-First**: All interactions default to voice; text is a fallback
2. **Content Over Dashboards**: Narrative explanations instead of charts and metrics
3. **Explainability**: Every insight includes reasoning in simple language
4. **Context-Awareness**: Location, seasonality, and local events inform recommendations
5. **Serverless Scalability**: Pay-per-use model keeps costs low while supporting growth
6. **Privacy by Design**: Minimal data retention, encryption at rest and in transit

### Key Technologies

- **Orchestration**: Kiro for workflow management
- **Compute**: AWS Lambda (serverless functions)
- **Storage**: DynamoDB (sessions, metadata), S3 (content, audio)
- **AI/ML**: AWS Bedrock (LLM), AI for Bharat (ASR/TTS)
- **Security**: AWS KMS (encryption), IAM (access control)

## Architecture

### High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│                    (Web-based Voice Client)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (REST)                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Kiro Orchestration Layer                     │
│                  (Workflow State Management)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│Voice Pipeline│    │  Analytics   │    │   Context    │
│   Lambda     │    │    Engine    │    │   Engine     │
│              │    │    Lambda    │    │   Lambda     │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                    │
       ▼                   ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ AI for Bharat│    │AWS Bedrock   │    │  DynamoDB    │
│  ASR / TTS   │    │     LLM      │    │  (Context)   │
└──────────────┘    └──────────────┘    └──────────────┘
```

       │                   │                    │
       └───────────────────┴────────────────────┘
                           │
                           ▼
                  ┌──────────────┐
                  │  DynamoDB    │
                  │  (Sessions)  │
                  └──────────────┘
                           │
                           ▼
                  ┌──────────────┐
                  │      S3      │
                  │   (Content)  │
                  └──────────────┘

````

### Architecture Layers

1. **Presentation Layer**: Web-based voice client (browser-based, no app install)
2. **API Layer**: AWS API Gateway for request routing and authentication
3. **Orchestration Layer**: Kiro manages workflow state and coordinates Lambda functions
4. **Processing Layer**: Specialized Lambda functions for voice, analytics, and context
5. **AI/ML Layer**: External services (AI for Bharat, AWS Bedrock)
6. **Data Layer**: DynamoDB for structured data, S3 for unstructured content

## Components and Interfaces

### 1. Voice Pipeline Component

**Responsibilities:**
- Capture audio from user via web interface
- Send audio to AI for Bharat ASR service
- Receive transcribed text
- Send text to AI for Bharat TTS service
- Return synthesized audio to user

**Interfaces:**

```typescript
interface VoicePipelineInput {
  audioData: Buffer;           // Raw audio bytes
  language: IndicLanguage;     // Selected language
  sessionId: string;           // User session identifier
  compressionLevel: number;    // For bandwidth optimization
}

interface VoicePipelineOutput {
  transcribedText: string;     // ASR output
  confidence: number;          // ASR confidence score
  audioUrl?: string;           // TTS audio URL (S3)
  textFallback: string;        // Text for low-bandwidth users
}

interface ASRRequest {
  audio: Buffer;
  language: string;
  sampleRate: number;
}

interface TTSRequest {
  text: string;
  language: string;
  voiceGender: 'male' | 'female';
}
````

**Processing Flow:**

1. Receive audio from client (compressed, typically 8-16 kHz)
2. Validate audio format and size (< 1MB)
3. Call AI for Bharat ASR API with language parameter
4. Receive transcription with confidence score
5. If confidence < 0.7, request user to repeat
6. Store transcription in DynamoDB session
7. For responses: call TTS API, upload audio to S3, return URL

### 2. Business Understanding Component

**Responsibilities:**

- Extract business attributes from transcribed idea
- Identify missing critical information
- Generate clarifying questions
- Categorize business into industry segments
- Build structured business profile

**Interfaces:**

```typescript
interface BusinessIdeaInput {
  transcribedIdea: string;
  sessionId: string;
  language: IndicLanguage;
  previousContext?: BusinessProfile;
}

interface BusinessProfile {
  businessType: string; // e.g., "retail", "service", "agriculture"
  targetMarket: string; // e.g., "local neighborhood", "online"
  estimatedScale: string; // e.g., "small", "medium"
  requiredResources: string[]; // e.g., ["shop space", "inventory"]
  initialInvestment?: string; // e.g., "50000-100000 INR"
  location?: LocationContext;
  completeness: number; // 0-1 score
}

interface ClarifyingQuestion {
  question: string;
  reason: string;
  expectedAnswerType: "text" | "number" | "choice";
  choices?: string[];
}
```

**Processing Flow:**

1. Send transcribed idea to AWS Bedrock LLM
2. Use structured prompt to extract business attributes
3. Calculate completeness score based on required fields
4. If completeness < 0.7, generate up to 5 clarifying questions
5. Store business profile in DynamoDB
6. Return profile and questions to orchestrator

### 3. Analytics Engine Component

**Responsibilities:**

- Generate market viability analysis
- Estimate costs with explanations
- Identify risks as narrative scenarios
- Create explainable insights in simple language
- Avoid jargon and technical terms

**Interfaces:**

```typescript
interface AnalyticsInput {
  businessProfile: BusinessProfile;
  contextData: ContextData;
  language: IndicLanguage;
}

interface AnalyticsOutput {
  viabilityNarrative: string; // Story-based viability assessment
  costBreakdown: CostExplanation[];
  riskScenarios: RiskNarrative[];
  marketInsights: string;
  estimatedTimeline: string;
}

interface CostExplanation {
  category: string; // e.g., "Initial Setup"
  amount: string; // e.g., "30,000-50,000 INR"
  explanation: string; // Simple language explanation
  examples: string[]; // Real-world examples
}

interface RiskNarrative {
  riskType: string;
  scenario: string; // Story describing the risk
  mitigation: string; // Simple mitigation advice
}
```

**Processing Flow:**

1. Receive business profile and context data
2. Construct analytics prompt for LLM with examples
3. Request narrative-style analysis (not bullet points)
4. Parse LLM response into structured format
5. Validate that language is simple (readability check)
6. Store analytics in S3 as JSON
7. Return analytics output

### 4. Roadmap Generator Component

**Responsibilities:**

- Create sequential action plan (5-10 steps)
- Prioritize by urgency and dependency
- Specify required resources for each step
- Format for voice delivery with pauses
- Enable step-by-step navigation

**Interfaces:**

```typescript
interface RoadmapInput {
  businessProfile: BusinessProfile;
  analytics: AnalyticsOutput;
  language: IndicLanguage;
}

interface RoadmapOutput {
  steps: RoadmapStep[];
  estimatedDuration: string;
  criticalPath: number[]; // Indices of critical steps
}

interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  requiredResources: Resource[];
  estimatedTime: string;
  dependencies: number[]; // Step numbers this depends on
  priority: "high" | "medium" | "low";
}

interface Resource {
  name: string;
  type: "document" | "location" | "person" | "money";
  whereToObtain: string;
  estimatedCost?: string;
}
```

**Processing Flow:**

1. Receive business profile and analytics
2. Construct roadmap prompt emphasizing actionability
3. Request LLM to generate 5-10 sequential steps
4. Parse and structure steps with dependencies
5. Validate logical ordering and dependencies
6. Store roadmap in S3
7. Return roadmap output

### 5. Context Engine Component

**Responsibilities:**

- Identify location-specific opportunities
- Detect seasonal patterns for business type
- Find relevant local events (festivals, markets)
- Rank opportunities by relevance and feasibility
- Update recommendations based on changing conditions

**Interfaces:**

```typescript
interface ContextData {
  location: LocationContext;
  businessType: string;
  currentDate: Date;
}

interface LocationContext {
  city: string;
  state: string;
  tier: 2 | 3; // City tier
  coordinates?: { lat: number; lon: number };
}

interface OpportunityOutput {
  opportunities: Opportunity[];
  seasonalInsights: SeasonalPattern[];
  localEvents: LocalEvent[];
}

interface Opportunity {
  title: string;
  description: string;
  relevanceScore: number; // 0-1
  timing: string; // e.g., "Next 2 months"
  actionRequired: string;
}

interface SeasonalPattern {
  season: string;
  impact: string; // How it affects the business
  recommendation: string;
}

interface LocalEvent {
  name: string;
  date: Date;
  relevance: string;
  suggestedAction: string;
}
```

**Processing Flow:**

1. Receive location and business type
2. Query DynamoDB for cached local events
3. If cache miss or stale, fetch from external sources
4. Identify seasonal patterns using LLM knowledge
5. Rank opportunities by relevance score
6. Store context data in DynamoDB (cache for 7 days)
7. Return opportunity output

### 6. Session Manager Component

**Responsibilities:**

- Create and manage user sessions
- Store session state in DynamoDB
- Retrieve previous sessions
- Handle session resumption
- Encrypt sensitive data

**Interfaces:**

```typescript
interface Session {
  sessionId: string;
  userId: string;
  createdAt: Date;
  lastUpdated: Date;
  language: IndicLanguage;
  currentStage: WorkflowStage;
  businessProfile?: BusinessProfile;
  analytics?: AnalyticsOutput;
  roadmap?: RoadmapOutput;
  opportunities?: OpportunityOutput;
}

type WorkflowStage =
  | "idea_capture"
  | "clarification"
  | "analytics"
  | "roadmap"
  | "opportunities"
  | "complete";

interface SessionQuery {
  userId: string;
  sessionId?: string; // If omitted, get latest
}
```

**DynamoDB Schema:**

```
Table: VaaniBiz_Sessions
Partition Key: userId (String)
Sort Key: sessionId (String)
Attributes:
  - createdAt (Number, timestamp)
  - lastUpdated (Number, timestamp)
  - language (String)
  - currentStage (String)
  - businessProfile (Map, encrypted)
  - analytics (String, S3 URL)
  - roadmap (String, S3 URL)
  - opportunities (String, S3 URL)
  - ttl (Number, for auto-deletion after 1 year)
```

### 7. Orchestration Component (Kiro)

**Responsibilities:**

- Coordinate workflow across components
- Manage state transitions
- Handle retries and error recovery
- Track progress through pipeline
- Trigger appropriate Lambda functions

**Workflow States:**

```typescript
type WorkflowState = {
  stage: WorkflowStage;
  input: any;
  output?: any;
  retryCount: number;
  error?: string;
};

interface WorkflowTransition {
  from: WorkflowStage;
  to: WorkflowStage;
  condition: (state: WorkflowState) => boolean;
  action: (state: WorkflowState) => Promise<WorkflowState>;
}
```

**Workflow Sequence:**

1. **idea_capture**: Voice → ASR → Transcription
2. **clarification**: Business Understanding → Questions (if needed, loop)
3. **analytics**: Generate Explainable Analytics
4. **roadmap**: Generate Action Plan
5. **opportunities**: Context-Aware Discovery
6. **complete**: Deliver Final Output

## Data Models

### User Model

```typescript
interface User {
  userId: string; // UUID
  phoneNumber?: string; // Optional, for future SMS
  preferredLanguage: IndicLanguage;
  createdAt: Date;
  lastActive: Date;
  sessionCount: number;
}
```

### Content Storage Model (S3)

```
Bucket: vaanibiz-content
Structure:
  /users/{userId}/
    /sessions/{sessionId}/
      /audio/
        input.mp3                  // Original voice input
        response.mp3               // TTS output
      /documents/
        analytics.json
        roadmap.json
        opportunities.json
      /shared/
        {shareId}.json             // Shareable content
```

### Context Data Model (DynamoDB)

```
Table: VaaniBiz_Context
Partition Key: locationKey (String, e.g., "Jhansi_UP")
Sort Key: dataType (String, e.g., "events", "seasonal")
Attributes:
  - data (Map)
  - lastUpdated (Number)
  - ttl (Number, 7 days cache)
```

## GenAI Reasoning Flow

### LLM Prompt Engineering Strategy

**Principle**: Use few-shot prompting with examples in target language to ensure culturally appropriate, simple responses.

### Business Understanding Prompt Template

```
You are a business advisor helping first-time entrepreneurs in India.
A user has described their business idea. Extract key information.

User's idea: "{transcribed_idea}"

Extract:
1. Business type (retail/service/agriculture/manufacturing/other)
2. Target customers
3. Estimated scale (small/medium/large)
4. Required resources

If information is missing, generate up to 5 simple questions in {language}.
Use simple words. Avoid English terms.

Example:
Idea: "मैं अपने गांव में छोटी किराना दुकान खोलना चाहता हूं"
Type: retail
Customers: local village residents
Scale: small
Resources: shop space, initial inventory, supplier connections

Questions:
1. आपके पास दुकान के लिए जगह है या किराए पर लेनी होगी?
2. शुरुआत में कितना पैसा लगा सकते हैं?
```

### Analytics Generation Prompt Template

```
You are explaining business viability to a first-time entrepreneur with limited education.
Use simple language. Tell stories, not bullet points.

Business: {business_profile}
Location: {location}

Provide:
1. Market viability (as a story)
2. Cost breakdown (with real examples)
3. Risks (as scenarios)

Example:
"आपके इलाके में किराना दुकान की अच्छी संभावना है। आपके गांव में 500 परिवार हैं और सबसे नजदीकी दुकान 2 किलोमीटर दूर है। लोग रोज की चीजें पास में खरीदना पसंद करते हैं।

शुरुआत में आपको लगभग 50,000 रुपये चाहिए होंगे:
- दुकान का सामान (चावल, दाल, तेल, साबुन): 30,000 रुपये
- शेल्फ और बर्तन: 10,000 रुपये
- पहले महीने का किराया: 5,000 रुपये
- बाकी खर्च: 5,000 रुपये

एक चुनौती यह है कि बड़ी दुकानें कम दाम पर सामान बेचती हैं..."
```

### Roadmap Generation Prompt Template

```
Create a step-by-step action plan for this business.
5-10 steps. Each step should be specific and actionable.

Business: {business_profile}
Analytics: {analytics_summary}

For each step, specify:
- What to do
- What resources are needed
- Where to get those resources
- How long it will take

Use simple language in {language}.

Example:
Step 1: दुकान की जगह तय करें (1 सप्ताह)
- अपने गांव में 2-3 जगह देखें जहां लोग आसानी से आ सकें
- जगह का किराया पूछें (महीने का 3,000-5,000 रुपये होना चाहिए)
- सरपंच या गांव के बड़े लोगों से सलाह लें
```

## Voice Pipeline Design

### Audio Processing Flow

```
User Speech
    ↓
[Browser: MediaRecorder API]
    ↓
Compress (Opus codec, 16kbps)
    ↓
[API Gateway]
    ↓
[Lambda: Voice Pipeline]
    ↓
[AI for Bharat ASR]
    ↓
Transcribed Text
    ↓
[Store in DynamoDB]
    ↓
[Lambda: TTS Generation]
    ↓
[AI for Bharat TTS]
    ↓
Audio File (MP3)
    ↓
[Upload to S3]
    ↓
[Return Pre-signed URL]
    ↓
[Browser: Audio Playback]
```

### Audio Optimization Strategies

1. **Compression**: Use Opus codec at 16 kbps (voice-optimized)
2. **Chunking**: Split long audio into 30-second chunks
3. **Streaming**: Stream TTS output as it's generated
4. **Caching**: Cache common phrases in S3 with CDN
5. **Fallback**: Provide text if audio fails to load

### Language-Specific Considerations

- **Hindi**: Use Devanagari script, handle Sanskrit loanwords
- **Tamil**: Handle agglutination, compound words
- **Code-switching**: Detect and handle Hindi-English mixing
- **Dialects**: AI for Bharat models trained on regional variations

## Data Flow (Step-by-Step)

### Complete User Journey

**Step 1: Session Initialization**

```
User → API Gateway → Kiro Orchestrator
Kiro → Session Manager Lambda
Session Manager → DynamoDB (create session)
Session Manager → Kiro (return sessionId)
Kiro → User (ready for input)
```

**Step 2: Voice Input Capture**

```
User (speaks) → Browser (records) → API Gateway
API Gateway → Voice Pipeline Lambda
Voice Pipeline → AI for Bharat ASR
ASR → Voice Pipeline (transcription)
Voice Pipeline → DynamoDB (store transcription)
Voice Pipeline → TTS (confirmation)
TTS → S3 (audio file)
Voice Pipeline → User (playback URL + text)
```

**Step 3: Business Understanding**

```
User (confirms) → Kiro Orchestrator
Kiro → Business Understanding Lambda
Business Understanding → AWS Bedrock LLM
LLM → Business Understanding (extracted profile)
Business Understanding → DynamoDB (store profile)
IF incomplete:
  Business Understanding → LLM (generate questions)
  LLM → Business Understanding (questions)
  Business Understanding → Voice Pipeline (TTS)
  Voice Pipeline → User (questions)
  [Loop back to Step 2 for answers]
ELSE:
  Business Understanding → Kiro (profile complete)
```

**Step 4: Analytics Generation**

```
Kiro → Analytics Engine Lambda
Analytics Engine → Context Engine (get context)
Context Engine → DynamoDB (query location data)
Context Engine → Analytics Engine (context data)
Analytics Engine → AWS Bedrock LLM (with context)
LLM → Analytics Engine (narrative analytics)
Analytics Engine → S3 (store analytics.json)
Analytics Engine → Voice Pipeline (TTS)
Voice Pipeline → User (analytics audio + text)
```

**Step 5: Roadmap Generation**

```
Kiro → Roadmap Generator Lambda
Roadmap Generator → AWS Bedrock LLM
LLM → Roadmap Generator (action steps)
Roadmap Generator → S3 (store roadmap.json)
Roadmap Generator → Voice Pipeline (TTS)
Voice Pipeline → User (roadmap audio + text)
```

**Step 6: Opportunity Discovery**

```
Kiro → Context Engine Lambda
Context Engine → DynamoDB (query events, seasonal data)
Context Engine → AWS Bedrock LLM (analyze opportunities)
LLM → Context Engine (ranked opportunities)
Context Engine → S3 (store opportunities.json)
Context Engine → Voice Pipeline (TTS)
Voice Pipeline → User (opportunities audio + text)
```

**Step 7: Session Completion**

```
Kiro → Session Manager Lambda
Session Manager → DynamoDB (update session status)
Session Manager → S3 (generate shareable link)
Session Manager → User (completion message + share link)
```

## Context-Awareness Design

### Location-Based Intelligence

**Data Sources:**

1. **Static Data**: Pre-curated database of major festivals, markets by state
2. **Dynamic Data**: Integration with local event APIs (future)
3. **User Input**: Explicit location from user during session

**Implementation:**

```typescript
interface LocationIntelligence {
  getLocalEvents(location: LocationContext, dateRange: DateRange): LocalEvent[];
  getSeasonalPatterns(
    businessType: string,
    location: LocationContext,
  ): SeasonalPattern[];
  getMarketConditions(location: LocationContext): MarketCondition;
}

// Example: Seasonal patterns for agriculture
const seasonalPatterns = {
  agriculture: {
    Maharashtra: [
      {
        season: "Kharif",
        months: [6, 7, 8, 9],
        crops: ["rice", "cotton", "soybean"],
      },
      {
        season: "Rabi",
        months: [10, 11, 12, 1],
        crops: ["wheat", "gram", "vegetables"],
      },
    ],
  },
};
```

### Event Detection

**Festival Calendar:**

- Diwali, Holi, Eid, Christmas (national)
- Pongal (Tamil Nadu), Onam (Kerala), Durga Puja (West Bengal)
- Local fairs and markets (state-specific)

**Business Impact Analysis:**

```typescript
function analyzeEventImpact(
  event: LocalEvent,
  businessType: string,
): OpportunityScore {
  // LLM-based analysis
  const prompt = `
    Event: ${event.name} on ${event.date}
    Business: ${businessType}
    
    How can this business capitalize on this event?
    Rate opportunity: 0-10
    Suggest specific actions.
  `;

  return llm.analyze(prompt);
}
```

### Seasonality Handling

**Seasonal Recommendations:**

- **Summer (March-May)**: Cold drinks, cooling products, summer crops
- **Monsoon (June-September)**: Umbrellas, rainwear, indoor services
- **Winter (October-February)**: Warm clothing, heating, winter crops
- **Festival Season (varies)**: Decorations, sweets, gifts

## Scalability and Reliability

### Auto-Scaling Strategy

**Lambda Configuration:**

- **Concurrency**: Reserved concurrency of 100 per function
- **Memory**: 512 MB for voice pipeline, 1024 MB for LLM calls
- **Timeout**: 30 seconds for voice, 60 seconds for analytics
- **Provisioned Concurrency**: 5 instances during peak hours (future)

**DynamoDB Configuration:**

- **Capacity Mode**: On-demand (auto-scales)
- **Point-in-time Recovery**: Enabled
- **Backup**: Daily automated backups

**S3 Configuration:**

- **Storage Class**: Standard for active content, Glacier for archives
- **Lifecycle Policy**: Move to Glacier after 90 days
- **Versioning**: Disabled (cost optimization)

### Reliability Patterns

**Retry Logic:**

```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  backoff: number = 1000,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await sleep(backoff * Math.pow(2, i));
    }
  }
  throw new Error("Max retries exceeded");
}
```

**Circuit Breaker:**

```typescript
class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime = 0;
  private state: "closed" | "open" | "half-open" = "closed";

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === "open") {
      if (Date.now() - this.lastFailureTime > 60000) {
        this.state = "half-open";
      } else {
        throw new Error("Circuit breaker is open");
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess() {
    this.failureCount = 0;
    this.state = "closed";
  }

  private onFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= 5) {
      this.state = "open";
    }
  }
}
```

**Graceful Degradation:**

- If TTS fails → Return text only
- If LLM is slow → Return cached template response
- If context data unavailable → Skip opportunity discovery
- If ASR confidence low → Request repeat or offer text input

### Monitoring and Observability

**CloudWatch Metrics:**

- Lambda invocation count, duration, errors
- DynamoDB read/write capacity, throttles
- S3 request count, data transfer
- API Gateway latency, 4xx/5xx errors

**Custom Metrics:**

- ASR accuracy per language
- Average session completion time
- User drop-off by stage
- Cost per session

**Alarms:**

- Lambda error rate > 5%
- API Gateway latency > 10 seconds
- DynamoDB throttling events
- S3 4xx error rate > 1%

## Security and Privacy

### Authentication and Authorization

**User Authentication:**

- Phase 1: Anonymous sessions (no login required)
- Phase 2: Phone number OTP (future)
- Session tokens: JWT with 24-hour expiry

**API Authorization:**

- API Gateway with API keys
- Lambda execution roles (least privilege)
- S3 bucket policies (private by default)

### Data Encryption

**In Transit:**

- TLS 1.2+ for all API calls
- HTTPS for S3 pre-signed URLs

**At Rest:**

- DynamoDB encryption using AWS KMS
- S3 server-side encryption (SSE-S3)
- Sensitive fields encrypted with customer master key

**Encryption Implementation:**

```typescript
import { KMS } from "aws-sdk";

async function encryptSensitiveData(data: string): Promise<string> {
  const kms = new KMS();
  const result = await kms
    .encrypt({
      KeyId: process.env.KMS_KEY_ID,
      Plaintext: Buffer.from(data),
    })
    .promise();
  return result.CiphertextBlob.toString("base64");
}

async function decryptSensitiveData(encrypted: string): Promise<string> {
  const kms = new KMS();
  const result = await kms
    .decrypt({
      CiphertextBlob: Buffer.from(encrypted, "base64"),
    })
    .promise();
  return result.Plaintext.toString("utf-8");
}
```

### Data Retention and Deletion

**Retention Policies:**

- Raw audio: 24 hours (then deleted)
- Session data: 1 year (DynamoDB TTL)
- Generated content: 1 year (S3 lifecycle)
- Logs: 30 days (CloudWatch)

**User Data Deletion:**

```typescript
async function deleteUserData(userId: string): Promise<void> {
  // Delete DynamoDB records
  await dynamodb
    .query({
      TableName: "VaaniBiz_Sessions",
      KeyConditionExpression: "userId = :userId",
      ProjectionExpression: "sessionId",
    })
    .promise()
    .then(async (result) => {
      for (const item of result.Items) {
        await dynamodb
          .delete({
            TableName: "VaaniBiz_Sessions",
            Key: { userId, sessionId: item.sessionId },
          })
          .promise();
      }
    });

  // Delete S3 objects
  await s3
    .listObjectsV2({
      Bucket: "vaanibiz-content",
      Prefix: `users/${userId}/`,
    })
    .promise()
    .then(async (result) => {
      if (result.Contents.length > 0) {
        await s3
          .deleteObjects({
            Bucket: "vaanibiz-content",
            Delete: {
              Objects: result.Contents.map((obj) => ({ Key: obj.Key })),
            },
          })
          .promise();
      }
    });
}
```

### Privacy Considerations

**Data Minimization:**

- Don't collect phone numbers unless necessary
- Don't store raw audio beyond 24 hours
- Don't log sensitive business details

**Anonymization:**

- Use UUIDs instead of personal identifiers
- Aggregate analytics without user identification
- Remove location precision (city-level only)

**Compliance:**

- Follow Indian IT Act 2000
- Prepare for Digital Personal Data Protection Act
- Implement right to access, rectify, delete

## Future Extensibility

### Planned Enhancements

**Phase 2 (3-6 months):**

- WhatsApp integration for voice messages
- SMS fallback for ultra-low bandwidth
- User authentication with phone OTP
- Progress tracking for roadmap steps

**Phase 3 (6-12 months):**

- Mentor matching based on business type
- Community forums for peer support
- Integration with government startup schemes
- Business performance tracking

**Phase 4 (12+ months):**

- Video tutorials in local languages
- AR/VR for business visualization
- Marketplace for connecting with suppliers
- Micro-loan integration

### Extensibility Patterns

**Plugin Architecture:**

```typescript
interface AnalyticsPlugin {
  name: string;
  analyze(profile: BusinessProfile): Promise<PluginOutput>;
}

class AnalyticsEngine {
  private plugins: AnalyticsPlugin[] = [];

  registerPlugin(plugin: AnalyticsPlugin) {
    this.plugins.push(plugin);
  }

  async runAnalytics(profile: BusinessProfile): Promise<AnalyticsOutput> {
    const baseAnalytics = await this.generateBaseAnalytics(profile);

    for (const plugin of this.plugins) {
      const pluginResult = await plugin.analyze(profile);
      baseAnalytics.merge(pluginResult);
    }

    return baseAnalytics;
  }
}
```

**Event-Driven Extensions:**

```typescript
interface PlatformEvent {
  type: "session_complete" | "roadmap_generated" | "opportunity_found";
  data: any;
  timestamp: Date;
}

class EventBus {
  private handlers: Map<string, ((event: PlatformEvent) => void)[]> = new Map();

  subscribe(eventType: string, handler: (event: PlatformEvent) => void) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType).push(handler);
  }

  publish(event: PlatformEvent) {
    const handlers = this.handlers.get(event.type) || [];
    handlers.forEach((handler) => handler(event));
  }
}

// Example: Send notification when session completes
eventBus.subscribe("session_complete", async (event) => {
  await sendNotification(event.data.userId, "Your business plan is ready!");
});
```

### API Versioning

**Strategy:**

- URL-based versioning: `/v1/`, `/v2/`
- Maintain backward compatibility for 6 months
- Deprecation warnings in response headers

**Example:**

```typescript
// v1: Simple response
GET /v1/session/{sessionId}
Response: {sessionId, stage, data}

// v2: Enhanced with metadata
GET /v2/session/{sessionId}
Response: {
  sessionId,
  stage,
  data,
  metadata: {version, createdAt, lastUpdated},
  links: {self, analytics, roadmap}
}
```

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Voice Input Transcription Completeness

_For any_ audio input in a supported Indic language, the Voice_Pipeline should successfully transcribe the audio and return a non-empty transcription result.

**Validates: Requirements 1.1**

### Property 2: Audio Quality Threshold Enforcement

_For any_ audio input with confidence score below 0.7, the Voice_Pipeline should request the user to repeat the input rather than proceeding with low-confidence transcription.

**Validates: Requirements 1.2**

### Property 3: TTS Generation for All Text Outputs

_For any_ text output generated by the system (analytics, roadmap, opportunities), a corresponding TTS audio file should be created and accessible via URL.

**Validates: Requirements 1.3, 3.5, 4.4**

### Property 4: Session Data Persistence Round-Trip

_For any_ confirmed business idea, storing it in the session and then retrieving the session should return the same business idea data.

**Validates: Requirements 1.4, 8.1**

### Property 5: Business Attribute Extraction Completeness

_For any_ business idea text, the Analytics_Engine should extract a BusinessProfile containing all required fields (businessType, targetMarket, estimatedScale, requiredResources).

**Validates: Requirements 2.1**

### Property 6: Clarifying Questions Generation for Incomplete Profiles

_For any_ business profile with completeness score below 0.7, the system should generate at least one clarifying question.

**Validates: Requirements 2.2**

### Property 7: Maximum Question Limit Enforcement

_For any_ business idea, regardless of how incomplete, the system should never generate more than 5 clarifying questions in a single interaction.

**Validates: Requirements 2.3**

### Property 8: Business Categorization Uniqueness

_For any_ extracted business profile, the Analytics_Engine should assign exactly one category from the predefined industry segments.

**Validates: Requirements 2.4**

### Property 9: Analytics Narrative Format Validation

_For any_ generated analytics output, the viability analysis should be in narrative paragraph form (not containing bullet point markers like "•", "-", or numbered lists).

**Validates: Requirements 3.1, 3.4**

### Property 10: Analytics Readability Constraint

_For any_ generated analytics text, the readability score should be appropriate for 6th-grade reading level or simpler (Flesch-Kincaid grade level ≤ 6).

**Validates: Requirements 3.2**

### Property 11: Cost Component Explanation Completeness

_For any_ cost breakdown in analytics output, each CostExplanation should have a non-empty explanation field and at least one example.

**Validates: Requirements 3.3**

### Property 12: Roadmap Step Count Constraint

_For any_ generated roadmap, the number of steps should be between 5 and 10 (inclusive).

**Validates: Requirements 4.1**

### Property 13: Roadmap Dependency Ordering

_For any_ roadmap, if step B depends on step A (A is in B's dependencies array), then A's stepNumber should be less than B's stepNumber.

**Validates: Requirements 4.2**

### Property 14: Resource Specification Completeness

_For any_ roadmap step that includes resources, each Resource should have a non-empty whereToObtain field.

**Validates: Requirements 4.3**

### Property 15: Event Temporal Constraint

_For any_ location query, all returned LocalEvents should have dates within 6 months from the current date.

**Validates: Requirements 5.1**

### Property 16: Seasonal Pattern Inclusion

_For any_ business type with known seasonal patterns (agriculture, retail with seasonal products), the opportunity output should include at least one SeasonalPattern.

**Validates: Requirements 5.2**

### Property 17: Event-Action Association

_For any_ identified LocalEvent in the opportunity output, there should be a corresponding suggestedAction field that is non-empty.

**Validates: Requirements 5.3**

### Property 18: Opportunity Ranking Order

_For any_ set of opportunities with multiple items, they should be ordered by relevanceScore in descending order (highest relevance first).

**Validates: Requirements 5.5**

### Property 19: Language Consistency Across Session

_For any_ session with a selected language, all generated text outputs (analytics, roadmap, opportunities, error messages) should be in that same language.

**Validates: Requirements 6.2, 12.1**

### Property 20: Language Switching Data Preservation

_For any_ session, changing the language setting should preserve all existing data (businessProfile, analytics, roadmap) without modification.

**Validates: Requirements 6.5**

### Property 21: Audio Compression Effectiveness

_For any_ audio transmission, the compressed audio size should be smaller than the uncompressed raw audio size.

**Validates: Requirements 7.1**

### Property 22: Text Fallback Availability

_For any_ voice output that fails to generate or play, a text version of the same content should be available as fallback.

**Validates: Requirements 7.2, 7.4**

### Property 23: Session Data Transfer Limit

_For any_ complete user session (from idea capture to opportunity discovery), the total data transferred should not exceed 5MB.

**Validates: Requirements 7.5**

### Property 24: Session Retrieval Performance

_For any_ user with existing sessions, retrieving the most recent session should complete within 2 seconds.

**Validates: Requirements 8.2**

### Property 25: New Session Creation Preserves History

_For any_ user with existing sessions, creating a new session should not delete or modify any previous session data.

**Validates: Requirements 8.4**

### Property 26: PII Encryption in Storage

_For any_ session data containing personally identifiable information (phone number, location details), the stored data should be encrypted (not plaintext).

**Validates: Requirements 8.5, 11.2**

### Property 27: Content Storage and Retrieval Round-Trip

_For any_ generated analytics or roadmap, storing it in S3 and then retrieving it should return structurally equivalent data (JSON round-trip).

**Validates: Requirements 9.1, 9.2**

### Property 28: Content Organization by User and Time

_For any_ stored content in S3, the object key should follow the pattern `/users/{userId}/sessions/{sessionId}/` with appropriate subdirectories.

**Validates: Requirements 9.3**

### Property 29: Shareable Link Expiry

_For any_ generated shareable link, the pre-signed URL should have an expiration time of exactly 30 days from creation.

**Validates: Requirements 9.4**

### Property 30: Content Retention Duration

_For any_ user content, it should remain accessible for at least 1 year from creation date (not deleted prematurely).

**Validates: Requirements 9.5**

### Property 31: Retry Logic Exhaustion

_For any_ operation that fails, the system should retry up to 3 times before returning an error to the user.

**Validates: Requirements 10.5**

### Property 32: Audio File Deletion After 24 Hours

_For any_ raw audio file stored in S3, it should be automatically deleted within 24 hours of creation.

**Validates: Requirements 11.3**

### Property 33: User Data Deletion Completeness

_For any_ user data deletion request, all associated data (DynamoDB sessions, S3 content) should be removed within 7 days.

**Validates: Requirements 11.4**

### Property 34: ASR Failure Guidance

_For any_ voice recognition failure (ASR error or low confidence), the error response should include specific guidance (speak slowly, quieter location, etc.).

**Validates: Requirements 12.2**

### Property 35: Low Completeness Triggers Guiding Questions

_For any_ business idea with very low completeness score (< 0.3), the system should generate guiding questions that help structure the idea (e.g., "What product or service will you offer?").

**Validates: Requirements 12.3**

### Property 36: Session Resumption After Interruption

_For any_ session interrupted by network failure, the session data should be persisted and the user should be able to resume from the same stage.

**Validates: Requirements 12.4**

### Property 37: Critical Error Logging

_For any_ critical system error (unhandled exceptions, service failures), an error log entry should be created with timestamp, error details, and context.

**Validates: Requirements 12.5**

## Error Handling

### Error Categories

**1. User Input Errors:**

- Invalid audio format → Return error with supported formats
- Empty or silent audio → Request user to speak
- Unsupported language → Return list of supported languages

**2. External Service Errors:**

- ASR service timeout → Retry up to 3 times, then offer text input
- TTS service failure → Return text-only response
- LLM service error → Return cached template response or error message

**3. Data Errors:**

- Session not found → Create new session
- Corrupted session data → Log error, create new session
- S3 retrieval failure → Retry, then return error

**4. System Errors:**

- Lambda timeout → Log error, return timeout message
- DynamoDB throttling → Implement exponential backoff
- Out of memory → Log error, notify administrators

### Error Response Format

```typescript
interface ErrorResponse {
  error: {
    code: string; // e.g., "ASR_FAILURE", "SESSION_NOT_FOUND"
    message: string; // User-friendly message in selected language
    guidance?: string; // Specific guidance for resolution
    retryable: boolean; // Whether user should retry
    fallback?: any; // Fallback data if available
  };
  requestId: string; // For debugging
  timestamp: Date;
}
```

### Error Handling Patterns

**Retry with Exponential Backoff:**

```typescript
async function withExponentialBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
      await sleep(delay);
    }
  }

  throw lastError;
}
```

**Graceful Degradation:**

```typescript
async function getAnalyticsWithFallback(
  profile: BusinessProfile,
): Promise<AnalyticsOutput> {
  try {
    return await generateAnalytics(profile);
  } catch (error) {
    logger.error("Analytics generation failed", error);

    // Return template-based analytics
    return generateTemplateAnalytics(profile);
  }
}
```

**Circuit Breaker for External Services:**

```typescript
const asrCircuitBreaker = new CircuitBreaker(callASRService, {
  failureThreshold: 5,
  resetTimeout: 60000,
});

async function transcribeAudio(audio: Buffer): Promise<string> {
  try {
    return await asrCircuitBreaker.execute(audio);
  } catch (error) {
    if (error.message === "Circuit breaker is open") {
      // Offer text input as alternative
      return offerTextInputAlternative();
    }
    throw error;
  }
}
```

## Testing Strategy

### Dual Testing Approach

The VaaniBiz AI platform requires both unit tests and property-based tests for comprehensive coverage:

**Unit Tests** focus on:

- Specific examples of business ideas and expected outputs
- Edge cases (empty input, very long input, special characters)
- Error conditions (service failures, invalid data)
- Integration points between components
- Mock external services (ASR, TTS, LLM)

**Property-Based Tests** focus on:

- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Invariants that should never be violated
- Round-trip properties (store/retrieve, encode/decode)

Both approaches are complementary and necessary. Unit tests catch specific bugs and validate concrete examples, while property tests verify general correctness across a wide range of inputs.

### Property-Based Testing Configuration

**Testing Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Configuration**:

- Minimum 100 iterations per property test (due to randomization)
- Seed-based reproducibility for failed tests
- Shrinking enabled to find minimal failing examples

**Test Tagging**: Each property test must reference its design document property:

```typescript
// Feature: vaanibiz-ai, Property 5: Business Attribute Extraction Completeness
test("Business profile extraction includes all required fields", () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 20, maxLength: 500 }), // Random business idea
      async (businessIdea) => {
        const profile = await extractBusinessProfile(businessIdea);

        expect(profile).toHaveProperty("businessType");
        expect(profile).toHaveProperty("targetMarket");
        expect(profile).toHaveProperty("estimatedScale");
        expect(profile).toHaveProperty("requiredResources");
        expect(profile.requiredResources).toBeInstanceOf(Array);
      },
    ),
    { numRuns: 100 },
  );
});
```

### Test Coverage Goals

**Unit Test Coverage**:

- Code coverage: > 80%
- Branch coverage: > 75%
- Focus on business logic and error handling

**Property Test Coverage**:

- All 37 correctness properties implemented
- Each property tested with 100+ random inputs
- Edge cases included in generators

### Testing External Services

**Mocking Strategy**:

```typescript
// Mock AI for Bharat ASR
jest.mock("./services/asr", () => ({
  transcribeAudio: jest.fn((audio, language) => {
    // Return mock transcription based on language
    return Promise.resolve({
      text: "मैं एक किराना दुकान खोलना चाहता हूं",
      confidence: 0.92,
    });
  }),
}));

// Mock AWS Bedrock LLM
jest.mock("./services/llm", () => ({
  generateCompletion: jest.fn((prompt) => {
    // Return mock completion based on prompt
    return Promise.resolve({
      text: "Mock analytics output...",
      usage: { tokens: 500 },
    });
  }),
}));
```

**Integration Tests**:

- Test with real external services in staging environment
- Validate end-to-end flows
- Monitor performance and latency
- Test error handling with service failures

### Test Data Generation

**Property Test Generators**:

```typescript
// Generate random business ideas in different languages
const businessIdeaGenerator = fc.oneof(
  fc.constant("मैं एक छोटी किराना दुकान खोलना चाहता हूं"),
  fc.constant("நான் ஒரு சிறிய உணவகம் தொடங்க விரும்புகிறேன்"),
  fc.constant("मला एक छोटे कपड्याचे दुकान सुरू करायचे आहे"),
  fc.string({ minLength: 20, maxLength: 200 }),
);

// Generate random locations
const locationGenerator = fc.record({
  city: fc.constantFrom("Jhansi", "Coimbatore", "Nashik", "Ranchi"),
  state: fc.constantFrom("UP", "TN", "MH", "JH"),
  tier: fc.constantFrom(2, 3),
});

// Generate random business profiles
const businessProfileGenerator = fc.record({
  businessType: fc.constantFrom(
    "retail",
    "service",
    "agriculture",
    "manufacturing",
  ),
  targetMarket: fc.string({ minLength: 10, maxLength: 100 }),
  estimatedScale: fc.constantFrom("small", "medium", "large"),
  requiredResources: fc.array(fc.string(), { minLength: 1, maxLength: 5 }),
});
```

### Performance Testing

**Load Testing**:

- Simulate 1000 concurrent users
- Measure response times under load
- Identify bottlenecks
- Validate auto-scaling behavior

**Stress Testing**:

- Push system beyond normal capacity
- Test failure modes and recovery
- Validate circuit breakers and rate limiting

**Endurance Testing**:

- Run system under normal load for extended period
- Check for memory leaks
- Monitor resource utilization trends

### Security Testing

**Penetration Testing**:

- Test API authentication and authorization
- Attempt SQL injection, XSS attacks
- Test data encryption in transit and at rest
- Validate input sanitization

**Privacy Testing**:

- Verify PII encryption
- Test data deletion functionality
- Validate data retention policies
- Check for data leakage in logs

### Monitoring and Observability in Tests

**Test Instrumentation**:

```typescript
test("Analytics generation performance", async () => {
  const startTime = Date.now();

  const analytics = await generateAnalytics(mockProfile);

  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(5000); // 5 second SLA

  // Log metrics for analysis
  logger.info("Analytics generation", {
    duration,
    profileSize: JSON.stringify(mockProfile).length,
    outputSize: JSON.stringify(analytics).length,
  });
});
```

### Continuous Integration

**CI Pipeline**:

1. Run unit tests on every commit
2. Run property tests on every PR
3. Run integration tests on merge to main
4. Run performance tests nightly
5. Generate coverage reports
6. Fail build if coverage drops below threshold

**Test Environments**:

- **Local**: Mock all external services
- **Staging**: Real external services, test data
- **Production**: Synthetic monitoring, canary deployments
