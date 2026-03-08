"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CollapsibleSection from "@/components/CollapsibleSection";
import StartupRoadmap from "@/components/StartupRoadmap";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import {
  FaDownload,
  FaShare,
  FaLightbulb,
  FaRoad,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";
import { Language } from "@/lib/types";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<{
    transcription: string;
    aiResponse: string;
    roadmap?: string;
    language: string;
  } | null>(null);

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { speak, stop, isSpeaking } = useTextToSpeech(
    (results?.language as Language) || "english",
  );

  useEffect(() => {
    const storedResults = sessionStorage.getItem("businessResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      router.push("/");
    }
  }, [router]);

  const handleSpeak = (text: string, sectionId: string) => {
    if (activeSection === sectionId && isSpeaking) {
      stop();
      setActiveSection(null);
    } else {
      stop(); // Stop any current speech
      setActiveSection(sectionId);
      speak(text, results?.language as Language);
    }
  };

  const handleStopSpeaking = () => {
    stop();
    setActiveSection(null);
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const { transcription, aiResponse, roadmap } = results;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-success/10 rounded-full mb-6"
          >
            <FaCheckCircle className="text-success text-xl" />
            <span className="text-success font-semibold text-lg">
              Analysis Complete!
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Your Business Plan is Ready
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Everything you need to launch your business successfully
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 gradient-primary text-white rounded-full font-medium flex items-center gap-2 hover:shadow-lg transition"
            >
              <FaDownload />
              Download PDF
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-dark rounded-full font-medium flex items-center gap-2 hover:border-primary transition"
            >
              <FaShare />
              Share Plan
            </motion.button>
          </div>
        </motion.div>

        {/* Your Business Idea */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border-2 border-dashed border-primary/30">
            <div className="flex items-start gap-4">
              <FaQuoteLeft className="text-primary text-3xl flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h2 className="text-xl font-bold text-dark mb-3">
                  Your Business Idea
                </h2>
                <p className="text-gray-700 text-lg italic leading-relaxed">
                  "{transcription}"
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Business Analysis - Collapsible */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <CollapsibleSection
            title="Business Analysis & Insights"
            icon={<FaLightbulb className="text-2xl" />}
            defaultOpen={true}
            onSpeak={() => handleSpeak(aiResponse, "analysis")}
            isSpeaking={activeSection === "analysis" && isSpeaking}
            onStopSpeaking={handleStopSpeaking}
            accentColor="primary"
          >
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-gray-900 mb-3 mt-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-base leading-relaxed text-gray-700 mb-3">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-base leading-relaxed ml-4">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                      {children}
                    </code>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {aiResponse}
              </ReactMarkdown>
            </div>
          </CollapsibleSection>
        </motion.section>

        {/* Startup Roadmap - Collapsible */}
        {roadmap && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <CollapsibleSection
              title="Startup Roadmap"
              icon={<FaRoad className="text-2xl" />}
              defaultOpen={false}
              onSpeak={() => handleSpeak(roadmap, "roadmap")}
              isSpeaking={activeSection === "roadmap" && isSpeaking}
              onStopSpeaking={handleStopSpeaking}
              accentColor="success"
            >
              <StartupRoadmap
                roadmapContent={roadmap}
                businessIdea={transcription}
                language={results?.language as Language}
              />
            </CollapsibleSection>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12 gradient-hero rounded-3xl mt-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Action?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Start implementing your business plan today
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/idea")}
              className="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-xl transition"
            >
              Create Another Plan
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-white/20 backdrop-blur text-white border-2 border-white rounded-full font-semibold hover:bg-white/30 transition"
            >
              Get Mentor Support
            </motion.button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
