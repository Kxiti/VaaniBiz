"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaCopy, FaDownload, FaSpinner, FaWhatsapp, FaRedo, FaEnvelope,
} from "react-icons/fa";
import { Language } from "@/lib/types";

export interface ActionHelper {
  id: string;
  title: string;
  description: string;
  type: string;
  icon: string;
  prompt?: string;
}

interface ActionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  helper: ActionHelper;
  stepTitle: string;
  businessIdea: string;
  language: Language;
}

// ── Map helper.type → actionType sent to API ──────────────────────────────
const TYPE_TO_ACTION: Record<string, string> = {
  message:    "whatsapp-message",
  poster:     "poster-generator",
  video:      "video-script",
  script:     "video-script",
  supplier:   "supplier-message",
  document:   "license-guide",
  calculator: "budget-calculator",
  logo:       "logo-generator",
  image:      "image-guide",
  location:   "location-finder",
  social:     "caption-generator",
  reels:      "reel-ideas",
  caption:    "caption-generator",
  name:       "name-generator",
  email:      "email-creator",
  thumbnail:  "thumbnail-creator",
  generic:    "generic-helper",
};

const PRO_TIPS: Record<string, string> = {
  message:    "Personalize before sending — add your name and a local reference. Test with a friend first.",
  poster:     "Use Canva.com (free) to design your poster using these suggestions. Print at a local shop.",
  video:      "Record in natural daylight near a window. Practice 3x before filming. Keep phone horizontal.",
  reels:      "Use trending audio and keep it under 30 seconds for higher engagement. Lighting is key!",
  caption:    "Use line breaks to make captions readable. Put important hashtags in the first comment.",
  email:      "Proofread for tone. BCC yourself to keep a record of outgoing professional emails.",
  thumbnail:  "Use high-contrast text and bright colors to stand out from other videos. Keep text minimal.",
  supplier:   "Always ask for samples before placing a bulk order. Compare at least 3 suppliers.",
  document:   "Start GST registration first — many other licenses depend on it.",
  calculator: "Add a 20% buffer to your estimate. Costs almost always run higher than expected.",
  logo:       "Get feedback from 5 potential customers before finalizing your logo.",
  image:      "Post consistently — even 3x per week beats sporadic daily posting.",
  location:   "Visit your shortlisted locations on weekdays AND weekends at different times.",
  generic:    "Break each action into the smallest possible step. Small wins build momentum.",
};

// ── SVG Logo Generator ────────────────────────────────────────────────────
interface LogoConcept {
  name: string;
  symbol: string; // SVG path/shape description → we generate geometrically
  primary: string;
  secondary: string;
  accent: string;
  tagline: string;
  style: string;
  brandName?: string;
  initial1?: string;
  initial2?: string;
}

function generateLogos(businessIdea: string, brandName?: string, aiColors?: any): LogoConcept[] {
  // Base colors from AI
  const idea = businessIdea.toLowerCase();
  let basePrimary = aiColors?.primary || "#1a1a2e";
  let baseSecondary = aiColors?.secondary || "#e94560";
  let baseAccent = aiColors?.accent || "#ffffff";

  // Create 9 distinct palettes based on the base
  const palettes = [
    { p: basePrimary, s: baseSecondary, a: baseAccent }, // 1. AI Original
    { p: baseSecondary, s: basePrimary, a: "#ffffff" },   // 2. Inverted
    { p: "#1a1a1a", s: baseSecondary, a: basePrimary }, // 3. Dark Theme
    { p: basePrimary, s: "#FFB800", a: "#ffffff" },      // 4. Gold Accent
    { p: "#f8f9fa", s: basePrimary, a: baseSecondary },   // 5. Clean / Light
    { p: "#2D3047", s: "#FF6B6B", a: "#4ECDC4" },        // 6. Modern Coral
    { p: basePrimary, s: "transparent", a: baseSecondary }, // 7. Minimal Border emphasis
    { p: "#000000", s: "#ffffff", a: baseSecondary },   // 8. B&W High Contrast
    { p: baseSecondary, s: "#ffffff", a: "#000000" },   // 9. Pop Style
  ];

  // Derive initials from brand name or business idea
  const nameToUse = brandName || businessIdea;
  const words = nameToUse.trim().split(/\s+/).filter(Boolean);
  const initial1 = (words[0]?.[0] || "B").toUpperCase();
  const initial2 = (words[1]?.[0] || words[0]?.[1] || "S").toUpperCase();

  const symbols = ["monogram", "circle", "diamond", "hexagon", "shield", "square", "split", "pill", "dots"];

  return symbols.map((sym, i) => ({
    name: sym.charAt(0).toUpperCase() + sym.slice(1) + " Variant",
    symbol: sym,
    primary: palettes[i].p,
    secondary: palettes[i].s === "transparent" ? palettes[i].p : palettes[i].s,
    accent: palettes[i].a,
    tagline: (brandName && brandName.length > 3) ? "Quality & Trust" : "Quality You Can Trust",
    style: `${sym.charAt(0).toUpperCase() + sym.slice(1)} style with unique palette`,
    brandName: nameToUse,
    initial1,
    initial2
  }));
}

function LogoSVG({
  concept,
  index,
}: {
  concept: LogoConcept;
  index: number;
}) {
  const brandName = concept.brandName || "Your Brand";
  const shortName = brandName.split(" ").slice(0, 2).join(" ");

  if (index === 0) {
    // Bold monogram
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="12" />
        <rect x="20" y="20" width="160" height="160" fill="none" stroke={concept.secondary} strokeWidth="3" rx="4" />
        <text x="100" y="125" fontFamily="Arial Black, sans-serif" fontSize="72" fontWeight="900"
          fill={concept.secondary} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}{concept.initial2}
        </text>
        <text x="220" y="80" fontFamily="Arial, sans-serif" fontSize="11" fill={concept.accent} textAnchor="middle"
          transform="rotate(90 220 80)" letterSpacing="4">
          {brandName.toUpperCase()}
        </text>
        <text x="150" y="185" fontFamily="Arial, sans-serif" fontSize="10" fill={concept.secondary}
          textAnchor="middle" letterSpacing="2">
          {concept.tagline.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (index === 1) {
    // Vibrant circle badge
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill="#FFF8F5" rx="12" />
        <circle cx="90" cy="100" r="70" fill={concept.primary} />
        <circle cx="90" cy="100" r="55" fill="none" stroke={concept.accent} strokeWidth="2" strokeDasharray="4 3" />
        <text x="90" y="90" fontFamily="Arial Black, sans-serif" fontSize="32" fontWeight="900"
          fill={concept.accent} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}{concept.initial2}
        </text>
        <text x="90" y="118" fontFamily="Arial, sans-serif" fontSize="9" fill={concept.accent}
          textAnchor="middle" letterSpacing="3">
          EST. 2024
        </text>
        <text x="210" y="85" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900"
          fill={concept.secondary} textAnchor="middle">
          {shortName.split(" ")[0].toUpperCase()}
        </text>
        {shortName.split(" ")[1] && (
          <text x="210" y="110" fontFamily="Arial Black, sans-serif" fontSize="22" fontWeight="900"
            fill={concept.primary} textAnchor="middle">
            {shortName.split(" ")[1].toUpperCase()}
          </text>
        )}
        <text x="210" y="135" fontFamily="Arial, sans-serif" fontSize="9" fill="#888"
          textAnchor="middle" letterSpacing="2">
          {concept.tagline.toUpperCase()}
        </text>
        <line x1="160" y1="75" x2="160" y2="145" stroke="#ddd" strokeWidth="1" />
      </svg>
    );
  }

  if (index === 2) {
    // Premium diamond/minimal
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="12" />
        <polygon points="70,40 110,100 70,160 30,100" fill="none" stroke={concept.accent} strokeWidth="2" />
        <polygon points="70,55 98,100 70,145 42,100" fill={concept.secondary} opacity="0.3" />
        <text x="70" y="105" fontFamily="Georgia, serif" fontSize="18" fontWeight="bold"
          fill={concept.accent} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}
        </text>
        <text x="190" y="88" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="300"
          fill={concept.accent} textAnchor="middle" letterSpacing="6">
          {shortName.split(" ")[0].toUpperCase()}
        </text>
        {shortName.split(" ")[1] && (
          <text x="190" y="115" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="300"
            fill={concept.secondary} textAnchor="middle" letterSpacing="8">
            {shortName.split(" ")[1].toUpperCase()}
          </text>
        )}
        <line x1="140" y1="128" x2="240" y2="128" stroke={concept.secondary} strokeWidth="1" />
        <text x="190" y="142" fontFamily="Arial, sans-serif" fontSize="8" fill={concept.secondary}
          textAnchor="middle" letterSpacing="4">
          {concept.tagline.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (index === 3) {
    // Modern Hexagon
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="12" />
        <path d="M100 40 L140 60 L140 100 L100 120 L60 100 L60 60 Z" fill="none" stroke={concept.secondary} strokeWidth="4" />
        <text x="100" y="85" fontFamily="Arial Black, sans-serif" fontSize="36" fill={concept.accent} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}
        </text>
        <text x="100" y="160" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="900" fill={concept.accent} textAnchor="middle">
          {brandName.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (index === 4) {
    // Elite Shield
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="12" />
        <path d="M150 40 C150 40 100 45 100 80 C100 130 150 160 150 160 C150 160 200 130 200 80 C200 45 150 40 150 40" fill={concept.secondary} opacity="0.2" />
        <text x="150" y="90" fontFamily="serif" fontSize="48" fontWeight="900" fill={concept.secondary} textAnchor="middle">
          {concept.initial1}{concept.initial2}
        </text>
        <text x="150" y="130" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="700" fill={concept.accent} textAnchor="middle" letterSpacing="2">
          {brandName.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (index === 5) {
    // Minimal Square
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="12" />
        <rect x="110" y="60" width="80" height="80" fill="none" stroke={concept.secondary} strokeWidth="2" />
        <text x="150" y="105" fontFamily="sans-serif" fontSize="40" fill={concept.secondary} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}
        </text>
        <text x="150" y="165" fontFamily="sans-serif" fontSize="14" fill={concept.secondary} textAnchor="middle" letterSpacing="4">
          {brandName.toUpperCase()}
        </text>
      </svg>
    );
  }

  if (index === 6) {
    // Dynamic Split
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="150" height="200" fill={concept.primary} />
        <rect x="150" width="150" height="200" fill={concept.secondary} />
        <circle cx="150" cy="100" r="40" fill={concept.accent} />
        <text x="150" y="105" fontFamily="Arial Black" fontSize="35" fill={concept.primary} textAnchor="middle" dominantBaseline="middle">
          {concept.initial1}
        </text>
        <text x="150" y="170" fontFamily="Arial" fontSize="16" fontWeight="900" fill="#fff" textAnchor="middle">
          {brandName.split(" ")[0]}
        </text>
      </svg>
    );
  }

  if (index === 7) {
    // Soft Capsule
    return (
      <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
        <rect width="300" height="200" fill={concept.primary} rx="100" />
        <text x="50%" y="45%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="60" fontWeight="900">
          {concept.initial1}
        </text>
        <text x="50%" y="75%" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="600" letterSpacing="2">
          {brandName}
        </text>
      </svg>
    );
  }

  // Creative Dots (Index 8)
  return (
    <svg id={`logo-svg-${index}`} viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", borderRadius: 12 }}>
      <rect width="300" height="200" fill={concept.primary} rx="12" />
      <circle cx="150" cy="80" r="10" fill={concept.secondary} opacity="0.5" />
      <circle cx="130" cy="100" r="10" fill={concept.accent} opacity="0.5" />
      <circle cx="170" cy="100" r="10" fill={concept.secondary} opacity="0.5" />
      <text x="150" y="100" dominantBaseline="middle" textAnchor="middle" fill="#fff" fontSize="45" fontWeight="900">
        {concept.initial1}
      </text>
      <text x="150" y="150" dominantBaseline="middle" textAnchor="middle" fill={concept.secondary} fontSize="20" fontWeight="900">
        {brandName}
      </text>
    </svg>
  );
}

function LogoSection({ businessIdea, brandName, aiColors }: { businessIdea: string; brandName?: string; aiColors?: any }) {
  const logos = generateLogos(businessIdea, brandName, aiColors);
  const [selected, setSelected] = useState(0);

  const downloadSVG = (index: number) => {
    const svgEl = document.getElementById(`logo-svg-${index}`);
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logo-concept-${index + 1}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <p style={{ color: "#555", fontSize: "13px", marginBottom: "16px" }}>
        9 distinct logo concepts generated for your brand. Click to select, then download the SVG.
      </p>

      {/* Logo grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
        {logos.map((concept: any, i) => (
          <div
            key={i}
            onClick={() => setSelected(i)}
            style={{
              cursor: "pointer",
              borderRadius: "12px",
              border: selected === i ? "3px solid #6C63FF" : "3px solid transparent",
              boxShadow: selected === i
                ? "0 0 0 2px #6C63FF44"
                : "0 2px 8px rgba(0,0,0,0.1)",
              transition: "all 0.2s",
              overflow: "hidden",
            }}
          >
            <div id={`logo-svg-${i}`}>
              <LogoSVG concept={concept} index={i} />
            </div>
            <div style={{ padding: "8px 10px", backgroundColor: "#f8f9fa" }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: "12px", color: "#333" }}>
                {concept.name}
              </p>
              <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#666" }}>
                {concept.style}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Selected logo detail */}
      <div style={{
        backgroundColor: "#f0efff",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "16px",
      }}>
        <h4 style={{ margin: "0 0 8px", color: "#6C63FF", fontSize: "14px" }}>
          Selected: {logos[selected].name}
        </h4>
        <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
          {[logos[selected].primary, logos[selected].secondary, logos[selected].accent].map((color, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "24px", height: "24px", borderRadius: "6px",
                backgroundColor: color, border: "2px solid #ddd"
              }} />
              <span style={{ fontSize: "11px", color: "#555", fontFamily: "monospace" }}>{color}</span>
            </div>
          ))}
        </div>
        <p style={{ margin: 0, fontSize: "13px", color: "#444" }}>
          Tagline suggestion: <em>"{logos[selected].tagline}"</em>
        </p>
      </div>

      {/* Download buttons */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => downloadSVG(selected)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "9999px", border: "none",
            backgroundColor: "#6C63FF", color: "white",
            fontWeight: 600, cursor: "pointer", fontSize: "14px",
          }}
        >
          <FaDownload /> Download Selected SVG
        </button>
        <a
          href="https://www.canva.com/create/logos/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "9999px", border: "none",
            backgroundColor: "#00C4CC", color: "white",
            fontWeight: 600, cursor: "pointer", fontSize: "14px",
            textDecoration: "none",
          }}
        >
          🎨 Customize on Canva
        </a>
      </div>

      {/* Brand name ideas */}
      <div style={{
        marginTop: "16px",
        padding: "14px 16px",
        backgroundColor: "#fff8f0",
        borderLeft: "4px solid #FFB800",
        borderRadius: "0 12px 12px 0",
      }}>
        <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#b45309", fontSize: "13px" }}>
          💡 Brand Name Ideas for Your Business
        </p>
        {generateBrandNames(businessIdea).map((name, i) => (
          <p key={i} style={{ margin: "3px 0", fontSize: "13px", color: "#555" }}>
            <strong>{name.name}</strong> — {name.meaning}
          </p>
        ))}
      </div>
    </div>
  );
}

function PosterSVG({ 
  headline, 
  subheadline, 
  benefits, 
  themeColor, 
  accentColor, 
  index 
}: { 
  headline: string; 
  subheadline: string; 
  benefits: string[]; 
  themeColor: string; 
  accentColor: string; 
  index: number;
}) {
  const styles = [
    { bg: "#fff", border: themeColor, text: "#1a1a2e" },
    { bg: themeColor, border: accentColor, text: "#fff" },
    { bg: "#1a1a2e", border: themeColor, text: "#fff" },
    { bg: "#f8f9fa", border: "#ddd", text: themeColor }
  ];
  const s = styles[index];

  return (
    <svg id={`poster-svg-${index}`} viewBox="0 0 400 560" style={{ width: "100%", borderRadius: "12px", background: s.bg, border: `4px solid ${s.border}` }}>
      <rect width="400" height="560" fill={s.bg} />
      {/* Decorative corner */}
      <polygon points="320,0 400,0 400,80" fill={accentColor} />
      
      {/* Headline */}
      <text x="50%" y="80" textAnchor="middle" fontSize="32" fontWeight="900" fill={s.text} style={{ fontFamily: "Arial" }}>
        {headline.toUpperCase()}
      </text>
      
      {/* Subheadline */}
      <foreignObject x="40" y="110" width="320" height="80">
        <p style={{ color: s.text, fontSize: "14px", textAlign: "center", margin: 0, opacity: 0.8, fontFamily: "sans-serif" }}>
          {subheadline}
        </p>
      </foreignObject>

      {/* Main Box */}
      <rect x="40" y="200" width="320" height="240" fill={themeColor} opacity="0.1" rx="12" />
      
      {/* Benefits */}
      {benefits.map((b, i) => (
        <g key={i} transform={`translate(60, ${240 + i * 40})`}>
          <circle cx="0" cy="0" r="10" fill={themeColor} />
          <path d="M-5 -2 L-1 2 L5 -4" fill="none" stroke="#fff" strokeWidth="2" />
          <text x="25" y="5" fontSize="16" fontWeight="600" fill={s.text} style={{ fontFamily: "sans-serif" }}>
            {b.slice(0, 30)}
          </text>
        </g>
      ))}

      {/* Footer / CTA */}
      <rect x="0" y="500" width="400" height="60" fill="#1a1a2e" />
      <text x="50%" y="535" textAnchor="middle" fontSize="18" fontWeight="900" fill="#fff" style={{ letterSpacing: "2px" }}>
        SCAN TO ORDER / CONTACT NOW
      </text>
    </svg>
  );
}

function PosterPreview({ businessIdea, content, aiColors }: { businessIdea: string; content: string; aiColors?: any }) {
  const lines = content.split('\n');
  const headline = lines.find(l => l.includes('HEADLINE'))?.replace('HEADLINE:', '').trim() || "Exciting New Business!";
  const subheadline = lines.find(l => l.includes('SUBHEADLINE'))?.replace('SUBHEADLINE:', '').trim() || businessIdea;
  const benefits = lines.filter(l => l.match(/•|Point/)).map(l => l.replace(/•|Point \d:|KEY POINTS:/, '').trim()).slice(0, 3);

  const themeColor = aiColors?.primary || '#6C63FF';
  const accentColor = aiColors?.secondary || '#FFB800';

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <p style={{ color: "#555", fontSize: "13px", textAlign: "center", marginBottom: "0" }}>
        Choose a poster style below. All designs are optimized for your business.
      </p>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <PosterSVG 
              headline={headline} 
              subheadline={subheadline} 
              benefits={benefits} 
              themeColor={themeColor} 
              accentColor={accentColor} 
              index={idx} 
            />
            <button 
              onClick={() => window.open(`https://www.canva.com/search?q=poster+${encodeURIComponent(businessIdea)}`, "_blank")}
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: themeColor,
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              Edit in Canva
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbnailPreview({ content }: { content: string }) {
  const lines = content.split('\n');
  const mainText = lines.find(l => l.includes('Text:'))?.replace('Text:', '').trim() || "Amazing Video!";
  const visualDesc = lines.find(l => l.includes('Visual:'))?.replace('Visual:', '').trim() || "Business Graphics";

  return (
     <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{
        aspectRatio: '16 / 9',
        width: '100%',
        backgroundColor: '#1a1a2e',
        borderRadius: '12px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid #fff',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
         <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'linear-gradient(45deg, #6C63FF, #FFB800)' }} />
         <div style={{ zIndex: 1, textAlign: 'center', padding: '20px' }}>
            <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 900, textShadow: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000', marginBottom: '10px' }}>
              {mainText.toUpperCase()}
            </h2>
            <p style={{ color: '#FFB800', fontSize: '12px', fontWeight: 700 }}>{visualDesc}</p>
         </div>
         <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'red', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700 }}>
            01:00
         </div>
      </div>
      <button 
        onClick={() => window.open(`https://www.canva.com/search?q=thumbnail+${encodeURIComponent(mainText)}`, "_blank")}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#00C4CC',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <FaDownload /> Design on Canva
      </button>
     </div>
  );
}

function generateBrandNames(idea: string): Array<{ name: string; meaning: string }> {
  const words = idea.toLowerCase().split(/\s+/);
  const main = words.find(w => w.length > 3 && !["want", "sell", "open", "start", "make", "create"].includes(w)) || words[0];
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return [
    { name: `${cap(main)}Hub`, meaning: "the central place for all things " + main },
    { name: `${cap(main)}Wala`, meaning: "traditional Indian naming — relatable and local" },
    { name: `Sri${cap(main)}`, meaning: "auspicious prefix, signals quality and trust" },
    { name: `${cap(main)}Craft`, meaning: "emphasizes handmade quality and skill" },
    { name: `Easy${cap(main)}`, meaning: "positions you as the convenient, hassle-free choice" },
  ];
}

// ── Main Modal Component ──────────────────────────────────────────────────
function ActionHelperModal({
  isOpen,
  onClose,
  helper,
  stepTitle,
  businessIdea,
  language,
}: ActionHelperModalProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brandName, setBrandName] = useState("");
  const [aiColors, setAiColors] = useState<{ primary?: string; secondary?: string; accent?: string }>({});

  const isLogoType = helper.type === "logo";

  const generateContent = useCallback(async (forcedBrandName?: string) => {
    setIsLoading(true);
    setContent("");
    setError(null);

    const actionType = TYPE_TO_ACTION[helper.type] || "generic-helper";
    const currentBrandName = forcedBrandName !== undefined ? forcedBrandName : brandName;
    
    console.log("Calling action-helper API:", { actionType, type: helper.type, brandName: currentBrandName });

    try {
      const res = await fetch("/api/action-helper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          actionType, 
          stepTitle, 
          businessIdea, 
          language, 
          userInput: isLogoType ? currentBrandName : "" 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || `Server error ${res.status}`);

      const text = data?.content || data?.reply || data?.response || data?.message;
      if (!text) throw new Error("Empty response from server");
      
      setContent(text);

      // Simple AI color parsing
      const primaryMatch = text.match(/PRIMARY_COLOR:\s*#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
      const secondaryMatch = text.match(/SECONDARY_COLOR:\s*#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
      const accentMatch = text.match(/ACCENT_COLOR:\s*#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
      const themeMatch = text.match(/THEME_COLOR:\s*#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);

      setAiColors({
        primary: (primaryMatch || themeMatch)?.[0]?.split(':')[1]?.trim(),
        secondary: secondaryMatch?.[0]?.split(':')[1]?.trim(),
        accent: accentMatch?.[0]?.split(':')[1]?.trim(),
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [helper.type, stepTitle, businessIdea, language, isLogoType, brandName]);

  useEffect(() => {
    // For logos, we wait for user to enter name OR we trigger with default
    if (isOpen) {
      if (isLogoType) {
        // Just show the input first
      } else {
        generateContent();
      }
    }
  }, [isOpen, helper.id]); // eslint-disable-line

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${helper.type}-helper-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tip = PRO_TIPS[helper.type] || PRO_TIPS.generic;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0,
              backgroundColor: "rgba(0,0,0,0.65)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
            }}
          />

          {/* Centering wrapper */}
          <div style={{
            position: "fixed", inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            pointerEvents: "none",
          }}>
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 16 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              style={{
                pointerEvents: "auto",
                width: "100%",
                maxWidth: "820px",
                maxHeight: "88vh",
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {/* ── Header ── */}
              <div style={{
                padding: "24px 24px 20px",
                background: "linear-gradient(135deg, #6C63FF 0%, #FFB800 100%)",
                color: "white",
                flexShrink: 0,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={{
                      width: "52px", height: "52px", borderRadius: "16px",
                      backgroundColor: "rgba(255,255,255,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "28px", flexShrink: 0,
                    }}>
                      {helper.icon}
                    </div>
                    <div>
                      <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>{helper.title}</h2>
                      <p style={{ margin: "3px 0 0", fontSize: "13px", opacity: 0.88 }}>{helper.description}</p>
                    </div>
                  </div>

                  <button
                    type="button" onClick={onClose}
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      border: "none", backgroundColor: "rgba(255,255,255,0.2)",
                      color: "white", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", flexShrink: 0,
                    }}
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Step pill */}
                <div style={{
                  marginTop: "14px", padding: "10px 14px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                  borderRadius: "10px",
                }}>
                  <p style={{ margin: 0, fontSize: "11px", opacity: 0.8 }}>For Step:</p>
                  <p style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 600 }}>{stepTitle}</p>
                </div>
              </div>

              {/* ── Scrollable body ── */}
              <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>

                {/* LOGO TYPE — show SVG logos immediately */}
                {isLogoType && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ 
                      backgroundColor: "#F3F4F6", 
                      padding: "20px", 
                      borderRadius: "16px",
                      border: "2px solid #E5E7EB"
                    }}>
                      <label style={{ 
                        display: "block", 
                        fontSize: "14px", 
                        fontWeight: 700, 
                        color: "#374151",
                        marginBottom: "8px"
                      }}>
                        Enter Your Brand Name
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <input
                          type="text"
                          placeholder="e.g. Chai Sutta Bar"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          style={{
                            flex: 1,
                            padding: "12px 16px",
                            borderRadius: "10px",
                            border: "2px solid #D1D5DB",
                            fontSize: "16px",
                            color: "#1f2937",
                            outline: "none",
                          }}
                        />
                        <button
                          onClick={() => generateContent()}
                          disabled={!brandName || isLoading}
                          style={{
                            padding: "0 20px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: brandName ? "#6C63FF" : "#9CA3AF",
                            color: "white",
                            fontWeight: 600,
                            cursor: brandName ? "pointer" : "not-allowed",
                          }}
                        >
                          {isLoading ? "Analyzing..." : "Analyze & Design"}
                        </button>
                      </div>
                      <p style={{ fontSize: "12px", color: "#6B7280", marginTop: "8px" }}>
                        AI will analyze your business to suggest colors and styles based on this name.
                      </p>
                    </div>

                    <LogoSection 
                      businessIdea={businessIdea} 
                      brandName={brandName} 
                      aiColors={aiColors}
                    />
                  </div>
                )}

                {/* ALL OTHER TYPES */}
                {!isLogoType && (
                  <>
                    {helper.type === "poster" && content && !isLoading && (
                      <PosterPreview 
                        businessIdea={businessIdea} 
                        content={content} 
                        aiColors={aiColors}
                      />
                    )}

                    {helper.type === "thumbnail" && content && !isLoading && (
                      <ThumbnailPreview content={content} />
                    )}

                    {isLoading && (
                      <div style={{
                        display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: "60px 0", gap: "14px",
                      }}>
                        <div style={{ fontSize: "48px", animation: "spin 1s linear infinite", color: "#6C63FF" }}>
                          <FaSpinner />
                        </div>
                        <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
                        <p style={{ color: "#555", fontSize: "18px", margin: 0 }}>
                          Generating {helper.title}...
                        </p>
                        <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>Usually takes 5–10 seconds</p>
                      </div>
                    )}

                    {error && !isLoading && (
                      <div style={{ textAlign: "center", padding: "40px 0" }}>
                        <p style={{ color: "#e53e3e", marginBottom: "16px" }}>⚠️ {error}</p>
                        <button type="button" onClick={() => generateContent()} style={{
                          padding: "10px 24px", borderRadius: "9999px", border: "none",
                          background: "linear-gradient(135deg, #6C63FF, #FFB800)",
                          color: "white", fontWeight: 600, cursor: "pointer", fontSize: "14px",
                        }}>
                          Try Again
                        </button>
                      </div>
                    )}

                    {content && !isLoading && helper.type !== "poster" && helper.type !== "logo" && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {/* Content box */}
                        <div style={{
                          backgroundColor: "#f8f9fa", borderRadius: "16px",
                          padding: "20px", border: "2px solid #e9ecef",
                          whiteSpace: "pre-wrap", lineHeight: 1.75,
                          color: "#2d3748", fontSize: "14px",
                          fontFamily: "system-ui, sans-serif",
                        }}>
                          {content}
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                          <button type="button" onClick={handleCopy} style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "10px 20px", borderRadius: "9999px", border: "none",
                            backgroundColor: "#6C63FF", color: "white",
                            fontWeight: 600, cursor: "pointer", fontSize: "14px",
                          }}>
                            <FaCopy /> {copied ? "Copied!" : "Copy Text"}
                          </button>

                          {helper.type === "message" && (
                            <button type="button" onClick={() =>
                              window.open(`https://wa.me/?text=${encodeURIComponent(content)}`, "_blank")
                            } style={{
                              display: "inline-flex", alignItems: "center", gap: "8px",
                              padding: "10px 20px", borderRadius: "9999px", border: "none",
                              backgroundColor: "#25D366", color: "white",
                              fontWeight: 600, cursor: "pointer", fontSize: "14px",
                            }}>
                              <FaWhatsapp /> Share on WhatsApp
                            </button>
                          )}

                          {helper.type === "email" && (
                            <button type="button" onClick={() =>
                              window.open(`mailto:?subject=${encodeURIComponent("Business Update: " + businessIdea)}&body=${encodeURIComponent(content)}`, "_blank")
                            } style={{
                              display: "inline-flex", alignItems: "center", gap: "8px",
                              padding: "10px 20px", borderRadius: "9999px", border: "none",
                              backgroundColor: "#EA4335", color: "white",
                              fontWeight: 600, cursor: "pointer", fontSize: "14px",
                            }}>
                              <FaEnvelope /> Share via Email
                            </button>
                          )}

                          <button type="button" onClick={handleDownload} style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "10px 20px", borderRadius: "9999px", border: "none",
                            backgroundColor: "#374151", color: "white",
                            fontWeight: 600, cursor: "pointer", fontSize: "14px",
                          }}>
                            <FaDownload /> Download
                          </button>

                          <button type="button" onClick={() => generateContent()} style={{
                            display: "inline-flex", alignItems: "center", gap: "8px",
                            padding: "10px 20px", borderRadius: "9999px", border: "none",
                            background: "linear-gradient(135deg, #6C63FF, #FFB800)",
                            color: "white", fontWeight: 600, cursor: "pointer", fontSize: "14px",
                          }}>
                            <FaRedo /> Regenerate
                          </button>
                        </div>

                        {/* Pro tip */}
                        <div style={{
                          backgroundColor: "#EFF6FF",
                          borderLeft: "4px solid #3B82F6",
                          borderRadius: "0 12px 12px 0",
                          padding: "14px 16px",
                          display: "flex", gap: "12px", alignItems: "flex-start",
                        }}>
                          <span style={{ fontSize: "22px" }}>💡</span>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: "#1e3a5f", fontSize: "14px" }}>
                              Pro Tip
                            </p>
                            <p style={{ margin: "4px 0 0", color: "#1e40af", fontSize: "13px" }}>{tip}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ActionHelperModal;