# Requirements Document: VaaniBiz AI Platform

## Introduction

VaaniBiz AI is a Track 2 (Community-focused) GenAI platform designed to empower first-time entrepreneurs in Tier 2/Tier 3 India. The platform uses a voice-first approach to convert spoken business ideas into personalized business content, explainable analytics, actionable roadmaps, and context-aware opportunity discovery. The system prioritizes accessibility for low-literacy, low-bandwidth users through local-language support and content-driven interfaces.

## Product Overview

VaaniBiz AI addresses the critical gap in entrepreneurial support for non-technical, first-time business owners in underserved Indian markets. By leveraging voice interfaces, Indic language support, and context-aware AI, the platform democratizes access to business planning tools that were previously available only to tech-savvy, English-speaking entrepreneurs.

## Problem Statement

First-time entrepreneurs in Tier 2/Tier 3 India face significant barriers when starting businesses:

- Limited access to business planning tools designed for their context
- Language barriers (English-first tools exclude non-English speakers)
- Low digital literacy makes traditional dashboard-heavy tools unusable
- Lack of localized market intelligence and opportunity awareness
- Limited bandwidth and expensive data plans restrict access to complex web applications

## User Personas

### Persona 1: Rajesh - First-Time Retail Entrepreneur

- Age: 32, Tier 3 city (Jhansi, UP)
- Education: 10th standard
- Language: Hindi (primary), limited English
- Business Idea: Small grocery store in local neighborhood
- Tech Comfort: Uses WhatsApp, basic smartphone
- Needs: Simple guidance, local market insights, step-by-step planning

### Persona 2: Lakshmi - Home-Based Service Provider

- Age: 28, Tier 2 city (Coimbatore, TN)
- Education: 12th standard
- Language: Tamil (primary), some English
- Business Idea: Home catering and tiffin service
- Tech Comfort: Uses social media, voice messages
- Needs: Cost planning, customer acquisition strategies, seasonal insights

### Persona 3: Arjun - Agricultural Entrepreneur

- Age: 35, Rural area near Nashik, MH
- Education: 8th standard
- Language: Marathi (primary)
- Business Idea: Organic vegetable farming and local distribution
- Tech Comfort: Basic phone usage, prefers voice
- Needs: Market timing, pricing guidance, local event awareness

## Glossary

- **VaaniBiz_Platform**: The complete voice-first GenAI system for business planning
- **Voice_Pipeline**: The ASR → LLM → TTS processing chain
- **Business_Idea_Capture**: The initial voice input collection module
- **Analytics_Engine**: The component that generates explainable business insights
- **Roadmap_Generator**: The component that creates actionable step-by-step plans
- **Opportunity_Discovery**: The context-aware module for identifying local opportunities
- **Context_Engine**: The system that incorporates location, events, and seasonality
- **ASR**: Automatic Speech Recognition (AI for Bharat)
- **TTS**: Text-to-Speech synthesis (AI for Bharat)
- **LLM**: Large Language Model (AWS Bedrock)
- **User_Session**: A complete interaction cycle from idea input to output delivery

## Requirements

### Requirement 1: Voice-First Business Idea Capture

**User Story:** As a first-time entrepreneur, I want to describe my business idea in my local language using voice, so that I can share my vision without typing or using English.

#### Acceptance Criteria

1. WHEN a user speaks their business idea in an Indic language, THE Voice_Pipeline SHALL capture and transcribe the audio using ASR
2. WHEN the audio quality is poor or unclear, THE Voice_Pipeline SHALL request the user to repeat specific portions
3. WHEN transcription is complete, THE VaaniBiz_Platform SHALL play back the transcribed text using TTS for user confirmation
4. WHEN a user confirms the transcription, THE Business_Idea_Capture SHALL store the validated input for processing
5. WHERE the user speaks in mixed languages (code-switching), THE Voice_Pipeline SHALL handle multi-lingual input appropriately

### Requirement 2: Intelligent Business Understanding

**User Story:** As a non-technical user, I want the system to understand my business idea deeply, so that it can provide relevant and personalized guidance.

#### Acceptance Criteria

1. WHEN a business idea is captured, THE Analytics_Engine SHALL extract key business attributes (type, target market, scale, resources)
2. WHEN the initial idea lacks critical details, THE VaaniBiz_Platform SHALL ask clarifying questions via voice
3. WHEN clarifying questions are asked, THE VaaniBiz_Platform SHALL limit questions to a maximum of 5 to avoid user fatigue
4. WHEN business attributes are extracted, THE Analytics_Engine SHALL categorize the business into predefined industry segments
5. WHEN categorization is complete, THE VaaniBiz_Platform SHALL confirm the understanding with the user via voice summary

### Requirement 3: Explainable Business Analytics

**User Story:** As a low-literacy entrepreneur, I want to receive business insights explained in simple language, so that I can understand the viability and challenges of my idea without complex dashboards.

#### Acceptance Criteria

1. WHEN business understanding is complete, THE Analytics_Engine SHALL generate market viability analysis in narrative form
2. WHEN generating analytics, THE Analytics_Engine SHALL avoid technical jargon and use simple, conversational language
3. WHEN presenting cost estimates, THE Analytics_Engine SHALL explain each cost component with real-world examples
4. WHEN identifying risks, THE Analytics_Engine SHALL present them as stories or scenarios rather than bullet points
5. WHEN analytics are generated, THE VaaniBiz_Platform SHALL deliver insights via voice using TTS

### Requirement 4: Actionable Roadmap Generation

**User Story:** As a first-time business owner, I want a step-by-step action plan, so that I know exactly what to do next to start my business.

#### Acceptance Criteria

1. WHEN analytics are complete, THE Roadmap_Generator SHALL create a sequential action plan with 5-10 concrete steps
2. WHEN generating roadmap steps, THE Roadmap_Generator SHALL prioritize actions by urgency and dependency
3. WHEN a step requires external resources, THE Roadmap_Generator SHALL specify what resources and where to obtain them
4. WHEN presenting the roadmap, THE VaaniBiz_Platform SHALL deliver it via voice with pauses between steps
5. WHEN the user requests, THE VaaniBiz_Platform SHALL allow navigation to specific roadmap steps via voice commands

### Requirement 5: Context-Aware Opportunity Discovery

**User Story:** As a local entrepreneur, I want to discover business opportunities relevant to my location and timing, so that I can capitalize on local events, seasons, and market conditions.

#### Acceptance Criteria

1. WHEN a user provides their location, THE Context_Engine SHALL identify relevant local events within the next 6 months
2. WHEN analyzing opportunities, THE Context_Engine SHALL consider seasonal patterns relevant to the business type
3. WHEN local festivals or events are identified, THE Opportunity_Discovery SHALL suggest timing-specific strategies
4. WHEN market conditions change, THE Opportunity_Discovery SHALL provide updated recommendations
5. WHERE multiple opportunities exist, THE Opportunity_Discovery SHALL rank them by relevance and feasibility

### Requirement 6: Multi-Lingual Voice Interface

**User Story:** As a non-English speaker, I want to interact with the platform in my native language, so that I can use the service comfortably and effectively.

#### Acceptance Criteria

1. THE VaaniBiz_Platform SHALL support Hindi, Tamil, Telugu, Marathi, Bengali, Gujarati, Kannada, and Malayalam
2. WHEN a user selects a language, THE Voice_Pipeline SHALL use that language for all ASR and TTS operations
3. WHEN processing voice input, THE ASR SHALL achieve minimum 85% accuracy for supported languages
4. WHEN generating voice output, THE TTS SHALL use natural-sounding voices appropriate to the selected language
5. WHEN language is changed mid-session, THE VaaniBiz_Platform SHALL switch seamlessly without data loss

### Requirement 7: Low-Bandwidth Optimization

**User Story:** As a user with limited internet connectivity, I want the platform to work on slow connections, so that I can access the service despite bandwidth constraints.

#### Acceptance Criteria

1. WHEN transmitting audio, THE Voice_Pipeline SHALL compress audio to minimize data transfer
2. WHEN network conditions are poor, THE VaaniBiz_Platform SHALL gracefully degrade to text-based interaction
3. WHEN responses are generated, THE VaaniBiz_Platform SHALL prioritize essential content over supplementary information
4. WHEN audio playback fails, THE VaaniBiz_Platform SHALL provide text fallback with option to retry audio
5. THE VaaniBiz_Platform SHALL complete a full interaction cycle using less than 5MB of data transfer

### Requirement 8: User Session Management

**User Story:** As a returning user, I want to resume my previous session, so that I don't have to repeat information I've already provided.

#### Acceptance Criteria

1. WHEN a user completes an interaction, THE VaaniBiz_Platform SHALL store the session data in DynamoDB
2. WHEN a user returns, THE VaaniBiz_Platform SHALL retrieve the most recent session within 2 seconds
3. WHEN resuming a session, THE VaaniBiz_Platform SHALL summarize previous interactions via voice
4. WHEN a user wants to start fresh, THE VaaniBiz_Platform SHALL allow creation of a new session while preserving old data
5. WHEN session data is stored, THE VaaniBiz_Platform SHALL encrypt personally identifiable information

### Requirement 9: Content Generation and Storage

**User Story:** As an entrepreneur, I want to save and access my business plan content, so that I can refer to it later and share it with others.

#### Acceptance Criteria

1. WHEN analytics and roadmaps are generated, THE VaaniBiz_Platform SHALL store them as structured documents in S3
2. WHEN a user requests their content, THE VaaniBiz_Platform SHALL retrieve and present it via voice or text
3. WHEN content is stored, THE VaaniBiz_Platform SHALL organize it by user ID and timestamp
4. WHEN a user wants to share content, THE VaaniBiz_Platform SHALL generate a shareable link valid for 30 days
5. THE VaaniBiz_Platform SHALL retain user content for a minimum of 1 year

### Requirement 10: Scalability and Performance

**User Story:** As a platform operator, I want the system to handle growing user demand, so that service quality remains consistent as adoption increases.

#### Acceptance Criteria

1. THE VaaniBiz_Platform SHALL process voice input and generate responses within 10 seconds for 95% of requests
2. WHEN concurrent users increase, THE VaaniBiz_Platform SHALL scale automatically using AWS Lambda
3. WHEN system load is high, THE VaaniBiz_Platform SHALL maintain response times within 15 seconds
4. THE VaaniBiz_Platform SHALL support at least 1000 concurrent user sessions
5. WHEN failures occur, THE VaaniBiz_Platform SHALL retry failed operations up to 3 times before reporting errors

### Requirement 11: Privacy and Data Security

**User Story:** As a user sharing business ideas, I want my data to be secure and private, so that my entrepreneurial plans remain confidential.

#### Acceptance Criteria

1. WHEN user data is transmitted, THE VaaniBiz_Platform SHALL use TLS encryption for all network communication
2. WHEN storing sensitive data, THE VaaniBiz_Platform SHALL encrypt data at rest using AWS KMS
3. WHEN processing voice data, THE VaaniBiz_Platform SHALL not retain raw audio files beyond 24 hours
4. WHEN a user requests data deletion, THE VaaniBiz_Platform SHALL remove all associated data within 7 days
5. THE VaaniBiz_Platform SHALL comply with Indian data protection regulations and best practices

### Requirement 12: Error Handling and User Guidance

**User Story:** As a non-technical user, I want clear guidance when something goes wrong, so that I can resolve issues without technical support.

#### Acceptance Criteria

1. WHEN an error occurs, THE VaaniBiz_Platform SHALL provide error messages in the user's selected language
2. WHEN voice recognition fails, THE VaaniBiz_Platform SHALL suggest speaking more slowly or moving to a quieter location
3. WHEN the system cannot understand a business idea, THE VaaniBiz_Platform SHALL ask specific guiding questions
4. WHEN network connectivity is lost, THE VaaniBiz_Platform SHALL save progress and allow resumption when connection is restored
5. IF a critical system error occurs, THEN THE VaaniBiz_Platform SHALL log the error and notify system administrators

## Non-Functional Requirements

### Performance

- Voice processing latency: < 10 seconds for 95% of requests
- System availability: 99.5% uptime
- Data transfer per session: < 5MB

### Scalability

- Support 1000+ concurrent users
- Auto-scaling based on demand
- Serverless architecture for cost efficiency

### Usability

- Voice-first interface requiring minimal visual interaction
- Maximum 5 clarifying questions per session
- Simple, conversational language (6th-grade reading level equivalent)

### Reliability

- Automatic retry for failed operations (up to 3 attempts)
- Graceful degradation on poor network conditions
- Session persistence and recovery

### Security

- TLS encryption for data in transit
- Encryption at rest using AWS KMS
- Compliance with Indian data protection regulations
- No retention of raw audio beyond 24 hours

### Maintainability

- Modular architecture for independent component updates
- Comprehensive logging for debugging
- Infrastructure as Code for reproducible deployments

## Constraints and Assumptions

### Technical Constraints

- Must use AWS services (Lambda, DynamoDB, S3, Bedrock)
- Must use AI for Bharat for ASR/TTS
- Must use Kiro for orchestration and workflows
- Serverless architecture required
- Must support 8 Indic languages minimum

### Business Constraints

- MVP budget constraints require cost-optimized architecture
- Target deployment within 3 months
- Focus on Track 2 (Community-focused) criteria

### Assumptions

- Users have access to smartphones with internet connectivity
- Users can navigate basic voice interfaces
- AI for Bharat APIs provide sufficient accuracy for target languages
- AWS Bedrock provides adequate LLM capabilities for business analysis
- Local context data (events, seasonality) can be sourced or curated

## Success Metrics

### User Engagement

- 70% of users complete full interaction cycle (idea → roadmap)
- Average session duration: 5-10 minutes
- 50% of users return within 7 days

### Technical Performance

- 95% of requests processed within 10 seconds
- ASR accuracy > 85% for supported languages
- System uptime > 99.5%

### Business Impact

- 500 active users within first 3 months post-launch
- 60% user satisfaction score
- 40% of users report taking action based on roadmap

### Community Impact (Track 2 Focus)

- 80% of users from Tier 2/Tier 3 cities
- 60% of users are first-time entrepreneurs
- Platform usage in at least 5 different states

## Out of Scope

### Phase 1 MVP Exclusions

- Mobile application (web-based voice interface only)
- Payment processing or financial transactions
- Direct connection to government services or registrations
- Real-time collaboration features
- Advanced analytics dashboards
- Integration with external business tools (CRM, accounting)
- Mentor matching or community forums
- Video content or visual tutorials
- Offline mode functionality
- Support for languages beyond the initial 8 Indic languages

### Future Considerations

- WhatsApp integration for voice interactions
- SMS-based fallback for ultra-low bandwidth
- Mentor network and community features
- Integration with government startup schemes
- Advanced market research capabilities
- Business performance tracking over time
