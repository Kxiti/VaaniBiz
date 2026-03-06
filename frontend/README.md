# VaaniBiz AI - Frontend

A voice-first AI platform that helps first-time entrepreneurs in Tier 2/3 India turn spoken business ideas into complete startup roadmaps.

## Features

- 🎤 Voice-first interaction design
- 🌐 Multi-language support (Hindi, Tamil, Marathi, English)
- 🤖 AI-powered business analysis
- 📊 Market insights and cost breakdown
- 🗺️ Step-by-step startup roadmap
- 💡 Context-aware opportunity suggestions
- 📱 Mobile-first responsive design
- ✨ Beautiful animations with Framer Motion

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  page.tsx              # Landing page
  /idea
    page.tsx            # Voice capture page
  /processing
    page.tsx            # AI processing animation
  /results
    page.tsx            # Business plan results
  layout.tsx            # Root layout
  globals.css           # Global styles

/components
  VoiceRecorder.tsx     # Voice recording component
  LanguageSelector.tsx  # Language selection
  ProgressPipeline.tsx  # Processing stages animation
  InsightCard.tsx       # Insight display card
  RoadmapStepper.tsx    # Roadmap steps display
  OpportunityCard.tsx   # Opportunity card
  Navbar.tsx            # Navigation bar
  HeroSection.tsx       # Landing hero section

/lib
  api.ts                # API functions (mock data)
  types.ts              # TypeScript types
  utils.ts              # Utility functions
```

## Features Breakdown

### Landing Page

- Hero section with animated gradients
- How it works section
- Example business ideas
- Features showcase
- Call to action

### Voice Idea Page

- Language selector (4 languages)
- Large microphone button with animations
- Waveform visualization during recording
- Audio transcription preview

### Processing Page

- Animated pipeline showing AI stages
- Progress indicators
- Smooth transitions between stages

### Results Page

- Business profile summary
- Market insights cards
- Startup cost breakdown
- Risk scenarios
- Step-by-step roadmap
- Local opportunity suggestions
- Download and share options

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: "#6C63FF",    // Main brand color
  accent: "#FFB800",     // Accent color
  dark: "#0F172A",       // Dark text
  light: "#F8FAFC",      // Light background
  success: "#22C55E",    // Success color
}
```

### Mock Data

The app currently uses mock data from `/lib/api.ts`. To connect to a real backend:

1. Update the API functions in `/lib/api.ts`
2. Add your backend URL to environment variables
3. Replace mock responses with actual API calls

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This app can be deployed to:

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## Browser Support

- Chrome/Edge (recommended for voice features)
- Firefox
- Safari (iOS 14.5+)

## License

MIT

## Team

Built with ❤️ by the VaaniBiz team for AI for Bharat Hackathon
