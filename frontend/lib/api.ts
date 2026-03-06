import {
  BusinessProfile,
  AnalyticsOutput,
  RoadmapStep,
  Opportunity,
} from "./types";

// Mock API functions for demo purposes

export async function transcribeAudio(
  audioBlob: Blob,
  language: string
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Return mock transcription
  return "I want to open a small tea stall near my college in Jhansi. I have around 50,000 rupees to start.";
}

export async function analyzeBusiness(
  transcription: string,
  language: string
): Promise<{
  profile: BusinessProfile;
  analytics: AnalyticsOutput;
}> {
  // Simulate API delay
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
        "Your tea stall idea has good potential near a college. Students need affordable refreshments throughout the day. The location is perfect because students prefer quick, nearby options between classes. With 50,000 rupees, you can start small and grow gradually.",
      costBreakdown: [
        {
          category: "Initial Setup",
          amount: "₹25,000 - ₹30,000",
          explanation:
            "This covers your basic equipment and first month's rent",
          examples: [
            "Tea kettle and gas stove: ₹8,000",
            "Cups, glasses, and utensils: ₹5,000",
            "Small counter or cart: ₹7,000",
            "First month rent: ₹5,000",
          ],
        },
        {
          category: "Initial Inventory",
          amount: "₹10,000 - ₹15,000",
          explanation: "Stock for your first month of operation",
          examples: [
            "Tea, sugar, milk: ₹6,000",
            "Snacks (biscuits, samosas): ₹4,000",
            "Disposable items: ₹2,000",
          ],
        },
        {
          category: "Working Capital",
          amount: "₹5,000 - ₹10,000",
          explanation: "Emergency fund for unexpected expenses",
          examples: ["Repairs", "Extra supplies", "Slow business days"],
        },
      ],
      riskScenarios: [
        {
          riskType: "Competition",
          scenario:
            "There might be other tea stalls near the college. Students may already have favorite spots they visit regularly.",
          mitigation:
            "Offer something unique - maybe special flavors, better service, or loyalty discounts. Keep your prices student-friendly.",
        },
        {
          riskType: "Seasonal Variation",
          scenario:
            "During college holidays and exam periods, your sales will drop significantly. Summer vacation means almost no customers.",
          mitigation:
            "Save money during busy months. Consider serving nearby offices or residential areas during holidays.",
        },
      ],
      marketInsights:
        "College students are ideal customers - they visit daily, prefer affordable options, and spread word-of-mouth quickly. Peak hours are morning (8-10 AM) and evening (4-6 PM).",
      estimatedTimeline: "2-3 weeks to setup, 3-6 months to break even",
    },
  };
}

export async function generateRoadmap(
  profile: BusinessProfile
): Promise<RoadmapStep[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      stepNumber: 1,
      title: "Find the Right Location",
      description:
        "Look for a small space near the college gate or main entrance. The spot should have good foot traffic and be easily visible to students.",
      requiredResources: [
        "Visit 3-4 potential locations",
        "Talk to property owners",
        "Check college permissions if needed",
      ],
      estimatedTime: "1 week",
      priority: "high",
    },
    {
      stepNumber: 2,
      title: "Buy Essential Equipment",
      description:
        "Purchase a gas stove, large tea kettle, cups, glasses, and a small counter or cart. Buy quality items that will last.",
      requiredResources: [
        "Visit local kitchen equipment shops",
        "Budget: ₹15,000-20,000",
        "Get a cart with wheels for mobility",
      ],
      estimatedTime: "3-4 days",
      priority: "high",
    },
    {
      stepNumber: 3,
      title: "Find Reliable Suppliers",
      description:
        "Connect with local milk vendors, tea suppliers, and snack distributors. Negotiate good rates for regular supply.",
      requiredResources: [
        "Visit local wholesale market",
        "Get 2-3 supplier contacts",
        "Arrange daily milk delivery",
      ],
      estimatedTime: "3-4 days",
      priority: "high",
    },
    {
      stepNumber: 4,
      title: "Create Your Menu",
      description:
        "Start simple with regular tea, special masala tea, and basic snacks. Keep prices student-friendly (₹10-20 per item).",
      requiredResources: [
        "Decide on 4-5 items to start",
        "Calculate cost per item",
        "Print a simple menu board",
      ],
      estimatedTime: "2 days",
      priority: "medium",
    },
    {
      stepNumber: 5,
      title: "Start Your Business",
      description:
        "Open during peak college hours. Be friendly, maintain cleanliness, and ask for feedback. Build relationships with regular customers.",
      requiredResources: [
        "Wake up early for morning rush",
        "Keep your stall clean",
        "Offer first-week discounts",
      ],
      estimatedTime: "Ongoing",
      priority: "high",
    },
  ];
}

export async function getOpportunities(
  profile: BusinessProfile
): Promise<Opportunity[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      title: "Diwali Festival Opportunity",
      description:
        "Diwali is coming in 2 months. Students buy snacks and sweets for celebrations. This is a high-sales period.",
      relevanceScore: 0.9,
      timing: "Next 2 months",
      actionRequired:
        "Stock special snacks, sweets, and festive items. Offer Diwali combo deals. Decorate your stall with lights.",
    },
    {
      title: "Exam Season Strategy",
      description:
        "During exams, students study late and need tea and snacks. Night-time sales can increase significantly.",
      relevanceScore: 0.85,
      timing: "Exam months (Nov, Apr)",
      actionRequired:
        "Stay open later during exam weeks. Offer 'study combo' - tea with snacks at discount. Students will remember this.",
    },
    {
      title: "Monsoon Menu Addition",
      description:
        "Rainy season is perfect for hot snacks. Pakoras, samosas, and hot tea sell very well when it rains.",
      relevanceScore: 0.8,
      timing: "June - September",
      actionRequired:
        "Add fried snacks to your menu. Keep ingredients ready. Rainy days can be your best sales days.",
    },
  ];
}
