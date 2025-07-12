import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, MessageCircle, Flag } from 'lucide-react';

interface User {
  id: number;
  name: string;
  avatar: string;
  skills: string[];
  xp: number;
  level: number;
  badges: string[];
  isOnline: boolean;
  rating: number;
}

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border hover:shadow-medium dark:hover:border-dark-accent/30 transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-lg font-semibold text-white">
              {user.avatar}
            </div>
            {user.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-light-surface dark:border-dark-surface rounded-full"></div>
            )}
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-light-text-muted dark:text-dark-text-muted">{user.rating}</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/report/${user.id}`)}
          className="p-1 text-light-text-muted dark:text-dark-text-muted hover:text-light-text-secondary dark:hover:text-dark-text-secondary transition-colors"
        >
          <Flag className="w-4 h-4" />
        </button>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {user.skills.slice(0, 3).map(skill => (
            <span
              key={skill}
              className="px-3 py-1 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent text-xs font-medium rounded-lg"
            >
              {skill}
            </span>
          ))}
          {user.skills.length > 3 && (
            <span className="px-3 py-1 text-light-text-muted dark:text-dark-text-muted text-xs">
              +{user.skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* XP and Level */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-light-text-muted dark:text-dark-text-muted">Level {user.level}</span>
          <span className="text-sm text-light-text-muted dark:text-dark-text-muted">{user.xp.toLocaleString()} XP</span>
        </div>
        <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-light-accent to-blue-600 dark:from-dark-accent dark:to-blue-400 h-full transition-all duration-500 rounded-full"
            style={{ width: `${Math.min((user.xp % 1000) / 10, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-6">
        <div className="flex gap-1">
          {user.badges.map((badge, index) => (
            <span key={index} className="text-lg">{badge}</span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-xl hover:opacity-90 transition-all">
          <Send className="w-4 h-4" />
          <span className="text-sm font-medium">Collaborate</span>
        </button>
        <button
          onClick={() => navigate(`/chat/${user.id}`)}
          className="px-3 py-2 bg-light-border/50 dark:bg-dark-border/50 rounded-xl hover:bg-light-border dark:hover:bg-dark-border transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default UserCard;