"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatInput from "./ChatInput";
import { ChatMessage } from "@/lib/types";
import { sendMessageToBedrock } from "@/lib/bedrockApi";

interface ChatInterfaceProps {
    placeholder?: string;
    className?: string;
}

export default function ChatInterface({
    placeholder = "Ask me about your business idea...",
    className = "",
}: ChatInterfaceProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleMessageSend = async (message: string) => {
        // Clear any previous errors
        setError(null);

        // Add user message to messages array immediately
        const userMessage: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: message,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Set loading state
        setIsLoading(true);

        try {
            // Call sendMessageToBedrock API
            const reply = await sendMessageToBedrock(message);

            // Add AI reply to messages array
            const aiMessage: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: reply,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            // Show error message if API fails
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
            setError(errorMessage);
        } finally {
            // Set loading state to false
            setIsLoading(false);
        }
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                                }`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user"
                                    ? "gradient-primary text-white card-shadow"
                                    : "bg-white text-gray-800 card-shadow"
                                    }`}
                            >
                                {msg.role === "user" ? (
                                    <p className="text-base leading-relaxed whitespace-pre-wrap">
                                        {msg.content}
                                    </p>
                                ) : (
                                    <div className="prose prose-sm max-w-none">
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({ children }) => (
                                                    <h1 className="text-xl font-bold text-gray-900 mb-3 mt-2">
                                                        {children}
                                                    </h1>
                                                ),
                                                h2: ({ children }) => (
                                                    <h2 className="text-lg font-bold text-gray-900 mb-2 mt-3">
                                                        {children}
                                                    </h2>
                                                ),
                                                h3: ({ children }) => (
                                                    <h3 className="text-base font-semibold text-gray-800 mb-2 mt-2">
                                                        {children}
                                                    </h3>
                                                ),
                                                p: ({ children }) => (
                                                    <p className="text-base leading-relaxed text-gray-700 mb-2">
                                                        {children}
                                                    </p>
                                                ),
                                                ul: ({ children }) => (
                                                    <ul className="list-disc list-inside space-y-1 mb-3 text-gray-700">
                                                        {children}
                                                    </ul>
                                                ),
                                                ol: ({ children }) => (
                                                    <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-700">
                                                        {children}
                                                    </ol>
                                                ),
                                                li: ({ children }) => (
                                                    <li className="text-base leading-relaxed ml-2">
                                                        {children}
                                                    </li>
                                                ),
                                                strong: ({ children }) => (
                                                    <strong className="font-semibold text-gray-900">
                                                        {children}
                                                    </strong>
                                                ),
                                                em: ({ children }) => (
                                                    <em className="italic text-gray-700">
                                                        {children}
                                                    </em>
                                                ),
                                                code: ({ children }) => (
                                                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800">
                                                        {children}
                                                    </code>
                                                ),
                                                pre: ({ children }) => (
                                                    <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-3">
                                                        {children}
                                                    </pre>
                                                ),
                                                blockquote: ({ children }) => (
                                                    <blockquote className="border-l-4 border-primary pl-4 italic text-gray-700 my-3">
                                                        {children}
                                                    </blockquote>
                                                ),
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-start"
                    >
                        <div className="max-w-[80%] rounded-2xl px-4 py-3 bg-white text-gray-800 card-shadow">
                            <div className="flex items-center gap-2">
                                <span className="text-base">Thinking</span>
                                <div className="flex gap-1">
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: 0,
                                        }}
                                    >
                                        .
                                    </motion.span>
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: 0.2,
                                        }}
                                    >
                                        .
                                    </motion.span>
                                    <motion.span
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            delay: 0.4,
                                        }}
                                    >
                                        .
                                    </motion.span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Error Display */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex justify-center"
                    >
                        <div className="max-w-[90%] rounded-2xl px-4 py-3 bg-red-50 border border-red-200 text-red-800 card-shadow">
                            <div className="flex items-start gap-3">
                                <span className="text-red-500 text-xl">⚠️</span>
                                <div className="flex-1">
                                    <p className="text-sm font-medium mb-1">Error</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500 hover:text-red-700 text-lg font-bold"
                                    aria-label="Dismiss error"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-light border-t border-gray-200">
                <ChatInput
                    onMessageSend={handleMessageSend}
                    placeholder={placeholder}
                    disabled={isLoading}
                />
            </div>
        </div>
    );
}
