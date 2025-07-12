export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalSwaps: number;
  xp: number;
  level: number;
  badges: Badge[];
  joinedDate: string;
  isAdmin?: boolean;
  isBanned?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  xpRequired: number;
  earnedAt?: string;
}

export interface AIRecommendation {
  type: 'skill' | 'user';
  title: string;
  description: string;
  data: any;
  confidence: number;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  completedAt?: string;
  message?: string;
}

export interface Review {
  id: string;
  swapRequestId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerName: string;
  revieweeName: string;
  rating: number;
  comment: string;
  skillExchanged: string;
  createdAt: string;
}

export interface AdminMessage {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'maintenance';
  createdAt: string;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatRoom {
  id: string;
  swapRequestId: string;
  participants: string[];
  participantNames: string[];
  lastMessage?: ChatMessage;
  unreadCount: number;
}

export type ViewType = 'browse' | 'ai-assistant' | 'profile' | 'swaps' | 'admin' | 'chat';