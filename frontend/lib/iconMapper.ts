// Smart icon mapping based on keywords in roadmap steps

export interface StepIcon {
  emoji: string;
  color: string;
  bgColor: string;
}

const iconKeywords: Record<string, StepIcon> = {
  // Location & Space
  location: { emoji: '📍', color: 'text-red-600', bgColor: 'bg-red-50' },
  place: { emoji: '🏪', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  shop: { emoji: '🏪', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  space: { emoji: '🏢', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  rent: { emoji: '🏠', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  building: { emoji: '🏗️', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  
  // Equipment & Resources
  equipment: { emoji: '⚙️', color: 'text-gray-700', bgColor: 'bg-gray-50' },
  tools: { emoji: '🔧', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  machine: { emoji: '🏭', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  buy: { emoji: '🛒', color: 'text-green-600', bgColor: 'bg-green-50' },
  purchase: { emoji: '💳', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  inventory: { emoji: '📦', color: 'text-amber-600', bgColor: 'bg-amber-50' },
  
  // Suppliers & Partners
  supplier: { emoji: '🤝', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  vendor: { emoji: '👥', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  partner: { emoji: '🤝', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  contact: { emoji: '📞', color: 'text-green-600', bgColor: 'bg-green-50' },
  
  // Legal & Documentation
  license: { emoji: '📜', color: 'text-amber-700', bgColor: 'bg-amber-50' },
  permit: { emoji: '✅', color: 'text-green-600', bgColor: 'bg-green-50' },
  registration: { emoji: '📋', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  legal: { emoji: '⚖️', color: 'text-gray-700', bgColor: 'bg-gray-50' },
  document: { emoji: '📄', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  
  // Marketing & Branding
  marketing: { emoji: '📢', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  brand: { emoji: '🎨', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  logo: { emoji: '🎨', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  advertise: { emoji: '📣', color: 'text-red-600', bgColor: 'bg-red-50' },
  social: { emoji: '📱', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  
  // Menu & Products
  menu: { emoji: '📋', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  product: { emoji: '📦', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  service: { emoji: '💼', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  price: { emoji: '💰', color: 'text-green-600', bgColor: 'bg-green-50' },
  
  // Launch & Operations
  launch: { emoji: '🚀', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  open: { emoji: '🎉', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  start: { emoji: '▶️', color: 'text-green-600', bgColor: 'bg-green-50' },
  operate: { emoji: '⚡', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  
  // Finance & Money
  money: { emoji: '💵', color: 'text-green-600', bgColor: 'bg-green-50' },
  budget: { emoji: '💰', color: 'text-green-700', bgColor: 'bg-green-50' },
  cost: { emoji: '💸', color: 'text-red-600', bgColor: 'bg-red-50' },
  invest: { emoji: '💎', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  loan: { emoji: '🏦', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  
  // Training & Learning
  train: { emoji: '📚', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  learn: { emoji: '🎓', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  skill: { emoji: '💪', color: 'text-orange-600', bgColor: 'bg-orange-50' },
  
  // Team & Hiring
  hire: { emoji: '👔', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  staff: { emoji: '👥', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  team: { emoji: '🤝', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  employee: { emoji: '👨‍💼', color: 'text-gray-600', bgColor: 'bg-gray-50' },
  
  // Technology & Digital
  website: { emoji: '🌐', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  app: { emoji: '📱', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  online: { emoji: '💻', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  digital: { emoji: '📲', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  
  // Quality & Testing
  test: { emoji: '🧪', color: 'text-purple-600', bgColor: 'bg-purple-50' },
  quality: { emoji: '⭐', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  improve: { emoji: '📈', color: 'text-green-600', bgColor: 'bg-green-50' },
  
  // Customer & Sales
  customer: { emoji: '👥', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  client: { emoji: '🤝', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  sale: { emoji: '💰', color: 'text-green-600', bgColor: 'bg-green-50' },
  
  // Default fallback
  default: { emoji: '✨', color: 'text-primary', bgColor: 'bg-primary/10' },
};

export function getStepIcon(stepTitle: string, stepDescription: string = ''): StepIcon {
  const text = `${stepTitle} ${stepDescription}`.toLowerCase();
  
  // Check each keyword
  for (const [keyword, icon] of Object.entries(iconKeywords)) {
    if (keyword !== 'default' && text.includes(keyword)) {
      return icon;
    }
  }
  
  // Return default if no match
  return iconKeywords.default;
}

// Get icon for specific step numbers (fallback)
export function getStepIconByNumber(stepNumber: number): StepIcon {
  const numberIcons: Record<number, StepIcon> = {
    1: { emoji: '🎯', color: 'text-red-600', bgColor: 'bg-red-50' },
    2: { emoji: '🛠️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    3: { emoji: '🤝', color: 'text-green-600', bgColor: 'bg-green-50' },
    4: { emoji: '📋', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    5: { emoji: '🚀', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    6: { emoji: '📈', color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    7: { emoji: '⭐', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    8: { emoji: '🎉', color: 'text-pink-600', bgColor: 'bg-pink-50' },
  };
  
  return numberIcons[stepNumber] || iconKeywords.default;
}

// Get contextual illustrations for sections
export function getSectionIllustration(sectionType: string): string {
  const illustrations: Record<string, string> = {
    timeline: '⏰',
    priority: '🔥',
    cost: '💰',
    resources: '📦',
    success: '✅',
    warning: '⚠️',
    tip: '💡',
    note: '📝',
  };
  
  return illustrations[sectionType.toLowerCase()] || '📌';
}
