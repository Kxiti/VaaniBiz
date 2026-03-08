# Action Support Assistant - Testing Guide

## Overview

The Action Support Assistant provides AI-powered content generators for each roadmap step. Users can click "Help" buttons to generate WhatsApp messages, poster content, video scripts, pitch decks, and more.

## Features Implemented

### 1. Action Helper System (`lib/actionHelpers.ts`)

- **Keyword Detection**: Automatically detects what type of help each step needs
- **Helper Types**:
  - 💬 **WhatsApp Message Creator** - For communication steps
  - 🎨 **Poster Content Generator** - For marketing/advertising steps
  - 🎥 **Video Script Creator** - For video/pitch steps
  - 📊 **Pitch Deck Helper** - For presentation steps
  - 📋 **Document Checklist** - For legal/registration steps
  - 💰 **Budget Breakdown** - For financial planning steps
  - 📍 **Location Checklist** - For location selection steps
  - 🤝 **Supplier Inquiry Message** - For supplier contact steps

### 2. Action Helper Modal (`components/ActionHelperModal.tsx`)

- **AI Content Generation**: Uses AWS Bedrock to generate contextual content
- **Multi-lingual Support**: Generates content in user's selected language
- **Action Buttons**:
  - Copy to clipboard
  - Share on WhatsApp (for messages)
  - Download as text file
  - Regenerate content
- **Pro Tips**: Context-specific tips for each helper type

### 3. Roadmap Integration (`components/StartupRoadmap.tsx`)

- **Helper Buttons**: Appear below each step title
- **Smart Detection**: Shows up to 2 most relevant helpers per step
- **Visual Design**: Gradient buttons with icons

## How It Works

### Step 1: Keyword Detection

When a roadmap step is rendered, the system analyzes the step title for keywords:

```typescript
// Example: "Create and circulate WhatsApp message"
// Detected keywords: "message", "whatsapp", "circulate"
// Helpers shown: WhatsApp Message Creator
```

### Step 2: Helper Button Display

Relevant helper buttons appear below the step title:

```
Step 1: Contact Local Suppliers
[🤝 Help: Supplier Inquiry Message]
```

### Step 3: Modal Opens

When user clicks a helper button:

1. Modal opens with helper details
2. AI generates content based on:
   - Business idea context
   - Step title
   - Helper type
   - User's language
3. Content appears in ~3-5 seconds

### Step 4: User Actions

User can:

- Copy the generated content
- Share directly on WhatsApp
- Download as text file
- Regenerate for different version

## Testing Instructions

### Test Case 1: WhatsApp Message Helper

1. Navigate to results page with roadmap
2. Find a step about "contact", "message", or "reach out"
3. Click "Help: WhatsApp Message Creator"
4. Verify:
   - Modal opens with loading spinner
   - Content generates in 3-5 seconds
   - Message is professional and contextual
   - Copy button works
   - WhatsApp share button opens WhatsApp Web
   - Download button saves .txt file

### Test Case 2: Poster Generator

1. Find a step about "marketing", "advertise", or "promote"
2. Click "Help: Poster Content Generator"
3. Verify:
   - Content includes headline, benefits, design suggestions
   - Copy and download work
   - Pro tip mentions Canva

### Test Case 3: Video Script Creator

1. Find a step about "video", "pitch", or "explain"
2. Click "Help: Video Script Creator"
3. Verify:
   - Script has time-based sections (hook, problem, solution, etc.)
   - Total duration is 60-90 seconds
   - Pro tip mentions practicing

### Test Case 4: Multi-lingual Support

1. Create business plan in Hindi
2. Open roadmap helper
3. Verify content is generated in Hindi
4. Test with other languages (Tamil, Telugu, etc.)

### Test Case 5: Multiple Helpers Per Step

1. Find a step that matches multiple keywords
   - Example: "Create marketing video"
   - Should show: Poster Generator + Video Script Creator
2. Verify both buttons appear
3. Test both helpers work independently

### Test Case 6: No Helpers

1. Find a generic step with no specific keywords
2. Verify no helper buttons appear
3. Step should still display normally

## Expected Behavior

### Helper Button Appearance

- Gradient background (primary to accent)
- White text
- Icon + "Help: [Helper Name]"
- Hover effect (scale 1.05)
- Tap effect (scale 0.95)

### Modal Behavior

- Opens with smooth animation
- Backdrop blur effect
- Responsive (mobile + desktop)
- Close button in top right
- Escape key closes modal
- Click outside closes modal

### Content Generation

- Loading state with spinner
- Error handling if API fails
- Content appears in formatted text box
- Whitespace preserved for readability

### Action Buttons

- Copy: Shows "Copied!" for 2 seconds
- WhatsApp: Opens in new tab
- Download: Saves with timestamp filename
- Regenerate: Generates new version

## Common Issues & Solutions

### Issue: No helper buttons appear

**Solution**: Check if step title contains relevant keywords. Add more keywords to `actionHelpers.ts` if needed.

### Issue: Content generation fails

**Solution**:

- Check AWS Bedrock API endpoint is accessible
- Verify API key/credentials
- Check network connection
- Look at browser console for errors

### Issue: WhatsApp share doesn't work

**Solution**:

- Ensure user has WhatsApp Web access
- Check if browser blocks popups
- Verify URL encoding is correct

### Issue: Content not in correct language

**Solution**:

- Verify language prop is passed correctly from results page
- Check sessionStorage has correct language value
- Test language parameter in API call

## Future Enhancements

### Potential Additions:

1. **Image Generation**: Generate actual poster images using AI
2. **Template Library**: Pre-made templates for common scenarios
3. **Collaboration**: Share helpers with team members
4. **History**: Save previously generated content
5. **Customization**: Edit generated content inline
6. **More Helper Types**:
   - Email templates
   - Social media posts
   - Business card designs
   - Invoice templates
   - Contract templates

### Integration Ideas:

1. **Canva Integration**: Direct export to Canva
2. **WhatsApp Business API**: Send messages directly
3. **Google Docs**: Export to Google Docs
4. **Calendar Integration**: Add deadlines to calendar
5. **Task Management**: Convert steps to tasks

## Code Structure

```
lib/
  actionHelpers.ts          # Helper detection & AI generation logic

components/
  ActionHelperModal.tsx     # Modal UI component
  StartupRoadmap.tsx        # Roadmap with helper buttons

app/results/
  page.tsx                  # Results page (passes props)
```

## API Integration

### Endpoint

```
POST https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat
```

### Request Format

```json
{
  "message": "Business Context: [idea]\n\nTask: [prompt]\n\nLanguage: [language]"
}
```

### Response Format

```json
{
  "response": "Generated content here..."
}
```

## Performance Considerations

- **Lazy Loading**: Modal only loads when opened
- **Caching**: Consider caching generated content
- **Debouncing**: Prevent multiple rapid API calls
- **Error Boundaries**: Graceful error handling
- **Loading States**: Clear feedback during generation

## Accessibility

- **Keyboard Navigation**: Modal can be closed with Escape
- **Focus Management**: Focus trapped in modal when open
- **Screen Readers**: Proper ARIA labels
- **Color Contrast**: Meets WCAG standards
- **Touch Targets**: Large buttons for mobile

## Success Metrics

Track these metrics to measure success:

1. Helper button click rate
2. Content generation success rate
3. Copy/share/download usage
4. Regeneration frequency
5. Time spent in modal
6. User satisfaction ratings

---

## Quick Test Checklist

- [ ] Helper buttons appear on relevant steps
- [ ] Modal opens smoothly
- [ ] Content generates successfully
- [ ] Copy button works
- [ ] WhatsApp share works (for message helpers)
- [ ] Download works
- [ ] Regenerate works
- [ ] Multi-lingual content correct
- [ ] Mobile responsive
- [ ] Close button works
- [ ] Click outside closes modal
- [ ] No console errors

---

**Status**: ✅ Fully Implemented
**Last Updated**: Current Session
**Next Steps**: Test with real users and gather feedback
