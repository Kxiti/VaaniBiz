"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import IdeaInput from "@/components/IdeaInput";
import LanguageSelector from "@/components/LanguageSelector";
import ChatInterface from "@/components/ChatInterface";
import { Language } from "@/lib/types";
import { transcribeAudio } from "@/lib/api";

export default function IdeaPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("hindi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState<string>("");

  const handleRecordingComplete = async (
    audioBlob: Blob,
    transcription: string,
  ) => {
    console.log('handleRecordingComplete called');
    console.log('Audio blob size:', audioBlob.size);
    console.log('Transcription received:', transcription);
    console.log('Transcription length:', transcription?.length);

    setIsProcessing(true);

    try {
      // Use the live transcription from speech recognition
      const text =
        transcription || (await transcribeAudio(audioBlob, selectedLanguage));

      console.log('Final text to use:', text);
      console.log('Text length:', text?.length);

      // Check if we got any transcription
      if (!text || text.trim().length === 0) {
        console.error('No transcription available');
        alert("No speech was detected. Please try again and speak clearly.");
        setIsProcessing(false);
        return;
      }

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

  const handleTextSubmit = async (text: string) => {
    setIsProcessing(true);
    setTranscription(text);

    try {
      // Show text briefly
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to processing page
      router.push(
        `/processing?transcription=${encodeURIComponent(text)}&language=${selectedLanguage}`,
      );
    } catch (error) {
      console.error("Error processing text:", error);
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
            Tell Us Your <span className="text-primary">Business Idea</span>
          </h1>
          <p className="text-xl text-gray-600">
            Speak or type in your language. We'll understand.
          </p>
        </motion.div>

        {/* Language Selector */}
        <div className="mb-12">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />
        </div>

        {/* Combined Voice & Text Input */}
        <div className="mb-12">
          <IdeaInput
            onVoiceComplete={handleRecordingComplete}
            onTextSubmit={handleTextSubmit}
            selectedLanguage={selectedLanguage}
            disabled={isProcessing}
          />
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

        {/* Chat Interface Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold text-dark mb-4 text-center">
            Or <span className="text-primary">Chat</span> with AI Assistant
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Have a conversation about your business idea
          </p>
          <div className="bg-white rounded-2xl card-shadow overflow-hidden" style={{ height: "500px" }}>
            <ChatInterface placeholder="Ask me about your business idea..." />
          </div>
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
