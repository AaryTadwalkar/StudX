// types.ts - Complete type definitions

export type AppState = 
  | 'loading'
  | 'auth'
  | 'otp'
  | 'landing'
  | 'home'
  | 'marketplace'
  | 'startups'
  | 'skills'
  | 'wishlist'
  | 'cart'
  | 'messages'
  | 'my-skills'
  | 'add-skill'
  | 'my-account'
  | 'my-orders'
  | 'premium';

export interface User {
  _id?: string;        // MongoDB ID (optional for frontend creation)
  name: string;
  email: string;
  phone: string;
  branch: string;
  year: string;
  prn: string;
  regNo?: string;      // Optional registration number
  isVerified?: boolean;
}

export interface MarketplaceItem {
  id: string;
  name: string;
  price: number;
  category: string;
  condition: string;
  image: string;
  description: string;
  seller: string;
  sellerId?: string;   // MongoDB user ID of seller
  location: string;
  rating: number;
  createdAt?: Date;
}

export interface SkillExchange {
  id: string;
  title: string;
  offering: string;
  seeking: string;
  category: string;
  description: string;
  name: string;
  userId?: string;     // MongoDB user ID
  year: string;
  branch: string;
  image?: string;
}

export interface Startup {
  id: string;
  name: string;
  tagline: string;
  founder: string;
  founderId?: string;  // MongoDB user ID
  image: string;
  followers: number;
  products: number;
  isTrending: boolean;
  category: string;
  description: string;
}

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
  messages: Message[];
}
