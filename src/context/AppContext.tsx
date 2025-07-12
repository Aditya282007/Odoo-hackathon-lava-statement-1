import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, SwapRequest, Review, AdminMessage, ViewType, ChatMessage, ChatRoom, Badge } from '../types';
import { awardXp, XP_REWARDS } from '../utils/xpSystem';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  reviews: Review[];
  adminMessages: AdminMessage[];
  chatMessages: ChatMessage[];
  chatRooms: ChatRoom[];
  currentView: ViewType;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  setSwapRequests: (requests: SwapRequest[]) => void;
  setReviews: (reviews: Review[]) => void;
  setAdminMessages: (messages: AdminMessage[]) => void;
  setChatMessages: (messages: ChatMessage[]) => void;
  setChatRooms: (rooms: ChatRoom[]) => void;
  setCurrentView: (view: ViewType) => void;
  addSwapRequest: (request: SwapRequest) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  addReview: (review: Review) => void;
  banUser: (userId: string) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  awardUserXp: (userId: string, xpAmount: number, reason: string) => void;
  sendChatMessage: (swapRequestId: string, content: string) => void;
  markMessagesAsRead: (swapRequestId: string, userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [adminMessages, setAdminMessages] = useState<AdminMessage[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('browse');

  const addSwapRequest = (request: SwapRequest) => {
    setSwapRequests(prev => [...prev, request]);
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev => prev.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
    
    // Award XP when swap is completed
    if (updates.status === 'completed') {
      const request = swapRequests.find(req => req.id === id);
      if (request) {
        // Award XP to both users
        awardUserXp(request.fromUserId, XP_REWARDS.COMPLETE_SWAP, 'Completed skill swap');
        awardUserXp(request.toUserId, XP_REWARDS.COMPLETE_SWAP, 'Completed skill swap');
        
        // Update total swaps count
        updateUser(request.fromUserId, { totalSwaps: users.find(u => u.id === request.fromUserId)?.totalSwaps + 1 || 1 });
        updateUser(request.toUserId, { totalSwaps: users.find(u => u.id === request.toUserId)?.totalSwaps + 1 || 1 });
      }
    }
    
    // Create chat room when request is accepted
    if (updates.status === 'accepted') {
      const request = swapRequests.find(req => req.id === id);
      if (request) {
        const newChatRoom: ChatRoom = {
          id: `chat_${id}`,
          swapRequestId: id,
          participants: [request.fromUserId, request.toUserId],
          participantNames: [request.fromUserName, request.toUserName],
          unreadCount: 0,
        };
        setChatRooms(prev => [...prev, newChatRoom]);
      }
    }
  };

  const addReview = (review: Review) => {
    setReviews(prev => [...prev, review]);
    
    // Award XP based on review rating
    let xpReward = 0;
    if (review.rating === 5) xpReward = XP_REWARDS.RECEIVE_5_STAR_REVIEW;
    else if (review.rating === 4) xpReward = XP_REWARDS.RECEIVE_4_STAR_REVIEW;
    else if (review.rating === 3) xpReward = XP_REWARDS.RECEIVE_3_STAR_REVIEW;
    
    if (xpReward > 0) {
      awardUserXp(review.revieweeId, xpReward, `Received ${review.rating}-star review`);
    }
    
    // Update user rating
    const revieweeRating = reviews
      .filter(r => r.revieweeId === review.revieweeId)
      .reduce((sum, r) => sum + r.rating, review.rating) / 
      (reviews.filter(r => r.revieweeId === review.revieweeId).length + 1);
    
    updateUser(review.revieweeId, { rating: revieweeRating });
  };

  const banUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isBanned: true } : user
    ));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const awardUserXp = (userId: string, xpAmount: number, reason: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    const { newXp, newLevel, newBadges } = awardXp(user, xpAmount, reason);
    
    updateUser(userId, {
      xp: newXp,
      level: newLevel,
      badges: [...user.badges, ...newBadges],
    });
    
    // Show notification for level up or new badges (you can implement this)
    if (newLevel > user.level) {
      console.log(`${user.name} leveled up to level ${newLevel}!`);
    }
    if (newBadges.length > 0) {
      console.log(`${user.name} earned new badges:`, newBadges.map(b => b.name));
    }
  };

  const sendChatMessage = (swapRequestId: string, content: string) => {
    if (!currentUser) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      swapRequestId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    
    // Update chat room with last message
    setChatRooms(prev => prev.map(room => 
      room.swapRequestId === swapRequestId 
        ? { 
            ...room, 
            lastMessage: newMessage,
            unreadCount: room.unreadCount + 1
          }
        : room
    ));
  };

  const markMessagesAsRead = (swapRequestId: string, userId: string) => {
    setChatMessages(prev => prev.map(msg => 
      msg.swapRequestId === swapRequestId && msg.senderId !== userId
        ? { ...msg, isRead: true }
        : msg
    ));
    
    setChatRooms(prev => prev.map(room => 
      room.swapRequestId === swapRequestId
        ? { ...room, unreadCount: 0 }
        : room
    ));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      swapRequests,
      reviews,
      adminMessages,
      chatMessages,
      chatRooms,
      currentView,
      setCurrentUser,
      setUsers,
      setSwapRequests,
      setReviews,
      setAdminMessages,
      setChatMessages,
      setChatRooms,
      setCurrentView,
      addSwapRequest,
      updateSwapRequest,
      addReview,
      banUser,
      updateUser,
      awardUserXp,
      sendChatMessage,
      markMessagesAsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
};