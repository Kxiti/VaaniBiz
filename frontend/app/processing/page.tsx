"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProgressPipeline from "@/components/ProgressPipeline";
import { ProcessingStage } from "@/lib/types";
import { sendMessageToBedrock } from "@/lib/bedrockApi";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transcription = searchParams.get("transcription") || "";
  const language = searchParams.get("language") || "english";

  const [stages, setStages] = useState<ProcessingStage[]>([
    { id: "listening", label: "Listening to your idea", completed: false },
    {
      id: "understanding",
      label: "Understanding your business",
      completed: false,
    },
    { id: "analyzing", label: "Analyzing market demand", completed: false },
    { id: "roadmap", label: "Creating your startup roadmap", completed: false },
  ]);

  useEffect(() => {
    const processIdea = async () => {
      try {
        // Stage 1: Listening (immediate)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateStage("listening", true);

        // Stage 2: Understanding
        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateStage("understanding", true);

        // Stage 3: Analyzing - Call business insights API
        console.log("Calling business insights API...");
        const insightsResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: transcription,
            language: language,
          }),
        });

        if (!insightsResponse.ok) {
          throw new Error("Failed to generate business insights");
        }

        const insightsData = await insightsResponse.json();
        const businessAnalysis =
          insightsData.reply || insightsData.message || "";
        console.log("Business insights received");

        updateStage("analyzing", true);

        // Stage 4: Roadmap - Call roadmap API
        console.log("Calling roadmap API...");
        const roadmapResponse = await fetch("/api/roadmap", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessIdea: transcription,
            businessAnalysis: businessAnalysis,
            language: language,
          }),
        });

        if (!roadmapResponse.ok) {
          throw new Error("Failed to generate roadmap");
        }

        const roadmapData = await roadmapResponse.json();
        const roadmap = roadmapData.reply || roadmapData.message || "";
        console.log("Roadmap received");

        updateStage("roadmap", true);

        // Wait a bit then navigate to results
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Store results in sessionStorage
        sessionStorage.setItem(
          "businessResults",
          JSON.stringify({
            transcription,
            aiResponse: businessAnalysis,
            roadmap: roadmap,
            language,
          }),
        );

        router.push("/results");
      } catch (error) {
        console.error("Error processing idea:", error);
        alert(
          "Something went wrong while analyzing your idea. Please try again.",
        );
        router.push("/idea");
      }
    };

    if (transcription) {
      processIdea();
    }
  }, [transcription, language, router]);

  const updateStage = (stageId: string, completed: boolean) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId ? { ...stage, completed } : stage,
      ),
    );
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Creating Your <span className="text-primary">Business Plan</span>
          </h1>
          <p className="text-xl text-gray-600">
            Our AI is analyzing your idea and creating a personalized roadmap
          </p>
        </motion.div>

        {/* Progress Pipeline */}
        <ProgressPipeline stages={stages} />

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-3 bg-accent/10 rounded-full">
            <p className="text-sm text-gray-600">
              💡 <span className="font-semibold">Did you know?</span> 70% of
              successful businesses start with a simple idea like yours
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProcessingContent />
    </Suspense>
  );
}
