# Implementation Plan: Backend Opportunity API Integration

## Overview

This plan implements the integration of the AWS Lambda-based Opportunity Generator API into the VaaniBiz frontend. The implementation replaces the mock data in `getOpportunities()` with a real HTTP client that calls the API Gateway endpoint, transforms string responses into structured `Opportunity` objects, and handles errors gracefully.

## Tasks

- [x] 1. Configure API endpoint and environment setup
  - Add environment variable configuration for `NEXT_PUBLIC_OPPORTUNITIES_API_URL`
  - Add inline documentation explaining the endpoint URL configuration requirement
  - Use placeholder URL with clear comment that it must be replaced before deployment
  - _Requirements: 5.1_

- [ ] 2. Implement HTTP client for API Gateway integration
  - [x] 2.1 Replace mock implementation with fetch-based HTTP POST request
    - Remove the simulated delay and mock data return
    - Implement fetch call to API Gateway endpoint with POST method
    - Format request body with profile object containing businessType, location, and targetMarket
    - Set Content-Type header to application/json
    - _Requirements: 1.1, 1.2, 1.6_
  
  - [ ]* 2.2 Write property test for HTTP POST request formation
    - **Property 1: HTTP POST Request Formation**
    - **Validates: Requirements 1.1, 1.2**
    - Generate random BusinessProfile objects and verify POST method and correct body structure
  
  - [x] 2.3 Add comprehensive error handling with try-catch blocks
    - Wrap fetch call in try-catch to handle network errors
    - Check response.ok for HTTP errors
    - Handle JSON parsing errors
    - Validate response contains opportunities array
    - Return empty array for all error conditions
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [ ]* 2.4 Write property test for error resilience
    - **Property 4: Error Resilience**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
    - Generate random error conditions and verify empty array returned without exceptions

- [ ] 3. Implement opportunity string transformation logic
  - [x] 3.1 Create title extraction function
    - Extract first sentence (ending with . ! or ?) as title
    - Fallback to first 50 characters if no sentence boundary found
    - Use full string if shorter than 50 characters
    - _Requirements: 6.1_
  
  - [x] 3.2 Transform API response strings into Opportunity objects
    - Map each opportunity string to Opportunity object
    - Set title using extraction function
    - Set description to full opportunity string
    - Set default values: relevanceScore=0.75, timing="Upcoming", actionRequired="Review and evaluate this opportunity"
    - _Requirements: 1.4, 6.2, 6.3, 6.4, 6.5, 6.6_
  
  - [ ]* 3.3 Write property test for opportunity transformation completeness
    - **Property 2: Opportunity Transformation Completeness**
    - **Validates: Requirements 1.4, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6**
    - Generate random opportunity strings and verify all fields populated correctly
  
  - [ ]* 3.4 Write property test for successful response parsing
    - **Property 3: Successful Response Parsing**
    - **Validates: Requirements 1.3, 1.5**
    - Generate random valid API responses and verify array length and object types

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Add error logging for debugging
  - [x] 5.1 Add console.error logging for all error scenarios
    - Log network errors with error message and details
    - Log HTTP errors with status code and statusText
    - Log JSON parse errors
    - Log schema validation failures (missing opportunities field)
    - Include error type and relevant context in all logs
    - _Requirements: 2.5, 5.5_
  
  - [ ]* 5.2 Write property test for error logging
    - **Property 5: Error Logging**
    - **Validates: Requirements 2.5**
    - Generate random error conditions and verify console.error called

- [ ] 6. Add comprehensive code documentation
  - [x] 6.1 Document API contract and integration points
    - Add comment identifying the API Gateway endpoint URL
    - Document request body format expected by the API
    - Document response format returned by the API
    - Explain transformation logic from strings to Opportunity objects
    - Document error handling strategy
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [ ]* 6.2 Write unit tests for title extraction edge cases
    - Test string with sentence boundary
    - Test string longer than 50 characters
    - Test very short string
    - Verify title extraction logic correctness

- [ ] 7. Verify Next.js compatibility
  - [ ]* 7.1 Write property test for client and server context compatibility
    - **Property 6: Client and Server Context Compatibility**
    - **Validates: Requirements 4.2**
    - Verify function works in both Next.js client-side and server-side contexts
  
  - [ ]* 7.2 Write unit tests for specific error scenarios
    - Test network error handling (mock fetch to throw)
    - Test HTTP 500 error handling
    - Test malformed JSON response
    - Test missing opportunities field
    - Test empty opportunities array
    - Verify empty array returned and errors logged for each scenario

- [ ] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- The implementation uses TypeScript with Next.js fetch API
- All error conditions result in empty array returns for graceful degradation
- Property tests should run with minimum 100 iterations using fast-check library
- The API endpoint URL must be configured via NEXT_PUBLIC_OPPORTUNITIES_API_URL environment variable before deployment
- Only the getOpportunities() function is modified; other API functions remain unchanged
