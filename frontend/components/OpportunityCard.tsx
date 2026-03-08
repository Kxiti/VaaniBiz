"use client";

import { motion } from "framer-motion";
import { Opportunity } from "@/lib/types";
import { FaLightbulb, FaClock, FaArrowRight } from "react-icons/fa";

interface OpportunityCardProps {
  opportunity: Opportunity;
  delay?: number;
}

export default function OpportunityCard({
  opportunity,
  delay = 0,
}: OpportunityCardProps) {
  const scorePercentage = Math.round(opportunity.relevanceScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white rounded-2xl p-6 card-shadow hover:shadow-2xl transition-all hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center">
            <FaLightbulb className="text-white text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-dark">{opportunity.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <FaClock />
              <span>{opportunity.timing}</span>
            </div>
          </div>
        </div>

        {/* Relevance score */}
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">
            {scorePercentage}%
          </div>
          <div className="text-xs text-gray-500">Relevance</div>
        </div>
      </div>

      {/* Description */}
      <div className="markdown-content text-sm">
        <p className="text-gray-600 mb-4 leading-relaxed">
          {opportunity.description}
        </p>
      </div>

      {/* Action required */}
      <div className="bg-primary/5 rounded-xl p-4 border-l-4 border-primary">
        <div className="flex items-start gap-2">
          <FaArrowRight className="text-primary mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-dark mb-1">Action Required:</h4>
            <p className="text-sm text-gray-600">
              {opportunity.actionRequired}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
