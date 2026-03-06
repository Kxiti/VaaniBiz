"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  content: string | string[];
  delay?: number;
}

export default function InsightCard({
  icon,
  title,
  content,
  delay = 0,
}: InsightCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
          {Array.isArray(content) ? (
            <ul className="space-y-2">
              {content.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-600 flex items-start gap-2"
                >
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 leading-relaxed">{content}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
