"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import InsightCard from "@/components/InsightCard";
import RoadmapStepper from "@/components/RoadmapStepper";
import OpportunityCard from "@/components/OpportunityCard";
import {
  BusinessProfile,
  AnalyticsOutput,
  RoadmapStep,
  Opportunity,
} from "@/lib/types";
import {
  FaStore,
  FaUsers,
  FaChartLine,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaLightbulb,
  FaDownload,
  FaShare,
} from "react-icons/fa";

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<{
    profile: BusinessProfile;
    analytics: AnalyticsOutput;
    roadmap: RoadmapStep[];
    opportunities: Opportunity[];
  } | null>(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("businessResults");
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Redirect to home if no results
      router.push("/");
    }
  }, [router]);

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  const { profile, analytics, roadmap, opportunities } = results;

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-block px-4 py-2 bg-success/10 rounded-full mb-4">
            <span className="text-success font-semibold">
              ✓ Analysis Complete
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-dark mb-4">
            Your Business Plan is Ready!
          </h1>
          <p className="text-xl text-gray-600">
            Here's everything you need to start your business
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            <button className="px-6 py-3 gradient-primary text-white rounded-full font-medium flex items-center gap-2 hover:shadow-lg transition">
              <FaDownload />
              Download PDF
            </button>
            <button className="px-6 py-3 bg-white border-2 border-gray-200 text-dark rounded-full font-medium flex items-center gap-2 hover:border-primary transition">
              <FaShare />
              Share Plan
            </button>
          </div>
        </motion.div>

        {/* Business Profile */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-dark mb-6">
            Your Business Idea
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 card-shadow">
              <FaStore className="text-3xl text-primary mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">
                Business Type
              </h3>
              <p className="text-lg font-bold text-dark">
                {profile.businessType}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 card-shadow">
              <FaUsers className="text-3xl text-primary mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">
                Target Market
              </h3>
              <p className="text-lg font-bold text-dark">
                {profile.targetMarket}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 card-shadow">
              <FaChartLine className="text-3xl text-primary mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">Scale</h3>
              <p className="text-lg font-bold text-dark">
                {profile.estimatedScale}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 card-shadow">
              <FaLightbulb className="text-3xl text-primary mb-3" />
              <h3 className="font-semibold text-gray-700 mb-1">Location</h3>
              <p className="text-lg font-bold text-dark">{profile.location}</p>
            </div>
          </div>
        </motion.section>

        {/* Market Insights */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-dark mb-6">Market Insights</h2>
          <div className="space-y-6">
            <InsightCard
              icon={<FaChartLine className="text-white text-xl" />}
              title="Market Viability"
              content={analytics.viabilityNarrative}
              delay={0.3}
            />

            <InsightCard
              icon={<FaMoneyBillWave className="text-white text-xl" />}
              title="Startup Costs"
              content={analytics.costBreakdown.map(
                (cost) =>
                  `${cost.category}: ${cost.amount} - ${cost.explanation}`,
              )}
              delay={0.4}
            />

            <InsightCard
              icon={<FaExclamationTriangle className="text-white text-xl" />}
              title="Possible Challenges"
              content={analytics.riskScenarios.map(
                (risk) => `${risk.riskType}: ${risk.scenario}`,
              )}
              delay={0.5}
            />
          </div>
        </section>

        {/* Startup Roadmap */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-dark mb-6">
            Your Startup Roadmap
          </h2>
          <p className="text-gray-600 mb-8">
            Follow these steps to launch your business successfully
          </p>
          <RoadmapStepper steps={roadmap} />
        </section>

        {/* Local Opportunities */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-dark mb-6">
            Local Opportunities
          </h2>
          <p className="text-gray-600 mb-8">
            Capitalize on these timing-specific opportunities
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opportunity, index) => (
              <OpportunityCard
                key={index}
                opportunity={opportunity}
                delay={index * 0.1}
              />
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center py-12 gradient-hero rounded-3xl"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Action?
          </h2>
          <p className="text-white/90 mb-8 text-lg">
            Start with Step 1 of your roadmap today
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push("/idea")}
              className="px-8 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-xl transition"
            >
              Create Another Plan
            </button>
            <button className="px-8 py-3 bg-white/20 backdrop-blur text-white border-2 border-white rounded-full font-semibold hover:bg-white/30 transition">
              Get Mentor Support
            </button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
