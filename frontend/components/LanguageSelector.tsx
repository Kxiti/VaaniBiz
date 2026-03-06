"use client";

import { motion } from "framer-motion";
import { Language } from "@/lib/types";
import { FaGlobe } from "react-icons/fa";

interface LanguageSelectorProps {
  selectedLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

const languages: { value: Language; label: string; native: string }[] = [
  { value: "hindi", label: "Hindi", native: "हिंदी" },
  { value: "tamil", label: "Tamil", native: "தமிழ்" },
  { value: "marathi", label: "Marathi", native: "मराठी" },
  { value: "english", label: "English", native: "English" },
];

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        <FaGlobe className="text-primary" />
        Select Your Language
      </label>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.value}
            onClick={() => onLanguageChange(lang.value)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedLanguage === lang.value
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-gray-200 hover:border-primary/50"
            }`}
          >
            <div className="text-left">
              <div className="font-semibold text-dark">{lang.label}</div>
              <div className="text-sm text-gray-500">{lang.native}</div>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
