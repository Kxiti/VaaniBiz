import {
  BusinessProfile,
  AnalyticsOutput,
  RoadmapStep,
  Opportunity,
} from "./types";

/* ============================================================================
   API Endpoint Configuration
============================================================================ */

const OPPORTUNITIES_API_URL =
  process.env.NEXT_PUBLIC_OPPORTUNITIES_API_URL ||
  "https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/opportunities";

/* ============================================================================
   Transcription Fallback
============================================================================ */

export async function transcribeAudio(
  audioBlob: Blob,
  language: string
): Promise<string> {
  console.warn("transcribeAudio called - speech recognition may have failed");
  return "";
}

/* ============================================================================
   Business Analysis (Mock for now)
============================================================================ */

export async function analyzeBusiness(
  transcription: string,
  language: string
): Promise<{
  profile: BusinessProfile;
  analytics: AnalyticsOutput;
}> {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    profile: {
      businessType: "Retail Food Stall",
      targetMarket: "College Students",
      estimatedScale: "Small",
      location: "Jhansi, Uttar Pradesh",
      requiredResources: [
        "Small shop space",
        "Tea equipment",
        "Initial inventory",
        "Supplier connections",
      ],
    },
    analytics: {
      viabilityNarrative:
        "Your tea stall idea has good potential near a college.",
      costBreakdown: [],
      riskScenarios: [],
      marketInsights:
        "College students are ideal customers with strong repeat demand.",
      estimatedTimeline: "2-3 weeks to setup",
    },
  };
}

/* ============================================================================
   Roadmap Generator (Mock)
============================================================================ */

export async function generateRoadmap(
  profile: BusinessProfile
): Promise<RoadmapStep[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      stepNumber: 1,
      title: "Find the Right Location",
      description: "Look for a small space near the college gate.",
      requiredResources: ["Visit locations", "Talk to property owners"],
      estimatedTime: "1 week",
      priority: "high",
    },
  ];
}

/* ============================================================================
   Opportunity Generator (AWS Lambda API)
============================================================================ */

export async function getOpportunities(
  profile: BusinessProfile
): Promise<Opportunity[]> {

  try {

    console.log("Calling Opportunities API:",
      "https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/opportunities"
    );

    const response = await fetch(
      "https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/opportunities",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          profile: {
            businessType: profile.businessType,
            location: profile.location,
            targetMarket: profile.targetMarket,
          }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Opportunity API HTTP Error:", response.status, err);
      return [];
    }

    const data = await response.json();

    console.log("Opportunities generated:", data);

    if (!data.opportunities) return [];

    return data.opportunities.map((text: string, index: number) => ({
      title: `Opportunity ${index + 1}`,
      description: text,
      relevanceScore: 0.8,
      timing: "Near term",
      actionRequired: "Review and implement this opportunity"
    }));

  } catch (error) {

    console.error("Opportunity API failed:", error);

    return [];
  }
}