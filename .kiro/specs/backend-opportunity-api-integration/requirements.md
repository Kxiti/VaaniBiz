# Requirements Document

## Introduction

This document specifies the requirements for integrating the backend AI opportunity generator API into the VaaniBiz frontend application. The backend service is deployed as an AWS Lambda function behind API Gateway and generates business opportunities based on user business profiles. The frontend currently uses mock data and needs to be updated to call the real API endpoint.

## Glossary

- **Opportunity_Generator_API**: The AWS Lambda backend service that generates AI-powered business opportunities based on business profile inputs
- **API_Gateway**: AWS API Gateway endpoint that provides HTTP access to the Opportunity Generator Lambda function
- **Frontend_API_Module**: The `frontend/lib/api.ts` module that contains API integration functions
- **Business_Profile**: A data structure containing businessType, location, and targetMarket fields
- **Opportunity**: A data structure containing title, description, relevanceScore, timing, and actionRequired fields
- **Mock_Implementation**: The current placeholder implementation that returns hardcoded sample data

## Requirements

### Requirement 1: Replace Mock Opportunity Data with Real API Integration

**User Story:** As a VaaniBiz user, I want to receive AI-generated business opportunities from the backend service, so that I get personalized and relevant recommendations for my business profile.

#### Acceptance Criteria

1. WHEN getOpportunities() is called with a Business_Profile, THE Frontend_API_Module SHALL send an HTTP POST request to the API_Gateway endpoint
2. THE Frontend_API_Module SHALL format the Business_Profile into the request body structure {"profile": {"businessType": string, "location": string, "targetMarket": string}}
3. WHEN the API_Gateway returns a successful response, THE Frontend_API_Module SHALL parse the JSON response containing the opportunities array
4. THE Frontend_API_Module SHALL transform each opportunity string from the API response into an Opportunity object with all required fields (title, description, relevanceScore, timing, actionRequired)
5. THE Frontend_API_Module SHALL return a Promise that resolves to an array of Opportunity objects
6. THE Frontend_API_Module SHALL maintain the same function signature: getOpportunities(profile: BusinessProfile): Promise<Opportunity[]>

### Requirement 2: Handle API Communication Failures Gracefully

**User Story:** As a VaaniBiz user, I want the application to continue working even when the backend API is unavailable, so that I don't experience crashes or error screens.

#### Acceptance Criteria

1. IF the API_Gateway request fails due to network errors, THE Frontend_API_Module SHALL return an empty array instead of throwing an exception
2. IF the API_Gateway returns a non-200 HTTP status code, THE Frontend_API_Module SHALL return an empty array
3. IF the API_Gateway response cannot be parsed as valid JSON, THE Frontend_API_Module SHALL return an empty array
4. IF the API_Gateway response is missing the expected "opportunities" field, THE Frontend_API_Module SHALL return an empty array
5. WHEN any error occurs during API communication, THE Frontend_API_Module SHALL log the error to the console for debugging purposes

### Requirement 3: Preserve Existing API Functions

**User Story:** As a developer, I want other API functions to remain unchanged, so that existing features continue to work without modification.

#### Acceptance Criteria

1. THE Frontend_API_Module SHALL NOT modify the transcribeAudio() function implementation
2. THE Frontend_API_Module SHALL NOT modify the analyzeBusiness() function implementation
3. THE Frontend_API_Module SHALL NOT modify the generateRoadmap() function implementation
4. THE Frontend_API_Module SHALL preserve all existing imports and type definitions

### Requirement 4: Ensure Next.js Compatibility

**User Story:** As a developer, I want the API integration to work correctly in the Next.js environment, so that the application functions properly in both development and production builds.

#### Acceptance Criteria

1. THE Frontend_API_Module SHALL use the standard fetch API for HTTP requests
2. THE Frontend_API_Module SHALL work correctly in both client-side and server-side Next.js rendering contexts
3. THE Frontend_API_Module SHALL handle CORS requirements if the API_Gateway endpoint requires cross-origin requests
4. THE Frontend_API_Module SHALL use async/await syntax compatible with Next.js transpilation

### Requirement 5: Document API Integration Points

**User Story:** As a developer, I want clear documentation in the code, so that I can understand and maintain the API integration.

#### Acceptance Criteria

1. THE Frontend_API_Module SHALL include a comment identifying the API_Gateway endpoint URL
2. THE Frontend_API_Module SHALL include a comment explaining the request body format expected by the Opportunity_Generator_API
3. THE Frontend_API_Module SHALL include a comment explaining the response format returned by the Opportunity_Generator_API
4. THE Frontend_API_Module SHALL include a comment explaining how API response strings are transformed into Opportunity objects
5. THE Frontend_API_Module SHALL include a comment explaining the error handling strategy

### Requirement 6: Transform API Response Data to UI Format

**User Story:** As a VaaniBiz user, I want opportunity data to display correctly in the UI, so that I can read and understand the recommendations.

#### Acceptance Criteria

1. WHEN the API_Gateway returns opportunity strings, THE Frontend_API_Module SHALL parse each string to extract a title
2. THE Frontend_API_Module SHALL use the full opportunity string as the description field
3. THE Frontend_API_Module SHALL assign a default relevanceScore value to each Opportunity object
4. THE Frontend_API_Module SHALL assign a default timing value to each Opportunity object
5. THE Frontend_API_Module SHALL assign a default actionRequired value to each Opportunity object
6. FOR ALL generated Opportunity objects, the structure SHALL match the Opportunity interface defined in types.ts
