# Complete Setup Guide - VaaniBiz AI Frontend

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A modern web browser (Chrome/Edge recommended for voice features)
- Code editor (VS Code recommended)

---

## 🚀 Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd VaaniBiz/frontend
```

### 2. Install Dependencies

```bash
npm install
```

This will install:

- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Framer Motion
- React Icons
- Other required packages

**Installation time**: ~2-3 minutes

### 3. Verify Installation

Check if everything installed correctly:

```bash
npm list --depth=0
```

You should see all packages listed without errors.

---

## 🏃 Running the Application

### Development Mode

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

**Features in dev mode:**

- Hot reload (changes reflect instantly)
- Detailed error messages
- Source maps for debugging

### Production Build

```bash
npm run build
npm start
```

**Production mode features:**

- Optimized bundle size
- Faster page loads
- Production-ready performance

---

## 📁 Project Structure Explained

```
frontend/
├── app/                      # Next.js 14 App Router
│   ├── page.tsx             # Landing page (/)
│   ├── layout.tsx           # Root layout with Navbar
│   ├── globals.css          # Global styles & animations
│   ├── idea/
│   │   └── page.tsx         # Voice capture page (/idea)
│   ├── processing/
│   │   └── page.tsx         # AI processing (/processing)
│   └── results/
│       └── page.tsx         # Results display (/results)
│
├── components/               # Reusable React components
│   ├── VoiceRecorder.tsx    # Microphone recording
│   ├── LanguageSelector.tsx # Language selection
│   ├── ProgressPipeline.tsx # Processing animation
│   ├── InsightCard.tsx      # Insight display
│   ├── RoadmapStepper.tsx   # Roadmap steps
│   ├── OpportunityCard.tsx  # Opportunity cards
│   ├── Navbar.tsx           # Navigation bar
│   └── HeroSection.tsx      # Landing hero
│
├── lib/                      # Utilities and types
│   ├── api.ts               # API functions (mock data)
│   ├── types.ts             # TypeScript interfaces
│   └── utils.ts             # Helper functions
│
├── public/                   # Static assets
│   └── next.svg             # Favicon
│
├── package.json              # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # TailwindCSS config
├── next.config.mjs          # Next.js config
└── README.md                # Documentation
```

---

## 🎨 Customization Guide

### Change Brand Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: "#6C63FF",    // Purple - main brand
      accent: "#FFB800",     // Yellow - highlights
      dark: "#0F172A",       // Dark blue - text
      light: "#F8FAFC",      // Light gray - background
      success: "#22C55E",    // Green - success states
    },
  },
}
```

### Modify Mock Data

Edit `lib/api.ts` to change demo responses:

```typescript
// Change transcription
export async function transcribeAudio() {
  return "Your custom business idea text";
}

// Change business analysis
export async function analyzeBusiness() {
  return {
    profile: {
      /* your data */
    },
    analytics: {
      /* your data */
    },
  };
}
```

### Add More Languages

Edit `components/LanguageSelector.tsx`:

```typescript
const languages = [
  { value: "hindi", label: "Hindi", native: "हिंदी" },
  { value: "tamil", label: "Tamil", native: "தமிழ்" },
  { value: "marathi", label: "Marathi", native: "मराठी" },
  { value: "english", label: "English", native: "English" },
  // Add your language here
  { value: "bengali", label: "Bengali", native: "বাংলা" },
];
```

---

## 🔧 Configuration Files

### TypeScript (`tsconfig.json`)

- Strict type checking enabled
- Path aliases configured (`@/*`)
- Modern ES features enabled

### TailwindCSS (`tailwind.config.ts`)

- Custom color palette
- Custom animations
- Responsive breakpoints

### Next.js (`next.config.mjs`)

- App Router enabled
- Image optimization
- Production optimizations

---

## 🧪 Testing the Application

### Manual Testing Checklist

#### Landing Page

- [ ] Hero section loads with animations
- [ ] "Try Voice Idea" button works
- [ ] All sections scroll smoothly
- [ ] Mobile responsive

#### Voice Idea Page

- [ ] Language selector works
- [ ] Microphone button appears
- [ ] Recording starts/stops
- [ ] Waveform animation shows
- [ ] Transcription displays

#### Processing Page

- [ ] Pipeline stages animate
- [ ] Each stage completes in sequence
- [ ] Auto-redirects to results

#### Results Page

- [ ] Business profile displays
- [ ] All insight cards show
- [ ] Roadmap steps render
- [ ] Opportunity cards appear
- [ ] Download/Share buttons present

### Browser Testing

Test in multiple browsers:

- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Firefox
- ✅ Safari (iOS 14.5+)

### Mobile Testing

Test on different screen sizes:

- 📱 iPhone (375px)
- 📱 Android (360px)
- 📱 Tablet (768px)

---

## 🐛 Troubleshooting

### Issue: `npm install` fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 3000 already in use

**Solution:**

```bash
# Use different port
npm run dev -- -p 3001

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue: Microphone not working

**Solutions:**

1. Check browser permissions (allow microphone)
2. Use HTTPS or localhost (required for getUserMedia)
3. Try Chrome/Edge (best WebRTC support)
4. Check if another app is using microphone

### Issue: Build errors

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Issue: TypeScript errors

**Solution:**

```bash
# Check TypeScript version
npm list typescript

# Reinstall types
npm install --save-dev @types/react @types/node
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy (automatic)

**Vercel features:**

- Automatic HTTPS
- Global CDN
- Instant deployments
- Preview URLs for PRs

### Deploy to Netlify

1. Build the project:

```bash
npm run build
```

2. Deploy the `out` folder to Netlify

### Deploy to AWS Amplify

1. Connect your GitHub repo
2. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Deploy

---

## 📊 Performance Optimization

### Current Optimizations

✅ Image optimization (Next.js)
✅ Code splitting (automatic)
✅ CSS purging (TailwindCSS)
✅ Lazy loading components
✅ Compressed assets

### Further Optimizations

1. **Add caching**:

```typescript
// In api.ts
const cache = new Map();
```

2. **Optimize images**:

```typescript
import Image from 'next/image';
<Image src="/logo.png" width={100} height={100} />
```

3. **Add loading states**:

```typescript
import { Suspense } from 'react';
<Suspense fallback={<Loading />}>
```

---

## 🔐 Security Considerations

### Current Security

✅ No sensitive data in frontend
✅ HTTPS required for microphone
✅ Input validation
✅ XSS protection (React)

### Production Checklist

- [ ] Add rate limiting
- [ ] Implement CSRF protection
- [ ] Add authentication
- [ ] Sanitize user inputs
- [ ] Use environment variables
- [ ] Enable security headers

---

## 📚 Additional Resources

### Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)

### Tutorials

- [Next.js 14 Tutorial](https://nextjs.org/learn)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

## 🤝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components
- Add comments for complex logic

---

## 📞 Support

### Getting Help

- Check README.md
- Review QUICKSTART.md
- Check troubleshooting section
- Review Next.js documentation

---

## ✅ Pre-Demo Checklist

Before your hackathon demo:

- [ ] Test on mobile device
- [ ] Check microphone permissions
- [ ] Prepare 2-3 test business ideas
- [ ] Test all page transitions
- [ ] Verify animations work
- [ ] Check in different browsers
- [ ] Have backup demo video ready
- [ ] Test internet connection
- [ ] Clear browser cache
- [ ] Practice demo flow

---

**Good luck with your hackathon! 🏆**

Built with ❤️ for AI for Bharat Hackathon
