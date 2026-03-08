# Design Document: Backend Opportunity API Integration

## Overview

This design specifies the integration of the AWS Lambda-based Opportunity Generator API into the VaaniBiz frontend application. The integration replaces the current mock implementation in `frontend/lib/api.ts` with a real HTTP client that communicates with the backend API Gateway endpoint.

The core challenge is transforming the API's string-based opportunity responses into structured `Opportunity` objects that match the frontend's type system, while maintaining robust error handling to ensure the application remains functional even when the backend is unavailable.

### Key Design Goals

1. Minimal code changes - only modify the `getOpportunities()` function
2. Graceful degradation - return empty array on any failure
3. Type safety - ensure all responses conform to the `Opportunity` interface
4. Next.js compatibility - work in both client and server contexts
5. Clear documentation - explain API contract and transformation logic

## Architecture

### System Context

```
┌─────────────────┐
│   VaaniBiz     │
│   Frontend     │
│  (Next.js)     │
└────────┬────────┘
         │
         │ HTTP POST
         │ /opportunities
         │
         ▼
┌─────────────────┐
│  AWS API       │
│  Gateway       │
└────────┬────────┘
         │
         │ Invoke
         │
         ▼
┌─────────────────┐
│  Opportunity   │
│  Generator     │
│  Lambda        │
└─────────────────┘
```

### Component Interaction

The integration involves a single function modification in the Frontend API Module:

1. **Input**: `BusinessProfile` object containing businessType, location, targetMarket
2. **Processing**: 
   - Format profile into API request body
   - Send HTTP POST to API Gateway
   - Parse JSON response
   - Transform string opportunities into typed objects
3. **Output**: `Promise<Opportunity[]>` - array of structured opportunity objects

### Error Handling Strategy

The design follows a "fail-safe" approach where any error condition results in an empty array return rather than throwing exceptions. This ensures the UI can always render, even if opportunities are unavailable.

## Components and Interfaces

### Modified Component: getOpportunities()

**Location**: `frontend/lib/api.ts`

**Current Signature** (preserved):
```typescript
export async function getOpportunities(
  profile: BusinessProfile
): Promise<Opportunity[]>
```

**Implementation Strategy**:
- Replace mock implementation with HTTP fetch call
- Use standard `fetch` API (available in Next.js)
- Implement try-catch for all error scenarios
- Log errors to console for debugging

### API Contract

#### Request Format

**Endpoint**: `POST https://YOUR_API_GATEWAY_URL/opportunities`

**Headers**:
```
Content-Type: application/json
```

**Body Structure**:
```json
{
  "profile": {
    "businessType": "string",
    "location": "string",
    "targetMarket": "string"
  }
}
```

**Note**: The API expects only three fields from BusinessProfile (businessType, location, targetMarket). The estimatedScale and requiredResources fields are not sent to the backend.

#### Response Format

**Success Response** (HTTP 200):
```json
{
  "opportunities": [
    "string describing opportunity 1",
    "string describing opportunity 2",
    "string describing opportunity 3"
  ]
}
```

**Error Responses**:
- HTTP 4xx/5xx: Any non-200 status code
- Malformed JSON: Response body cannot be parsed
- Missing field: Response lacks "opportunities" array

### Data Transformation Logic

The API returns opportunities as plain strings. Each string must be transformed into an `Opportunity` object:

```typescript
interface Opportunity {
  title: string;
  description: string;
  relevanceScore: number;
  timing: string;
  actionRequired: string;
}
```

**Transformation Rules**:

1. **Title Extraction**: Extract the first sentence or first 50 characters from the opportunity string as the title
2. **Description**: Use the full opportunity string as the description
3. **Default Values**: Assign sensible defaults for fields not provided by the API:
   - `relevanceScore`: 0.75 (moderate relevance)
   - `timing`: "Upcoming" (generic timing indicator)
   - `actionRequired`: "Review and evaluate this opportunity" (generic action)

**Rationale**: The backend API currently returns unstructured strings. This transformation provides a bridge between the simple backend format and the richer frontend data model. Future backend iterations may return structured data, at which point this transformation logic can be updated.

## Data Models

### Input Model: BusinessProfile

```typescript
interface BusinessProfile {
  businessType: string;      // e.g., "Retail Food Stall"
  targetMarket: string;      // e.g., "College Students"
  estimatedScale: string;    // Not sent to API
  location: string;          // e.g., "Jhansi, Uttar Pradesh"
  requiredResources: string[]; // Not sent to API
}
```

### Output Model: Opportunity

```typescript
interface Opportunity {
  title: string;           // Extracted from opportunity string
  description: string;     // Full opportunity string
  relevanceScore: number;  // Default: 0.75
  timing: string;          // Default: "Upcoming"
  actionRequired: string;  // Default: "Review and evaluate this opportunity"
}
```

### API Response Model

```typescript
interface OpportunityAPIResponse {
  opportunities: string[];
}
```

## Implementation Details

### HTTP Client Configuration

**Technology**: Native `fetch` API
- Available in Next.js 13+ (both client and server)
- No additional dependencies required
- Supports async/await syntax

**Request Configuration**:
```typescript
const response = await fetch(API_ENDPOINT, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    profile: {
      businessType: profile.businessType,
      location: profile.location,
      targetMarket: profile.targetMarket,
    }
  })
});
```

### Error Handling Implementation

**Error Categories**:

1. **Network Errors**: Connection failures, timeouts
   - Caught by try-catch around fetch
   - Return: `[]`

2. **HTTP Errors**: Non-200 status codes
   - Check: `!response.ok`
   - Return: `[]`

3. **Parse Errors**: Invalid JSON response
   - Caught by try-catch around `response.json()`
   - Return: `[]`

4. **Schema Errors**: Missing "opportunities" field
   - Check: `!data.opportunities || !Array.isArray(data.opportunities)`
   - Return: `[]`

**Logging Strategy**:
- Log all errors to console with descriptive messages
- Include error type and details for debugging
- Do not expose errors to end users

### String Parsing Logic

**Title Extraction Algorithm**:

```typescript
function extractTitle(opportunityString: string): string {
  // Try to find first sentence (ending with . ! or ?)
  const sentenceMatch = opportunityString.match(/^[^.!?]+[.!?]/);
  if (sentenceMatch) {
    return sentenceMatch[0].trim();
  }
  
  // Fallback: take first 50 characters
  if (opportunityString.length > 50) {
    return opportunityString.substring(0, 50).trim() + '...';
  }
  
  // If very short, use entire string
  return opportunityString.trim();
}
```

**Rationale**: This approach prioritizes natural sentence boundaries for better readability, with fallbacks for edge cases.

### Configuration Management

**API Endpoint Configuration**:

The API Gateway URL should be configurable via environment variable:

```typescript
const API_ENDPOINT = process.env.NEXT_PUBLIC_OPPORTUNITIES_API_URL || 
                     'https://YOUR_API_GATEWAY_URL/opportunities';
```

**Environment Variable**:
- Name: `NEXT_PUBLIC_OPPORTUNITIES_API_URL`
- Prefix: `NEXT_PUBLIC_` makes it available in browser
- Default: Placeholder URL (must be replaced in deployment)

**Documentation Requirement**: Add comment in code indicating that the URL must be configured before deployment.


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: HTTP POST Request Formation

For any valid BusinessProfile input, when getOpportunities() is called, the function should make an HTTP POST request to the configured API endpoint with a request body containing a "profile" object with exactly three fields: businessType, location, and targetMarket.

**Validates: Requirements 1.1, 1.2**

### Property 2: Opportunity Transformation Completeness

For any array of opportunity strings returned by the API, each string should be transformed into an Opportunity object containing all five required fields (title, description, relevanceScore, timing, actionRequired), where:
- title is a non-empty string extracted from the opportunity string
- description equals the full opportunity string
- relevanceScore is set to 0.75
- timing is set to "Upcoming"
- actionRequired is set to "Review and evaluate this opportunity"

**Validates: Requirements 1.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**

### Property 3: Successful Response Parsing

For any valid API response containing an "opportunities" array of strings, the function should successfully parse the JSON and return a Promise that resolves to an array of Opportunity objects with length equal to the number of strings in the response.

**Validates: Requirements 1.3, 1.5**

### Property 4: Error Resilience

For any error condition (network failure, non-200 HTTP status, malformed JSON, or missing opportunities field), the function should return a Promise that resolves to an empty array without throwing an exception.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 5: Error Logging

For any error condition during API communication, the function should log error information to the console before returning an empty array.

**Validates: Requirements 2.5**

### Property 6: Client and Server Context Compatibility

For any valid BusinessProfile input, the function should execute successfully and return the expected result when called in both Next.js client-side and server-side rendering contexts.

**Validates: Requirements 4.2**

## Error Handling

### Error Categories and Responses

The implementation follows a comprehensive error handling strategy where all errors result in graceful degradation:

| Error Type | Detection Method | Response | Logging |
|------------|-----------------|----------|---------|
| Network Error | try-catch around fetch | Return `[]` | Log error message and details |
| HTTP Error | `!response.ok` | Return `[]` | Log status code and statusText |
| JSON Parse Error | try-catch around `response.json()` | Return `[]` | Log parse error |
| Schema Error | Missing/invalid opportunities field | Return `[]` | Log schema validation failure |

### Error Logging Format

All errors should be logged with the following information:
- Error type/category
- Error message or description
- Relevant context (status code, URL, etc.)

Example log format:
```typescript
console.error('Opportunities API Error:', {
  type: 'HTTP_ERROR',
  status: response.status,
  statusText: response.statusText,
  url: API_ENDPOINT
});
```

### Rationale for Empty Array Returns

Returning an empty array on errors (rather than throwing exceptions) ensures:
1. The UI can always render the opportunities section
2. Users see a "no opportunities available" state rather than an error screen
3. Other parts of the application continue functioning normally
4. The error is logged for developer debugging without impacting user experience

## Testing Strategy

### Dual Testing Approach

The implementation requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific example inputs and expected outputs
- Edge cases (empty strings, very long strings)
- Integration with the fetch API
- Specific error scenarios

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Comprehensive input coverage through randomization
- Verifying transformation logic across diverse data

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/JavaScript)
- Mature property-based testing library for JavaScript
- Integrates well with Jest/Vitest
- Supports custom generators for complex types

**Test Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property reference
- Tag format: `Feature: backend-opportunity-api-integration, Property {number}: {property_text}`

### Test Cases

#### Unit Tests

1. **Successful API Call**
   - Mock fetch to return valid response
   - Verify correct Opportunity objects returned
   - Verify all fields populated correctly

2. **Network Error Handling**
   - Mock fetch to throw network error
   - Verify empty array returned
   - Verify error logged to console

3. **HTTP Error Handling**
   - Mock fetch to return 500 status
   - Verify empty array returned
   - Verify error logged

4. **Malformed JSON Handling**
   - Mock fetch to return invalid JSON
   - Verify empty array returned
   - Verify error logged

5. **Missing Opportunities Field**
   - Mock fetch to return JSON without opportunities field
   - Verify empty array returned
   - Verify error logged

6. **Empty Opportunities Array**
   - Mock fetch to return empty opportunities array
   - Verify empty array returned
   - Verify no errors logged

7. **Title Extraction Edge Cases**
   - Test with string containing sentence
   - Test with string longer than 50 chars
   - Test with very short string
   - Verify title extraction logic

#### Property-Based Tests

1. **Property 1: HTTP POST Request Formation**
   - Generate random BusinessProfile objects
   - Mock fetch to capture request
   - Verify POST method and correct body structure for all inputs
   - **Tag**: Feature: backend-opportunity-api-integration, Property 1: HTTP POST Request Formation

2. **Property 2: Opportunity Transformation Completeness**
   - Generate random arrays of opportunity strings
   - Mock successful API response
   - Verify all transformed objects have required fields with correct values
   - **Tag**: Feature: backend-opportunity-api-integration, Property 2: Opportunity Transformation Completeness

3. **Property 3: Successful Response Parsing**
   - Generate random valid API responses
   - Verify returned array length matches input
   - Verify all objects are valid Opportunity types
   - **Tag**: Feature: backend-opportunity-api-integration, Property 3: Successful Response Parsing

4. **Property 4: Error Resilience**
   - Generate random error conditions (network, HTTP, parse, schema)
   - Verify empty array returned for all error types
   - Verify no exceptions thrown
   - **Tag**: Feature: backend-opportunity-api-integration, Property 4: Error Resilience

5. **Property 5: Error Logging**
   - Generate random error conditions
   - Mock console.error
   - Verify console.error called for all error scenarios
   - **Tag**: Feature: backend-opportunity-api-integration, Property 5: Error Logging

### Test Data Generators

For property-based tests, implement custom generators:

```typescript
// Generator for BusinessProfile
const businessProfileArbitrary = fc.record({
  businessType: fc.string({ minLength: 1, maxLength: 100 }),
  targetMarket: fc.string({ minLength: 1, maxLength: 100 }),
  estimatedScale: fc.constantFrom('Small', 'Medium', 'Large'),
  location: fc.string({ minLength: 1, maxLength: 100 }),
  requiredResources: fc.array(fc.string({ minLength: 1 }), { minLength: 0, maxLength: 10 })
});

// Generator for opportunity strings
const opportunityStringArbitrary = fc.string({ minLength: 10, maxLength: 500 });

// Generator for API responses
const apiResponseArbitrary = fc.record({
  opportunities: fc.array(opportunityStringArbitrary, { minLength: 0, maxLength: 10 })
});
```

### Mocking Strategy

**Fetch API Mocking**:
- Use `jest.spyOn(global, 'fetch')` or similar
- Create mock responses for different scenarios
- Verify fetch called with correct parameters

**Console Mocking**:
- Use `jest.spyOn(console, 'error')` 
- Verify error logging behavior
- Restore after each test

### Integration Testing

While unit and property tests cover the function logic, integration tests should verify:
- Function works in actual Next.js pages (client-side)
- Function works in Next.js API routes (server-side)
- Function works with real API endpoint (if available in test environment)

### Test Coverage Goals

- Line coverage: >95%
- Branch coverage: 100% (all error paths tested)
- Property test iterations: 100 per property
- Unit test scenarios: All error types and success cases

