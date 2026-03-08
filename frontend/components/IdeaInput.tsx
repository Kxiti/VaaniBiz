"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaKeyboard } from "react-icons/fa";
import VoiceRecorder from "./VoiceRecorder";
import ChatInput from "./ChatInput";
import { Language } from "@/lib/types";

type InputMode = "voice" | "text";

interface IdeaInputProps {
  onVoiceComplete: (audioBlob: Blob, transcription: string) => void;
  onTextSubmit: (text: string) => void;
  selectedLanguage: Language;
  disabled?: boolean;
}

export default function IdeaInput({
  onVoiceComplete,
  onTextSubmit,
  selectedLanguage,
  disabled = false,
}: IdeaInputProps) {
  const [inputMode, setInputMode] = useState<InputMode>("voice");
  const [liveTranscription, setLiveTranscription] = useState("");

  const handleVoiceComplete = (audioBlob: Blob) => {
    onVoiceComplete(audioBlob, liveTranscription);
    setLiveTranscription("");
  };

  return (
    <div className="w-full">
      {/* Mode Toggle */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-gray-100 rounded-full p-1">
          <motion.button
            onClick={() => setInputMode("voice")}
            disabled={disabled}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              inputMode === "voice"
                ? "bg-white text-primary shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
          >
            <FaMicrophone className="text-lg" />
            <span>Voice</span>
          </motion.button>

          <motion.button
            onClick={() => setInputMode("text")}
            disabled={disabled}
            className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
              inputMode === "text"
                ? "bg-white text-primary shadow-md"
                : "text-gray-600 hover:text-gray-900"
            }`}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
          >
            <FaKeyboard className="text-lg" />
            <span>Text</span>
          </motion.button>
        </div>
      </div>

      {/* Input Area */}
      <AnimatePresence mode="wait">
        {inputMode === "voice" ? (
          <motion.div
            key="voice"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <VoiceRecorder
              onRecordingComplete={handleVoiceComplete}
              onTranscriptionUpdate={setLiveTranscription}
              selectedLanguage={selectedLanguage}
            />
          </motion.div>
        ) : (
          <motion.div
            key="text"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            <div className="mb-6">
              <ChatInput
                onMessageSend={onTextSubmit}
                placeholder="Type your business idea here..."
                disabled={disabled}
              />
            </div>

            {/* Helper text for text mode */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center text-gray-600"
            >
              Describe your business idea in detail
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
