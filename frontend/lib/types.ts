export type Language = 
  | "hindi" 
  | "tamil" 
  | "telugu"
  | "marathi" 
  | "bengali"
  | "gujarati"
  | "kannada"
  | "malayalam"
  | "english";

export const LANGUAGE_CODES: Record<Language, string> = {
  hindi: "hi-IN",
  tamil: "ta-IN",
  telugu: "te-IN",
  marathi: "mr-IN",
  bengali: "bn-IN",
  gujarati: "gu-IN",
  kannada: "kn-IN",
  malayalam: "ml-IN",
  english: "en-IN",
};

export const LANGUAGE_NAMES: Record<Language, string> = {
  hindi: "हिंदी",
  tamil: "தமிழ்",
  telugu: "తెలుగు",
  marathi: "मराठी",
  bengali: "বাংলা",
  gujarati: "ગુજરાતી",
  kannada: "ಕನ್ನಡ",
  malayalam: "മലയാളം",
  english: "English",
};

export interface BusinessProfile {
  businessType: string;
  targetMarket: string;
  estimatedScale: string;
  location: string;
  requiredResources: string[];
}

export interface CostExplanation {
  category: string;
  amount: string;
  explanation: string;
  examples: string[];
}

export interface RiskNarrative {
  riskType: string;
  scenario: string;
  mitigation: string;
}

export interface AnalyticsOutput {
  viabilityNarrative: string;
  costBreakdown: CostExplanation[];
  riskScenarios: RiskNarrative[];
  marketInsights: string;
  estimatedTimeline: string;
}

export interface RoadmapStep {
  stepNumber: number;
  title: string;
  description: string;
  requiredResources: string[];
  estimatedTime: string;
  priority: "high" | "medium" | "low";
}

export interface Opportunity {
  title: string;
  description: string;
  relevanceScore: number;
  timing: string;
  actionRequired: string;
}

export interface ProcessingStage {
  id: string;
  label: string;
  completed: boolean;
}
