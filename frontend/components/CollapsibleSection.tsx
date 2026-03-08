"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaChevronUp, FaVolumeUp, FaStop } from "react-icons/fa";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  onSpeak?: () => void;
  isSpeaking?: boolean;
  onStopSpeaking?: () => void;
  accentColor?: string;
}

export default function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  onSpeak,
  isSpeaking = false,
  onStopSpeaking,
  accentColor = "primary",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const colorClasses = {
    primary: "from-primary to-primary/80",
    success: "from-success to-success/80",
    accent: "from-accent to-accent/80",
  };

  const bgColorClasses = {
    primary: "bg-primary/5 border-primary/20",
    success: "bg-success/5 border-success/20",
    accent: "bg-accent/5 border-accent/20",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border-2 overflow-hidden card-shadow ${bgColorClasses[accentColor as keyof typeof bgColorClasses]}`}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between hover:bg-white/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[accentColor as keyof typeof colorClasses]} flex items-center justify-center text-white shadow-lg`}
          >
            {icon}
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-dark">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isOpen ? "Click to collapse" : "Click to expand"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Text-to-Speech Button */}
          {onSpeak && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                if (isSpeaking && onStopSpeaking) {
                  onStopSpeaking();
                } else {
                  onSpeak();
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 rounded-full transition-all ${
                isSpeaking
                  ? "bg-red-500 text-white"
                  : "bg-white text-primary hover:bg-primary hover:text-white"
              } shadow-md`}
              title={isSpeaking ? "Stop reading" : "Read aloud"}
            >
              {isSpeaking ? (
                <FaStop className="text-lg" />
              ) : (
                <FaVolumeUp className="text-lg" />
              )}
            </motion.button>
          )}

          {/* Expand/Collapse Icon */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-600"
          >
            <FaChevronDown className="text-2xl" />
          </motion.div>
        </div>
      </button>

      {/* Content */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 pt-0 bg-white">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speaking Indicator */}
      {isSpeaking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-6 pb-4 bg-white"
        >
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ scaleY: [1, 1.5, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1 h-4 bg-red-500 rounded-full"
                />
              ))}
            </div>
            <span className="text-sm text-red-700 font-medium">
              Reading aloud...
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
