import React from 'react';
import { User, MessageSquare, Settings, Search, Users, RefreshCw, MessageCircle, Bot } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewType } from '../types';

const Header: React.FC = () => {
  const { currentUser, currentView, setCurrentView, chatRooms } = useApp();

  const totalUnreadMessages = chatRooms.reduce((total, room) => {
    return total + (room.participants.includes(currentUser?.id || '') ? room.unreadCount : 0);
  }, 0);

  const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    { view: 'browse', label: 'Browse', icon: <Search className="w-4 h-4" /> },
    { view: 'ai-assistant', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { view: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { view: 'swaps', label: 'Swaps', icon: <RefreshCw className="w-4 h-4" /> },
  ];

  if (currentUser) {
    navItems.push({ 
      view: 'chat', 
      label: 'Chat', 
      icon: (
        <div className="relative">
          <MessageCircle className="w-4 h-4" />
          {totalUnreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalUnreadMessages > 9 ? '9+' : totalUnreadMessages}
            </span>
          )}
        </div>
      )
    });
  }

  if (currentUser?.isAdmin) {
    navItems.push({ view: 'admin', label: 'Admin', icon: <Settings className="w-4 h-4" /> });
  }

  return (
    <header className="bg-black shadow-lg border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Users className="w-8 h-8 text-white" />
            <h1 className="text-xl font-bold text-white">SkillSwap</h1>
          </div>

          <nav className="flex space-x-1">
            {navItems.map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  currentView === view
                    ? 'bg-white text-black rounded-full'
                    : 'text-gray-300 hover:text-white hover:bg-gray-900 rounded-full'
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {currentUser && (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-300">{currentUser.name}</span>
                {currentUser.profilePhoto && (
                  <img
                    src={currentUser.profilePhoto}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;