"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import VoiceRecorder from "@/components/VoiceRecorder";
import LanguageSelector from "@/components/LanguageSelector";
import { Language } from "@/lib/types";
import { transcribeAudio } from "@/lib/api";

export default function IdeaPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("hindi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");

  const handleRecordingComplete = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Transcribe audio
      const text = await transcribeAudio(audioBlob, selectedLanguage);
      setTranscription(text);

      // Show transcription briefly
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Navigate to processing page
      router.push(
        `/processing?transcription=${encodeURIComponent(text)}&language=${selectedLanguage}`,
      );
    } catch (error) {
      console.error("Error processing audio:", error);
      alert("Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Tell Us Your{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Business Idea
            </span>
          </h1>
          <p className="text-xl text-gray-600">
            Speak naturally in your language. We'll understand.
          </p>
        </motion.div>

        {/* Language Selector */}
        <div className="mb-12">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Voice Recorder */}
        <div className="mb-12">
          <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        </div>

        {/* Example */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300"
        >
          <h3 className="font-semibold text-dark mb-3">Example Idea:</h3>
          <p className="text-gray-600 italic">
            "I want to start a tea stall near my college. I have around 50,000
            rupees to invest. The college has about 2,000 students."
          </p>
        </motion.div>

        {/* Processing state */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="inline-block px-6 py-3 bg-primary/10 rounded-full">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-primary font-medium">
                  Processing your idea...
                </span>
              </div>
            </div>

            {transcription && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-white rounded-xl card-shadow"
              >
                <p className="text-sm text-gray-500 mb-2">We heard:</p>
                <p className="text-gray-700">{transcription}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
