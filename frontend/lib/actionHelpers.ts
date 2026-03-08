// Action Helper System - Maps roadmap steps to actionable AI-powered tools

export interface ActionHelper {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'poster' | 'video' | 'pitch' | 'document' | 'calculator';
  icon: string;
  prompt: string; // AI prompt template
}

// Keywords that trigger specific helpers
const helperKeywords: Record<string, ActionHelper[]> = {
  // Marketing & Communication
  'message|whatsapp|contact|reach|communicate|announce': [
    {
      id: 'whatsapp-message',
      title: 'WhatsApp Message Creator',
      description: 'Generate professional messages for customers, suppliers, or partners',
      type: 'message',
      icon: '💬',
      prompt: 'Create a professional WhatsApp message for {context}. Keep it friendly, clear, and action-oriented. Include greeting and call-to-action.'
    }
  ],
  
  // Visual Content
  'poster|flyer|banner|advertise|promote|social': [
    {
      id: 'poster-generator',
      title: 'Poster Content Generator',
      description: 'Create poster text and design suggestions',
      type: 'poster',
      icon: '🎨',
      prompt: 'Create poster content for {context}. Include: catchy headline, key benefits (3-4 points), contact details placeholder, and design color suggestions.'
    }
  ],
  
  // Video & Pitch
  'video|pitch|explain|present|demo': [
    {
      id: 'video-script',
      title: 'Video Script Creator',
      description: 'Generate video script or pitch deck content',
      type: 'video',
      icon: '🎥',
      prompt: 'Create a 60-90 second video script for {context}. Include: hook (5 sec), problem (15 sec), solution (30 sec), benefits (20 sec), call-to-action (10 sec).'
    },
    {
      id: 'pitch-deck',
      title: 'Pitch Deck Helper',
      description: 'Create pitch deck talking points',
      type: 'pitch',
      icon: '📊',
      prompt: 'Create pitch deck content for {context}. Include: problem statement, solution, market opportunity, business model, ask/next steps.'
    }
  ],
  
  // Documentation
  'license|permit|registration|legal|document|application': [
    {
      id: 'document-helper',
      title: 'Document Checklist',
      description: 'Get required documents and application tips',
      type: 'document',
      icon: '📋',
      prompt: 'List required documents and step-by-step process for {context}. Include: documents needed, where to apply, typical timeline, costs, and common mistakes to avoid.'
    }
  ],
  
  // Financial Planning
  'budget|cost|price|invest|loan|finance': [
    {
      id: 'budget-calculator',
      title: 'Budget Breakdown',
      description: 'Calculate costs and create budget plan',
      type: 'calculator',
      icon: '💰',
      prompt: 'Create detailed budget breakdown for {context}. Include: one-time costs, monthly recurring costs, hidden costs to consider, and cost-saving tips.'
    }
  ],
  
  // Menu & Product Planning
  'menu|product|service|offer|price': [
    {
      id: 'menu-creator',
      title: 'Menu/Product Planner',
      description: 'Design your menu or product list',
      type: 'document',
      icon: '📋',
      prompt: 'Create menu/product suggestions for {context}. Include: popular items, pricing strategy, seasonal specials, and upsell opportunities.'
    }
  ],
  
  // Location & Setup
  'location|shop|space|rent|find': [
    {
      id: 'location-checklist',
      title: 'Location Checklist',
      description: 'What to look for when choosing location',
      type: 'document',
      icon: '📍',
      prompt: 'Create location selection checklist for {context}. Include: must-have features, red flags to avoid, questions to ask landlord, and negotiation tips.'
    }
  ],
  
  // Supplier & Partner
  'supplier|vendor|partner|source': [
    {
      id: 'supplier-message',
      title: 'Supplier Inquiry Message',
      description: 'Professional message to contact suppliers',
      type: 'message',
      icon: '🤝',
      prompt: 'Create professional supplier inquiry message for {context}. Include: introduction, requirements, quantity/frequency, quality expectations, and request for quotation.'
    }
  ]
};

// Get relevant helpers for a roadmap step
export function getActionHelpers(stepTitle: string, stepDescription: string = ''): ActionHelper[] {
  const text = `${stepTitle} ${stepDescription}`.toLowerCase();
  const helpers: ActionHelper[] = [];
  const addedIds = new Set<string>();
  
  // Check each keyword pattern
  for (const [pattern, helperList] of Object.entries(helperKeywords)) {
    const keywords = pattern.split('|');
    const hasMatch = keywords.some(keyword => text.includes(keyword));
    
    if (hasMatch) {
      helperList.forEach(helper => {
        if (!addedIds.has(helper.id)) {
          helpers.push(helper);
          addedIds.add(helper.id);
        }
      });
    }
  }
  
  // If no specific helpers found, add a generic "Content Creator" helper
  if (helpers.length === 0) {
    helpers.push({
      id: 'generic-helper',
      title: 'Content Creator',
      description: 'Get AI help for this step',
      type: 'document',
      icon: '✨',
      prompt: 'Help me with {context}. Provide practical, actionable advice including: what to do, resources needed, timeline, and tips for success.'
    });
  }
  
  // Limit to top 2 most relevant helpers per step
  return helpers.slice(0, 2);
}

// Generate AI content using the helper
export async function generateHelperContent(
  helper: ActionHelper,
  context: string,
  businessIdea: string,
  language: string = 'english'
): Promise<string> {
  try {
    const prompt = helper.prompt.replace('{context}', context);
    const fullPrompt = `Business Context: ${businessIdea}\n\nTask: ${prompt}\n\nLanguage: Generate response in ${language}. Keep it simple, practical, and actionable for first-time entrepreneurs.`;
    
    const response = await fetch('https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: fullPrompt })
    });
    
    if (!response.ok) throw new Error('Failed to generate content');
    
    const data = await response.json();
    return data.response || 'Unable to generate content. Please try again.';
  } catch (error) {
    console.error('Error generating helper content:', error);
    return 'Unable to generate content at this time. Please try again later.';
  }
}
