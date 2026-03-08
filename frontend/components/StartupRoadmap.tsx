"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaCheckCircle,
  FaClock,
  FaRupeeSign,
  FaExclamationCircle,
  FaListUl,
  FaFlag,
  FaHandsHelping,
} from "react-icons/fa";
import { getStepIcon } from "@/lib/iconMapper";
import { getActionHelpers } from "@/lib/actionHelpers";
import ActionHelperModal from "./ActionHelperModal";
import { Language } from "@/lib/types";

interface StartupRoadmapProps {
  roadmapContent: string;
  businessIdea: string;
  language: Language;
  className?: string;
}

export default function StartupRoadmap({
  roadmapContent,
  businessIdea,
  language,
  className = "",
}: StartupRoadmapProps) {
  const [selectedHelper, setSelectedHelper] = useState<{
    helper: any;
    stepTitle: string;
  } | null>(null);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Action Helper Modal */}
      {selectedHelper && (
        <ActionHelperModal
          isOpen={true}
          onClose={() => setSelectedHelper(null)}
          helper={selectedHelper.helper}
          stepTitle={selectedHelper.stepTitle}
          businessIdea={businessIdea}
          language={language}
        />
      )}

      {/* Roadmap Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4">
          <FaFlag className="text-primary" />
          <span className="text-primary font-semibold">
            Your Startup Roadmap
          </span>
        </div>
        <h2 className="text-3xl font-bold text-dark mb-2">
          Step-by-Step Action Plan
        </h2>
        <p className="text-gray-600">
          Follow these steps to launch your business successfully
        </p>
      </motion.div>

      {/* Roadmap Content with Custom Styling */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            // Step headers (H2)
            h2: ({ children }) => {
              const text = String(children);
              const stepMatch = text.match(/Step (\d+):\s*(.+)/);
              const stepNumber = stepMatch ? stepMatch[1] : null;
              const stepTitle = stepMatch ? stepMatch[2] : text;

              // Get contextual icon based on step title
              const icon = getStepIcon(String(stepTitle));

              // Always create a generic helper for each step
              const helper = {
                id: "step-helper",
                title: "Get Help",
                description: "AI-powered help for this step",
                type: "document" as const,
                icon: "✨",
                prompt:
                  "Help me with {context}. Provide practical, actionable advice including: what to do, resources needed, timeline, and tips for success.",
              };

              return (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="relative mt-8 mb-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Step Icon Badge */}
                    {stepNumber && (
                      <div
                        className={`flex-shrink-0 w-14 h-14 rounded-2xl ${icon.bgColor} flex flex-col items-center justify-center shadow-lg border-2 border-white`}
                      >
                        <span className="text-2xl mb-0.5">{icon.emoji}</span>
                        <span className={`text-xs font-bold ${icon.color}`}>
                          {stepNumber}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      {/* Step Title and Helper Button - Side by Side */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className="text-2xl font-bold text-dark m-0 leading-tight flex-1">
                          {children}
                        </h2>

                        {/* Helper Button on the Right */}
                        {stepNumber && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() =>
                              setSelectedHelper({
                                helper,
                                stepTitle: String(stepTitle),
                              })
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-full text-sm font-medium shadow-md hover:shadow-lg transition flex-shrink-0"
                          >
                            <FaHandsHelping />
                            <span>Help</span>
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* Connecting line to next step */}
                  <div className="absolute left-7 top-14 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent -z-10" />
                </motion.div>
              );
            },

            // Section headers (H3)
            h3: ({ children }) => (
              <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                {children}
              </h3>
            ),

            // Paragraphs
            p: ({ children }) => {
              const text = String(children);

              // Timeline
              if (text.includes("Timeline:")) {
                return (
                  <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-3">
                    <FaClock className="text-blue-600" />
                    <p className="text-base text-blue-900 font-medium m-0">
                      {children}
                    </p>
                  </div>
                );
              }

              // Priority
              if (text.includes("Priority:")) {
                const isHigh = text.includes("High");
                const isMedium = text.includes("Medium");
                const colorClass = isHigh
                  ? "bg-red-50 text-red-900"
                  : isMedium
                    ? "bg-amber-50 text-amber-900"
                    : "bg-green-50 text-green-900";

                return (
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg mb-3 ${colorClass}`}
                  >
                    <FaExclamationCircle />
                    <p className="text-base font-medium m-0">{children}</p>
                  </div>
                );
              }

              // Estimated Cost
              if (text.includes("Estimated Cost:") || text.includes("₹")) {
                return (
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg mb-3">
                    <FaRupeeSign className="text-green-600" />
                    <p className="text-base text-green-900 font-medium m-0">
                      {children}
                    </p>
                  </div>
                );
              }

              // Regular paragraphs
              return (
                <p className="text-base leading-relaxed text-gray-700 mb-3">
                  {children}
                </p>
              );
            },

            // Unordered lists (Resources, Success Criteria)
            ul: ({ children }) => (
              <ul className="space-y-2 mb-4">{children}</ul>
            ),

            // List items with custom styling
            li: ({ children }) => (
              <li className="flex items-start gap-3 text-base text-gray-700">
                <FaCheckCircle className="text-success mt-1 flex-shrink-0" />
                <span className="flex-1">{children}</span>
              </li>
            ),

            // Ordered lists
            ol: ({ children }) => (
              <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                {children}
              </ol>
            ),

            // Strong text
            strong: ({ children }) => {
              const text = String(children);

              // Section labels - render as span instead of div to avoid nesting issues
              if (
                text.includes("What to Do") ||
                text.includes("Resources Needed") ||
                text.includes("Success Criteria")
              ) {
                return (
                  <strong className="flex items-center gap-2 mt-4 mb-2 text-lg font-bold text-dark">
                    <FaListUl className="text-primary" />
                    {children}
                  </strong>
                );
              }

              return (
                <strong className="font-semibold text-gray-900">
                  {children}
                </strong>
              );
            },

            // Emphasis
            em: ({ children }) => (
              <em className="italic text-gray-700">{children}</em>
            ),

            // Horizontal rule (step separator)
            hr: () => (
              <div className="my-8 border-t-2 border-dashed border-gray-200" />
            ),

            // Blockquotes (tips/notes)
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-accent bg-accent/5 pl-4 pr-4 py-3 rounded-r-lg my-4">
                <div className="flex items-start gap-2">
                  <span className="text-accent text-xl">💡</span>
                  <div className="flex-1 text-gray-700">{children}</div>
                </div>
              </blockquote>
            ),

            // Code (for specific terms)
            code: ({ children }) => (
              <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                {children}
              </code>
            ),
          }}
        >
          {roadmapContent}
        </ReactMarkdown>
      </div>

      {/* Roadmap Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 p-6 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl border-2 border-dashed border-primary/30"
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success flex items-center justify-center">
            <FaCheckCircle className="text-white text-2xl" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-dark mb-2">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-700 mb-4">
              This roadmap is your guide to success. Take it one step at a time,
              stay focused, and don&apos;t hesitate to seek help when needed.
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                📋 Save this roadmap
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                ✅ Check off steps as you complete them
              </span>
              <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 shadow-sm">
                🚀 Start with Step 1 today
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
