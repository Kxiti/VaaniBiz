# Implementation Plan: Bedrock Chat Integration

## Overview

This is a simplified implementation plan focused on quickly integrating the AWS Lambda Bedrock API with the existing ChatInput component. The approach prioritizes getting a working chat interface with minimal complexity.

## Tasks

- [x] 1. Create simple API client
  - [x] 1.1 Create frontend/lib/bedrockApi.ts with sendMessageToBedrock function
    - Use fetch to POST to https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat
    - Send JSON body: {"message": "text"}
    - Parse JSON response: {"reply": "AI response"}
    - Return the reply string
    - Handle basic errors with try/catch
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create simple chat interface
  - [x] 2.1 Create frontend/components/ChatInterface.tsx
    - State: messages array (with id, role, content), isLoading boolean
    - Use existing ChatInput component
    - Display messages in a scrollable list
    - User messages: right-aligned, gradient-primary background
    - AI messages: left-aligned, white background
    - Show "Thinking..." when isLoading is true
    - Auto-scroll to bottom when new messages arrive
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 6.1, 6.2_

  - [x] 2.2 Implement handleMessageSend in ChatInterface
    - Add user message to messages array immediately
    - Set isLoading to true
    - Call sendMessageToBedrock API
    - Add AI reply to messages array
    - Set isLoading to false
    - Show error message if API fails (simple alert or inline text)
    - _Requirements: 2.1, 2.2, 3.1, 3.2, 3.3, 4.1, 4.2, 6.2, 7.1, 7.3_

- [x] 3. Integrate into /idea page
  - [x] 3.1 Update frontend/app/idea/page.tsx
    - Import and render ChatInterface component
    - Position it on the page (below language selector or in a dedicated section)
    - Keep existing IdeaInput functionality unchanged
    - _Requirements: 5.1, 5.2, 5.3, 6.1_

- [ ] 4. Test manually in browser
  - Verify messages send and receive correctly
  - Check loading state displays
  - Test error handling
  - Ensure UI looks good on mobile and desktop

## Notes

- This is a minimal viable implementation
- Focus on getting it working quickly
- Error handling is basic (alert or simple text display)
- No complex testing infrastructure
- Can be enhanced later with more robust error handling and testing
