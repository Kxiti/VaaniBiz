"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CollapsibleSection from "@/components/CollapsibleSection";
import StartupRoadmap from "@/components/StartupRoadmap";
import OpportunityCard from "@/components/OpportunityCard";

import { Opportunity, Language } from "@/lib/types";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { generateBusinessPlanPDF } from "@/lib/pdfGenerator";

import {
  FaDownload,
  FaShare,
  FaLightbulb,
  FaRoad,
  FaCheckCircle,
  FaQuoteLeft,
} from "react-icons/fa";

export default function ResultsPage() {
  const router = useRouter();

  const [results, setResults] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { speak, stop, isSpeaking } = useTextToSpeech(
    (results?.language as Language) || "english",
  );

  // Load results from sessionStorage
  useEffect(() => {
    const storedResults = sessionStorage.getItem("businessResults");

    if (storedResults) {
      const parsed = JSON.parse(storedResults);
      console.log("Loaded Results:", parsed);
      setResults(parsed);
    } else {
      router.push("/");
    }
  }, [router]);

  // Loading screen
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

  const transcription = results.transcription;
  const aiResponse = results.aiResponse;
  const roadmap = results.roadmap;
  const opportunities: Opportunity[] = results.opportunities || [];

  const handleSpeak = (text: string, sectionId: string) => {
    if (activeSection === sectionId && isSpeaking) {
      stop();
      setActiveSection(null);
    } else {
      stop();
      setActiveSection(sectionId);
      speak(text, results?.language as Language);
    }
  };

  const handleStopSpeaking = () => {
    stop();
    setActiveSection(null);
  };

  const handleDownloadPDF = () => {
    generateBusinessPlanPDF(transcription, aiResponse, roadmap, opportunities);
  };

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

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              className="px-6 py-3 gradient-primary text-white rounded-full font-medium flex items-center gap-2"
            >
              <FaDownload />
              Download PDF
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-dark rounded-full font-medium flex items-center gap-2"
            >
              <FaShare />
              Share Plan
            </motion.button>
          </div>
        </motion.div>

        {/* Business Idea */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 border-2 border-dashed border-primary/30">
            <div className="flex items-start gap-4">
              <FaQuoteLeft className="text-primary text-3xl mt-1" />

              <div>
                <h2 className="text-xl font-bold text-dark mb-3">
                  Your Business Idea
                </h2>

                <p className="text-gray-700 text-lg italic">
                  &quot;{transcription}&quot;
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Business Analysis */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
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
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiResponse}
              </ReactMarkdown>
            </div>
          </CollapsibleSection>
        </motion.section>

        {/* Startup Roadmap */}
        {roadmap && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <CollapsibleSection
              title="Startup Roadmap"
              icon={<FaRoad className="text-2xl" />}
              accentColor="success"
              defaultOpen={false}
              onSpeak={() => handleSpeak(roadmap, "roadmap")}
              isSpeaking={activeSection === "roadmap" && isSpeaking}
              onStopSpeaking={handleStopSpeaking}
            >
              <StartupRoadmap
                roadmapContent={roadmap}
                businessIdea={transcription}
                language={results.language as Language}
              />
            </CollapsibleSection>
          </motion.section>
        )}

        {/* Opportunities Section */}
        {opportunities.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-dark mb-6 text-center">
              Business Opportunities
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {opportunities.map((opp, index) => (
                <OpportunityCard
                  key={index}
                  opportunity={opp}
                  delay={index * 0.2}
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 gradient-hero rounded-3xl mt-12"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Action?
          </h2>

          <p className="text-white/90 mb-8 text-lg">
            Start implementing your business plan today
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/idea")}
            className="px-8 py-3 bg-white text-primary rounded-full font-semibold"
          >
            Create Another Plan
          </motion.button>
        </motion.section>
      </div>
    </main>
  );
}
