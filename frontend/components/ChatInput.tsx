"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

interface ChatInputProps {
  onMessageSend: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function ChatInput({
  onMessageSend,
  placeholder = "Type your business idea...",
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onMessageSend(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-end gap-3 bg-white rounded-2xl card-shadow p-4">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 text-lg max-h-32 overflow-y-auto"
          style={{ minHeight: "28px" }}
        />

        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: message.trim() ? 1.05 : 1 }}
          whileTap={{ scale: message.trim() ? 0.95 : 1 }}
          className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            message.trim() && !disabled
              ? "gradient-primary hover:shadow-lg cursor-pointer"
              : "bg-gray-200 cursor-not-allowed"
          }`}
        >
          <FaPaperPlane
            className={`text-xl ${
              message.trim() && !disabled ? "text-white" : "text-gray-400"
            }`}
          />
        </motion.button>
      </div>

      <p className="text-xs text-gray-500 mt-2 text-center">
        Press Enter to send, Shift+Enter for new line
      </p>
    </form>
  );
}
