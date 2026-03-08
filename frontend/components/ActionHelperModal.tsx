"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaCopy,
  FaDownload,
  FaSpinner,
  FaWhatsapp,
  FaShare,
} from "react-icons/fa";
import { ActionHelper, generateHelperContent } from "@/lib/actionHelpers";
import { Language } from "@/lib/types";

interface ActionHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
  helper: ActionHelper;
  stepTitle: string;
  businessIdea: string;
  language: Language;
}

export default function ActionHelperModal({
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

  useEffect(() => {
    if (isOpen) {
      generateContent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, helper.id]);

  const generateContent = async () => {
    setIsLoading(true);
    setContent("");

    try {
      const generated = await generateHelperContent(
        helper,
        stepTitle,
        businessIdea,
        language,
      );
      setContent(generated);
    } catch (error) {
      setContent("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const encodedText = encodeURIComponent(content);
    window.open(`https://wa.me/?text=${encodedText}`, "_blank");
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${helper.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl md:max-h-[85vh] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-primary p-6 text-white">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center text-3xl">
                    {helper.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{helper.title}</h2>
                    <p className="text-white/90 text-sm mt-1">
                      {helper.description}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                  aria-label="Close modal"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>

              {/* Step Context */}
              <div className="bg-white/10 backdrop-blur rounded-xl p-3 mt-4">
                <p className="text-sm text-white/80 mb-1">For Step:</p>
                <p className="font-semibold">{stepTitle}</p>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <FaSpinner className="text-5xl text-primary animate-spin mb-4" />
                  <p className="text-gray-600 text-lg">
                    Generating your content...
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    This may take a few seconds
                  </p>
                </div>
              ) : content ? (
                <div className="space-y-4">
                  {/* Generated Content */}
                  <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-200">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {content}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-medium shadow-lg hover:shadow-xl transition"
                    >
                      <FaCopy />
                      {copied ? "Copied!" : "Copy Text"}
                    </motion.button>

                    {helper.type === "message" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWhatsAppShare}
                        className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition"
                      >
                        <FaWhatsapp />
                        Share on WhatsApp
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition"
                    >
                      <FaDownload />
                      Download
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={generateContent}
                      className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium shadow-lg hover:shadow-xl transition"
                    >
                      <FaShare />
                      Regenerate
                    </motion.button>
                  </div>

                  {/* Tips */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 mt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💡</span>
                      <div>
                        <p className="font-semibold text-blue-900 mb-1">
                          Pro Tip
                        </p>
                        <p className="text-blue-800 text-sm">
                          {helper.type === "message" &&
                            "Personalize this message with specific details before sending."}
                          {helper.type === "poster" &&
                            "Use Canva or similar tools to design your poster with these suggestions."}
                          {helper.type === "video" &&
                            "Practice this script 2-3 times before recording your video."}
                          {helper.type === "pitch" &&
                            "Adapt this content to your audience and keep it conversational."}
                          {helper.type === "document" &&
                            "Keep these documents organized in a folder for easy access."}
                          {helper.type === "calculator" &&
                            "Update these numbers based on your local market research."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>No content generated yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
