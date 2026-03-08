"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaStop } from "react-icons/fa";
import { Language, LANGUAGE_CODES } from "@/lib/types";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onTranscriptionUpdate?: (text: string) => void;
  selectedLanguage: Language;
}

export default function VoiceRecorder({
  onRecordingComplete,
  onTranscriptionUpdate,
  selectedLanguage,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [isSupported, setIsSupported] = useState(true);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn("Speech recognition not supported in this browser");
      return;
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = LANGUAGE_CODES[selectedLanguage];

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      const fullTranscript = (
        transcription +
        finalTranscript +
        interimTranscript
      ).trim();
      setTranscription(fullTranscript);

      if (onTranscriptionUpdate) {
        onTranscriptionUpdate(fullTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "no-speech") {
        console.log("No speech detected, continuing...");
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedLanguage]);

  const startRecording = async () => {
    try {
      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();

      // Start speech recognition
      if (recognitionRef.current && isSupported) {
        recognitionRef.current.lang = LANGUAGE_CODES[selectedLanguage];
        recognitionRef.current.start();
      }

      setIsRecording(true);
      setRecordingTime(0);
      setTranscription("");

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record your idea.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      // Stop speech recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center">
      <motion.button
        onClick={isRecording ? stopRecording : startRecording}
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
          isRecording
            ? "bg-red-500 hover:bg-red-600"
            : "gradient-primary hover:shadow-2xl"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Pulsing rings when recording */}
        <AnimatePresence>
          {isRecording && (
            <>
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-red-500"
              />
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                className="absolute inset-0 rounded-full bg-red-500"
              />
            </>
          )}
        </AnimatePresence>

        {/* Icon */}
        {isRecording ? (
          <FaStop className="text-white text-4xl relative z-10" />
        ) : (
          <FaMicrophone className="text-white text-4xl relative z-10" />
        )}
      </motion.button>

      {/* Recording time */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 text-2xl font-bold text-red-500"
          >
            {formatTime(recordingTime)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live transcription */}
      <AnimatePresence>
        {isRecording && transcription && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 max-w-md p-4 bg-white rounded-xl card-shadow"
          >
            <p className="text-sm text-gray-500 mb-2">Hearing:</p>
            <p className="text-gray-700">{transcription}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Waveform animation */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 h-16 mt-4"
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full wave-bar"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center text-gray-600 max-w-sm"
      >
        {isRecording
          ? "Speak clearly about your business idea..."
          : "Tap the microphone and tell us your business idea"}
      </motion.p>

      {!isSupported && (
        <p className="mt-2 text-sm text-amber-600">
          Note: Live transcription not supported in this browser. Audio will
          still be recorded.
        </p>
      )}
    </div>
  );
}
