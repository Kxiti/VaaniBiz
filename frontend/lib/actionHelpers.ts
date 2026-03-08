// Action Helper System - Maps roadmap steps to actionable AI-powered tools

export interface ActionHelper {
  id: string;
  title: string;
  description: string;
  type: 'message' | 'poster' | 'video' | 'pitch' | 'document' | 'calculator' | 'logo' | 'image' | 'location' | 'email' | 'reels' | 'caption' | 'name' | 'script' | 'thumbnail';
  icon: string;
  prompt: string; // AI prompt template
}

// Keywords that trigger specific helpers
const helperKeywords: Record<string, ActionHelper[]> = {
  // Marketing & Communication
  'message|whatsapp|contact|reach|communicate|announce|customer': [
    {
      id: 'whatsapp-message',
      title: 'WhatsApp Creator',
      description: 'Generate professional messages for customers and partners',
      type: 'message',
      icon: '💬',
      prompt: 'Create 3 professional WhatsApp message templates for {context}. Include a launch announcement, a special offer, and a follow-up message. Use emojis and a friendly Indian tone.'
    }
  ],

  'thumbnail|cover|preview|youtube|video|header': [
    {
      id: 'thumbnail-creator',
      title: 'Thumbnail Designer',
      description: 'Create eye-catching thumbnails for videos and posts',
      type: 'thumbnail',
      icon: '🖼️',
      prompt: 'Generate 3 high-click-through thumbnail concepts for {context}. Include: 1. Main Text (Big & Bold), 2. Supporting Image/Icon Description, 3. Background Color Scheme, 4. A "Hook" element to make people click. Make it relevant to this business.'
    }
  ],

  'email|writing|contact|reach|professional|inquiry|proposal': [
    {
      id: 'email-creator',
      title: 'Email Creator',
      description: 'Professional email drafts for your business',
      type: 'email',
      icon: '📧',
      prompt: 'Write a professional email for {context}. Include a catchy subject line, formal greeting, clear body text, and a professional sign-off. Suitable for Indian B2B or B2C context.'
    }
  ],

  // Visual Content & Branding
  'poster|flyer|banner|advertise|promote|social|marketing': [
    {
      id: 'poster-generator',
      title: 'Poster Designer',
      description: 'Create text and design ideas for posters',
      type: 'poster',
      icon: '🎨',
      prompt: 'Create professional poster content for {context}. Include: Catchy headline (in English & Hindi), 3 key benefits, a strong call-to-action, and suggested color palette for a local Indian market.'
    }
  ],

  'logo|brand|name|identity|design|naming': [
    {
      id: 'logo-concept',
      title: 'Logo Creator',
      description: 'Get logo ideas and design direction',
      type: 'logo',
      icon: '🎯',
      prompt: 'Create 3 distinct logo concept ideas for {context}. Describe symbols, typography, and specific hex color codes. Mention how it connects to Indian culture or modern business values.'
    },
    {
      id: 'brand-name',
      title: 'Name Creator',
      description: 'Catchy and memorable business names',
      type: 'name',
      icon: '✨',
      prompt: 'Suggest 15 creative brand names for {context}. Include modern English names, Hindi-based names, and "Hinglish" combinations. Explain the meaning behind each name.'
    }
  ],

  'social|instagram|facebook|reel|video|youtube|content|digital': [
    {
      id: 'reel-ideas',
      title: 'Reel Ideas',
      description: 'Viral content ideas for Instagram & YouTube',
      type: 'reels',
      icon: '🎬',
      prompt: 'Generate 5 viral Reel/Shorts ideas for {context}. For each idea, provide a "Hook" (first 3 seconds), the "Value/Story", and a "Call to Action". Focus on trending Indian audio styles.'
    },
    {
      id: 'caption-generator',
      title: 'Caption Creator',
      description: 'Ready-to-use social media captions',
      type: 'caption',
      icon: '📌',
      prompt: 'Write 5 catchy social media captions for {context}. Include a mix of short/punchy, story-based, and educational styles. Add 10 relevant hashtags for the Indian market.'
    },
    {
      id: 'video-script',
      title: 'Script Creator',
      description: 'Scripts for videos, ads, or pitches',
      type: 'script',
      icon: '🎥',
      prompt: 'Write a detailed 60-second video script for {context}. Include timestamps, what to say, and what to show on screen (Visuals). Add background music mood suggestions.'
    }
  ],

  // Visual Assets
  'image|photo|picture|visual|graphics|capture': [
    {
      id: 'image-guide',
      title: 'Image Planner',
      description: 'Professional photo ideas for your shop/product',
      type: 'image',
      icon: '📸',
      prompt: 'List 10 essential photos you need for {context}. Describe the angle, lighting, and what should be in the frame. These are for your Google Business profile and Social Media.'
    }
  ],

  // Documentation & Legal
  'license|permit|registration|legal|document|application|fssai|gst': [
    {
      id: 'document-helper',
      title: 'Doc Checklist',
      description: 'Required documents and registration process',
      type: 'document',
      icon: '📋',
      prompt: 'List all specific licenses and documents needed for {context} in India. Include websites to apply, estimated fees in INR, and common pitfalls to avoid.'
    }
  ],

  // Financial Planning
  'budget|cost|price|invest|loan|finance|capital|money': [
    {
      id: 'budget-calculator',
      title: 'Budget Planner',
      description: 'Breakdown of your startup and running costs',
      type: 'calculator',
      icon: '💰',
      prompt: 'Create a detailed budget breakdown for {context} in Indian Rupees. Include one-time setup costs, monthly recurring costs, and a "Safety Buffer" amount. Provide tips to save money initially.'
    }
  ],

  // Menu & Product Planning
  'menu|product|service|offer|price|catalog|list': [
    {
      id: 'menu-creator',
      title: 'Product/Menu Planner',
      description: 'Design your product line or service list',
      type: 'document',
      icon: '📋',
      prompt: 'Create a list of 10 best-selling products or services for {context}. Suggest pricing, descriptions that sell, and combo-offer ideas to increase profit.'
    }
  ],

  // Location & Setup
  'location|shop|space|rent|find|area|place': [
    {
      id: 'location-finder',
      title: 'Location Scout',
      description: 'Expert guide to finding the best spot',
      type: 'location',
      icon: '📍',
      prompt: 'Create a guide for finding the best location for {context}. Mention what foot traffic to look for, rent negotiation tactics in India, and 5 "Red Flags" to avoid in a property.'
    }
  ],

  // Supplier & Partner
  'supplier|vendor|partner|source|wholesale': [
    {
      id: 'supplier-message',
      title: 'Supplier Outreach',
      description: 'Professional message to contact wholesalers',
      type: 'message',
      icon: '🤝',
      prompt: 'Write a professional message to approach suppliers for {context}. Include questions about MOQ (Minimum Order Quantity), credit terms, and sample requests. Suitable for B2B Indian market.'
    }
  ],

  // Hiring & Team
  'hire|staff|employee|team|recruit': [
    {
      id: 'job-post',
      title: 'Job Post Creator',
      description: 'Professional job descriptions to find staff',
      type: 'document',
      icon: '👔',
      prompt: 'Create a compelling job post for {context}. Include key responsibilities, qualifications needed, a realistic Indian salary range, and 5 "Interview Questions" to ask candidates.'
    }
  ]
};

// Get relevant helpers for a roadmap step
export function getActionHelpers(stepTitle: string, stepDescription: string = ''): ActionHelper[] {
  const text = `${stepTitle} ${stepDescription}`.toLowerCase();
  const helpers: ActionHelper[] = [];
  const addedIds = new Set<string>();

  // 1. First priority: Check each keyword pattern for specific matches
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

  // 2. Second priority: If we have fewer than 3 helpers, add highly relevant "Creator" tools based on stage
  const stage = text.includes('step 1') || text.includes('initial') || text.includes('research') ? 'early' :
    text.includes('launch') || text.includes('open') || text.includes('marketing') ? 'launch' : 'growth';

  if (helpers.length < 3) {
    const creators: Record<string, ActionHelper[]> = {
      early: [
        { id: 'brand-name-extra', title: 'Name Creator', description: 'Find the perfect name', type: 'name', icon: '✨', prompt: 'Suggest 10 unique names for {context}...' },
        { id: 'logo-extra', title: 'Logo Ideas', description: 'Visual identity direction', type: 'logo', icon: '🎨', prompt: 'Create logo concepts for {context}...' }
      ],
      launch: [
        { id: 'reels-extra', title: 'Reel Ideas', description: 'Viral video concepts', type: 'reels', icon: '🎬', prompt: '5 Reel ideas for {context}...' },
        { id: 'whatsapp-extra', title: 'WhatsApp Creator', description: 'Launch messages', type: 'message', icon: '💬', prompt: 'Write launch messages for {context}...' }
      ],
      growth: [
        { id: 'email-extra', title: 'Email Creator', description: 'Customer retention', type: 'email', icon: '📧', prompt: 'Write a professional email for {context}...' },
        { id: 'caption-extra', title: 'Caption Creator', description: 'Social media growth', type: 'caption', icon: '📌', prompt: 'Write 5 captions for {context}...' }
      ]
    };

    creators[stage].forEach(h => {
      if (!addedIds.has(h.id) && helpers.length < 3) {
        helpers.push(h);
        addedIds.add(h.id);
      }
    });
  }

  // 3. Last fallback: Generic helper
  if (helpers.length === 0) {
    helpers.push({
      id: 'generic-helper',
      title: 'Step Assistant',
      description: 'Expert guidance for this step',
      type: 'document',
      icon: '✨',
      prompt: 'Help me with {context}. Provide practical, actionable advice including: what to do, resources needed, timeline, tips for success, and common mistakes to avoid.'
    });
  }

  return helpers.slice(0, 3);
}

// Generate AI content using the helper
export async function generateHelperContent(
  helper: ActionHelper,
  context: string,
  businessIdea: string,
  language: string = 'english'
): Promise<string> {
  try {
    // Replace {context} with the actual step context
    const specificPrompt = helper.prompt.replace('{context}', context);

    // Build a detailed prompt that includes helper type and specific instructions
    const fullPrompt = `You are helping a first-time entrepreneur in India with their business.

Business Idea: ${businessIdea}

Current Step: ${context}

Task Type: ${helper.title}
Instructions: ${specificPrompt}

IMPORTANT: 
- Be specific to the task type "${helper.title}"
- Provide actionable, practical advice
- Use simple language suitable for first-time entrepreneurs
- Include Indian market context where relevant
- Format the response clearly with sections/bullet points
- Language: ${language}

Generate the content now:`;

    console.log('🔥 Generating content for:', helper.title);
    console.log('📝 Prompt:', fullPrompt.substring(0, 200) + '...');

    const response = await fetch('https://pdiu3hy1ue.execute-api.eu-north-1.amazonaws.com/prod/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: fullPrompt })
    });

    if (!response.ok) {
      console.error('❌ API Error:', response.status, response.statusText);
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    console.log('✅ Content generated successfully');
    return data.response || 'Unable to generate content. Please try again.';
  } catch (error) {
    console.error('❌ Error generating helper content:', error);
    return 'Unable to generate content at this time. Please try again later.';
  }
}
