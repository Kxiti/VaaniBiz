"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProgressPipeline from "@/components/ProgressPipeline";
import { ProcessingStage } from "@/lib/types";
import { getOpportunities } from "@/lib/api";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transcription = searchParams.get("transcription") || "";
  const language = searchParams.get("language") || "english";

  const [stages, setStages] = useState<ProcessingStage[]>([
    { id: "listening", label: "Listening to your idea", completed: false },
    { id: "understanding", label: "Understanding your business", completed: false },
    { id: "analyzing", label: "Analyzing market demand", completed: false },
    { id: "roadmap", label: "Creating your startup roadmap", completed: false },
  ]);

  useEffect(() => {
    const processIdea = async () => {
      try {

        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateStage("listening", true);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        updateStage("understanding", true);

        console.log("Calling business insights API...");

        const insightsResponse = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: transcription,
            language: language,
          }),
        });

        const insightsData = await insightsResponse.json();
        const businessAnalysis =
          insightsData.reply || insightsData.message || "";

        console.log("Business insights received");

        updateStage("analyzing", true);

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

        const roadmapData = await roadmapResponse.json();
        const roadmap = roadmapData.reply || roadmapData.message || "";

        console.log("Roadmap received");

        updateStage("roadmap", true);

        // -------------------------
        // GENERATE OPPORTUNITIES
        // -------------------------

        console.log("Generating opportunities...");

        const opps = await getOpportunities({
  businessType: transcription,
  location: "Jhansi",
  targetMarket: "college students",
  estimatedScale: "small",
  requiredResources: [],
});

        console.log("Opportunities generated:", opps);

        // -------------------------
        // SAVE RESULTS
        // -------------------------

        const finalResults = {
          transcription,
          aiResponse: businessAnalysis,
          roadmap: roadmap,
          opportunities: opps,
          language,
        };

        console.log("Saving results to sessionStorage:", finalResults);

        const resultsData = {
  transcription,
  aiResponse: businessAnalysis,
  roadmap,
  opportunities: opps || [],
  language,
};

console.log("Saving results:", resultsData);

sessionStorage.setItem(
  "businessResults",
  JSON.stringify(resultsData)
);

        await new Promise((resolve) => setTimeout(resolve, 1000));

        router.push("/results");

      } catch (error) {
        console.error("Error processing idea:", error);
        alert("Something went wrong while analyzing your idea.");
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
        stage.id === stageId ? { ...stage, completed } : stage
      )
    );
  };

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Creating Your <span className="text-primary">Business Plan</span>
          </h1>

          <p className="text-xl text-gray-600">
            Our AI is analyzing your idea
          </p>
        </motion.div>

        <ProgressPipeline stages={stages} />

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