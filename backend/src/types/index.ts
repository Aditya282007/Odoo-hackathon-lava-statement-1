import { Request } from 'express';
import { Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  photo?: string;
  skills: string[];
  bio?: string;
  isPublic: boolean;
  xp: number;
  badge: string;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IRequest extends Document {
  from: string;
  to: string;
  status: 'pending' | 'accepted' | 'rejected';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChat extends Document {
  from: string;
  to: string;
  message: string;
  timestamp: Date;
  read: boolean;
  edited: boolean;
  editedAt?: Date;
  markAsRead(): Promise<IChat>;
}

export interface IReport extends Document {
  fromUser: string;
  toUser: string;
  reason: string;
  message: string;
  timestamp: Date;
  status: 'pending' | 'reviewed' | 'resolved';
  reviewedBy?: string;
  reviewedAt?: Date;
  resolution?: string;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface JWTPayload {
  id: string;
  email: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchFilters {
  skills?: string[];
  name?: string;
  minXp?: number;
  maxXp?: number;
  badge?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  xp: number;
  level: number;
  badge: string;
  collaborations: number;
  requestsSent: number;
  requestsReceived: number;
  skillsCount: number;
  joinedDate: Date;
  profileViews: number;
  successRate: number;
}