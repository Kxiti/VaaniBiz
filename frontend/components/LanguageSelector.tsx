"use client";

import { motion } from "framer-motion";
import { Language, LANGUAGE_NAMES } from "@/lib/types";
import { FaGlobe } from "react-icons/fa";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { value: Language; label: string; native: string }[] = [
  { value: "hindi", label: "Hindi", native: LANGUAGE_NAMES.hindi },
  { value: "tamil", label: "Tamil", native: LANGUAGE_NAMES.tamil },
  { value: "telugu", label: "Telugu", native: LANGUAGE_NAMES.telugu },
  { value: "marathi", label: "Marathi", native: LANGUAGE_NAMES.marathi },
  { value: "bengali", label: "Bengali", native: LANGUAGE_NAMES.bengali },
  { value: "gujarati", label: "Gujarati", native: LANGUAGE_NAMES.gujarati },
  { value: "kannada", label: "Kannada", native: LANGUAGE_NAMES.kannada },
  { value: "malayalam", label: "Malayalam", native: LANGUAGE_NAMES.malayalam },
  { value: "english", label: "English", native: LANGUAGE_NAMES.english },
];

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
        <FaGlobe className="text-primary" />
        Select Your Language / अपनी भाषा चुनें
      </label>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onLanguageChange(lang.value)}
            className={`p-3 rounded-xl border-2 transition-all ${
              selectedLanguage === lang.value
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold text-dark mb-1">
                {lang.native}
              </div>
              <div className="text-xs text-gray-500">{lang.label}</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
