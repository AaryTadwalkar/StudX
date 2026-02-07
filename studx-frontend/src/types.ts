// ================= APP STATE =================
export type AppState =
  | 'loading'
  | 'auth'
  | 'otp'
  | 'forgot-password'
  | 'landing'
  | 'home'
  | 'marketplace'
  | 'startups'
  | 'skills'
  | 'my-listings'
  | 'wishlist'
  | 'cart'
  | 'messages'
  | 'my-skills'
  | 'add-skill'
  | 'my-account'
  | 'my-orders'
  | 'premium';

// ================= USER =================
export interface User {
  name: string;
  email: string;
  branch: string;
  year: string;
  prn: string;
  phone: string;
}

// ================= MARKETPLACE =================
export interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: 'Like New' | 'Good' | 'Fair';
  image: string;
  description: string;
  seller: string;
  location: string;
  rating?: number;
}

// ================= STARTUPS =================
export interface Startup {
  id: string;
  name: string;
  tagline: string;
  founder: string;
  image: string;
  followers: number;
  products: number;
  isTrending: boolean;
  category: string;
  description?: string;
}

// ================= SKILLS =================
export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type VerificationType =
  | 'Verified (Intermediate)'
  | 'Verified (Basic)'
  | 'Self-declared'
  | 'Portfolio Verified';

export interface SkillExchange {
  id: string;
  user: string;
  offering: string;
  requesting: string;
  tags: string[];
  type: 'OFFERING' | 'REQUESTING';
  rating: number;
  exchangeValue?: string;
  description?: string;
  email?: string;
  phone?: string;
  category?: string;
  level?: SkillLevel;
  verificationBadge?: VerificationType;
}

// ================= CHAT =================
export interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  messages: Message[];
}
