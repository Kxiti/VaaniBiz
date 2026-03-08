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
  const transcriptionRef = useRef<string>("");
  const isRecordingRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn("Speech recognition not supported in this browser");
    }
  }, []);

  const startRecording = async () => {
    try {
      console.log('Starting recording with language:', LANGUAGE_CODES[selectedLanguage]);

      // Reset transcription
      setTranscription("");
      transcriptionRef.current = "";

      // Start audio recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');

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
        const finalTranscription = transcriptionRef.current;
        console.log('Recording stopped');
        console.log('Audio blob size:', audioBlob.size);
        console.log('Final transcription:', finalTranscription);
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      console.log('MediaRecorder started');

      // Start speech recognition
      if (isSupported) {
        const SpeechRecognition =
          (window as any).SpeechRecognition ||
          (window as any).webkitSpeechRecognition;

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = LANGUAGE_CODES[selectedLanguage];
        recognition.maxAlternatives = 1;

        console.log('Speech recognition configured for:', LANGUAGE_CODES[selectedLanguage]);

        recognition.onresult = (event: any) => {
          console.log('Speech recognition result:', event);
          const transcript = event.results[0][0].transcript;
          console.log('Transcript received:', transcript);

          // Append to existing transcription
          const newTranscription = (transcriptionRef.current + " " + transcript).trim();
          transcriptionRef.current = newTranscription;
          setTranscription(newTranscription);

          if (onTranscriptionUpdate) {
            onTranscriptionUpdate(newTranscription);
          }

          // Restart recognition if still recording
          if (isRecordingRef.current) {
            try {
              recognition.start();
              console.log('Recognition restarted');
            } catch (err) {
              console.log('Recognition restart skipped');
            }
          }
        };

        recognition.onend = () => {
          console.log('Recognition ended');
          // Auto-restart if still recording
          if (isRecordingRef.current) {
            try {
              recognition.start();
              console.log('Recognition auto-restarted');
            } catch (err) {
              console.log('Recognition auto-restart failed');
            }
          }
        };

        recognition.onerror = (event: any) => {
          console.error('Recognition error:', event.error);
          if (event.error === "no-speech") {
            console.log("No speech detected, continuing...");
          } else if (event.error === "not-allowed") {
            alert("Microphone access denied. Please allow microphone access.");
          }
        };

        recognitionRef.current = recognition;

        try {
          recognition.start();
          console.log('Speech recognition started');
        } catch (err) {
          console.error('Error starting speech recognition:', err);
        }
      }

      setIsRecording(true);
      isRecordingRef.current = true;
      setRecordingTime(0);

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
    console.log('Stopping recording');

    if (mediaRecorderRef.current && isRecording) {
      isRecordingRef.current = false;
      setIsRecording(false);

      mediaRecorderRef.current.stop();

      // Stop speech recognition
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          console.log('Speech recognition stopped');
        } catch (err) {
          console.log('Recognition already stopped');
        }
      }

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
        className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${isRecording
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
