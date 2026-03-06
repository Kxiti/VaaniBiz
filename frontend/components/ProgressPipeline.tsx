"use client";

import { motion } from "framer-motion";
import { ProcessingStage } from "@/lib/types";
import {
  FaMicrophone,
  FaBrain,
  FaChartLine,
  FaRoad,
  FaLightbulb,
  FaCheck,
} from "react-icons/fa";

interface ProgressPipelineProps {
  stages: ProcessingStage[];
}

const stageIcons: Record<string, React.ReactNode> = {
  listening: <FaMicrophone className="text-2xl" />,
  understanding: <FaBrain className="text-2xl" />,
  analyzing: <FaChartLine className="text-2xl" />,
  roadmap: <FaRoad className="text-2xl" />,
  opportunities: <FaLightbulb className="text-2xl" />,
};

export default function ProgressPipeline({ stages }: ProgressPipelineProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.2 }}
          className={`flex items-center gap-4 p-6 rounded-2xl transition-all ${
            stage.completed
              ? "bg-success/10 border-2 border-success"
              : "bg-white border-2 border-gray-200"
          }`}
        >
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              stage.completed
                ? "bg-success text-white"
                : "bg-primary/10 text-primary"
            }`}
          >
            {stage.completed ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FaCheck className="text-2xl" />
              </motion.div>
            ) : (
              <motion.div
                animate={{ rotate: stage.completed ? 0 : 360 }}
                transition={{
                  duration: 2,
                  repeat: stage.completed ? 0 : Infinity,
                  ease: "linear",
                }}
              >
                {stageIcons[stage.id]}
              </motion.div>
            )}
          </div>

          {/* Label */}
          <div className="flex-1">
            <h3
              className={`text-lg font-semibold ${
                stage.completed ? "text-success" : "text-dark"
              }`}
            >
              {stage.label}
            </h3>
            <p className="text-sm text-gray-500">
              {stage.completed ? "Completed" : "Processing..."}
            </p>
          </div>

          {/* Loading animation */}
          {!stage.completed && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
