export interface SocialData {
  id: string;
  platform: string;
  content: string;
  author: string;
  likes: number;
  comments: number;
  timestamp: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  relevance: number;
  imageUrl?: string;
} 