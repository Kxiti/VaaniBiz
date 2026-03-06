"use client";

import { motion } from "framer-motion";
import { RoadmapStep } from "@/lib/types";
import { FaCheckCircle, FaClock, FaExclamationCircle } from "react-icons/fa";

interface RoadmapStepperProps {
  steps: RoadmapStep[];
}

const priorityColors = {
  high: "text-red-500",
  medium: "text-accent",
  low: "text-gray-500",
};

const priorityIcons = {
  high: <FaExclamationCircle />,
  medium: <FaClock />,
  low: <FaCheckCircle />,
};

export default function RoadmapStepper({ steps }: RoadmapStepperProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.stepNumber}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
            className="relative flex gap-6"
          >
            {/* Step number circle */}
            <div className="relative z-10 w-12 h-12 gradient-primary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-lg shadow-lg">
              {step.stepNumber}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-2xl p-6 card-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-dark">{step.title}</h3>
                <div
                  className={`flex items-center gap-1 text-sm font-medium ${
                    priorityColors[step.priority]
                  }`}
                >
                  {priorityIcons[step.priority]}
                  <span className="capitalize">{step.priority}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Resources */}
              {step.requiredResources.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Required Resources:
                  </h4>
                  <ul className="space-y-1">
                    {step.requiredResources.map((resource, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-600 flex items-start gap-2"
                      >
                        <span className="text-primary mt-0.5">✓</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Time estimate */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FaClock />
                <span>Estimated time: {step.estimatedTime}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
