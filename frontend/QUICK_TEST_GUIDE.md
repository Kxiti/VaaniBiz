# Quick Test Guide - Voice & Multi-Lingual Features

## 🚀 Quick Start

```bash
cd VaaniBiz/frontend
npm install
npm run dev
```

Open: `http://localhost:3000`

## ✅ Test Checklist

### 1. Voice Input (Hindi)

- [ ] Go to `/idea` page
- [ ] Select "हिंदी" (Hindi)
- [ ] Click microphone button
- [ ] Say: **"मैं एक चाय की दुकान खोलना चाहता हूं"**
- [ ] See live transcription appear
- [ ] Click stop
- [ ] Verify it processes

### 2. Voice Input (Tamil)

- [ ] Select "தமிழ்" (Tamil)
- [ ] Click microphone
- [ ] Say: **"நான் ஒரு தேநீர் கடை தொடங்க விரும்புகிறேன்"**
- [ ] See Tamil transcription
- [ ] Click stop
- [ ] Verify it processes

### 3. Voice Input (English)

- [ ] Select "English"
- [ ] Click microphone
- [ ] Say: **"I want to start a tea stall near my college"**
- [ ] See English transcription
- [ ] Click stop
- [ ] Verify it processes

### 4. Text Input

- [ ] Toggle to "Text" mode
- [ ] Type: **"I want to open a small grocery store in my village"**
- [ ] Click send button
- [ ] Verify it processes

### 5. Language Switching

- [ ] Select Hindi → Record → Stop
- [ ] Select Tamil → Record → Stop
- [ ] Verify both work correctly

### 6. Mode Switching

- [ ] Start in Voice mode
- [ ] Toggle to Text mode
- [ ] Toggle back to Voice mode
- [ ] Verify smooth transitions

## 🎤 Sample Phrases to Test

### Hindi (हिंदी)

```
"मैं जयपुर में एक छोटी किराना दुकान खोलना चाहता हूं। मेरे पास पचास हजार रुपये हैं।"
```

### Tamil (தமிழ்)

```
"நான் கோயம்புத்தூரில் ஒரு சிறிய உணவகம் தொடங்க விரும்புகிறேன்"
```

### Telugu (తెలుగు)

```
"నేను హైదరాబాద్‌లో ఒక చిన్న టీ స్టాల్ ప్రారంభించాలనుకుంటున్నాను"
```

### Marathi (मराठी)

```
"मला पुण्यात एक छोटे कपड्याचे दुकान सुरू करायचे आहे"
```

### Bengali (বাংলা)

```
"আমি কলকাতায় একটি ছোট চা দোকান খুলতে চাই"
```

### English

```
"I want to start a tea stall near my college in Jhansi with 50,000 rupees"
```

## 🐛 Troubleshooting

### No transcription appearing?

1. Check browser console for errors
2. Ensure microphone permission granted
3. Try Chrome/Edge (best support)
4. Speak louder and clearer

### Wrong language detected?

1. Verify correct language selected
2. Speak more clearly
3. Avoid mixing languages

### Microphone not working?

1. Check browser permissions
2. Try different browser
3. Check system microphone settings

## 📱 Mobile Testing

### Android

1. Open Chrome on Android
2. Navigate to your local IP (e.g., `http://192.168.1.x:3000`)
3. Test voice input
4. Test text input

### iOS

1. Open Safari on iPhone
2. Navigate to your local IP
3. Test voice input
4. Test text input

## 🎯 Demo Flow for Judges

1. **Start with Hindi voice:**
   - "Let me show you voice input in Hindi..."
   - Record Hindi phrase
   - Show live transcription

2. **Switch to Tamil:**
   - "Now let's try Tamil..."
   - Record Tamil phrase
   - Show it works seamlessly

3. **Show text mode:**
   - "For users who prefer typing..."
   - Toggle to text
   - Type and send

4. **Show results:**
   - Navigate through processing
   - Show generated insights
   - Highlight multi-lingual support

## ✨ Key Features to Highlight

1. **Real-time transcription** - Text appears as you speak
2. **9 languages** - Full Indian language support
3. **Dual mode** - Voice OR text, user's choice
4. **Mobile-friendly** - Works on phones
5. **Professional UI** - Smooth animations, clear feedback

---

**Everything is ready! Test it and win! 🏆**
