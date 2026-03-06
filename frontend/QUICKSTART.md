# Quick Start Guide - VaaniBiz AI Frontend

## 🚀 Get Running in 3 Minutes

### Step 1: Install Dependencies

```bash
cd VaaniBiz/frontend
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

### Step 3: Open in Browser

Navigate to: **http://localhost:3000**

That's it! The app is now running with mock data.

---

## 📱 Testing the App

### Test Flow:

1. **Landing Page** (/)
   - Click "Try Voice Idea" button

2. **Voice Idea Page** (/idea)
   - Select a language
   - Click the microphone button
   - Allow microphone access
   - Speak your business idea (or just click stop after 2 seconds)
   - Wait for transcription

3. **Processing Page** (/processing)
   - Watch the animated pipeline
   - See each stage complete
   - Automatically redirects to results

4. **Results Page** (/results)
   - View your business profile
   - Read market insights
   - See the startup roadmap
   - Check local opportunities

---

## 🎨 Customization Quick Tips

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: "#YOUR_COLOR",
  accent: "#YOUR_COLOR",
}
```

### Change Mock Data

Edit `lib/api.ts` - update the return values in:

- `transcribeAudio()`
- `analyzeBusiness()`
- `generateRoadmap()`
- `getOpportunities()`

### Add More Languages

Edit `components/LanguageSelector.tsx`:

```typescript
const languages = [
  { value: "hindi", label: "Hindi", native: "हिंदी" },
  { value: "YOUR_LANGUAGE", label: "Label", native: "Native" },
];
```

---

## 🐛 Troubleshooting

### Microphone Not Working?

- Check browser permissions
- Use HTTPS or localhost
- Try Chrome/Edge (best support)

### Build Errors?

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use?

```bash
npm run dev -- -p 3001
```

---

## 📦 Production Build

```bash
npm run build
npm start
```

---

## 🎯 Next Steps

1. **Connect Real Backend**: Update API functions in `lib/api.ts`
2. **Add Authentication**: Implement user login
3. **Database Integration**: Store user sessions
4. **Deploy**: Push to Vercel/Netlify

---

## 💡 Demo Tips for Hackathon

1. **Prepare Test Ideas**: Have 2-3 business ideas ready to demo
2. **Test Audio**: Check microphone before presenting
3. **Show Mobile View**: Demonstrate responsive design
4. **Highlight Animations**: Show the smooth transitions
5. **Explain AI Pipeline**: Walk through the processing stages

---

## 🏆 Winning Features to Highlight

✅ Voice-first (no typing needed)
✅ Multi-language support
✅ Beautiful, modern UI
✅ Mobile-optimized
✅ AI-powered insights
✅ Actionable roadmap
✅ Local opportunities
✅ Simple for low-literacy users

---

Good luck with your hackathon! 🚀
