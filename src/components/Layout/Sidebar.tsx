import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  User, 
  Users, 
  MessageCircle, 
  FileText,
  Shield,
  Sparkles
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Discover', path: '/home' },
    { icon: User, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Requests', path: '/requests' },
    { icon: MessageCircle, label: 'Messages', path: '/chat/0' },
    { icon: FileText, label: 'Reports', path: '/report/0' },
    { icon: Shield, label: 'Admin', path: '/admin' },
  ];

  return (
    <aside className="fixed left-0 top-0 z-30 w-64 h-screen bg-light-surface dark:bg-dark-surface border-r border-light-border dark:border-dark-border transform -translate-x-full lg:translate-x-0 transition-transform duration-300">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-light-border dark:border-dark-border">
        <div className="w-8 h-8 bg-gradient-to-br from-light-accent to-blue-600 dark:from-dark-accent dark:to-blue-400 rounded-lg"></div>
        <span className="text-xl font-semibold">SkillSync</span>
      </div>
      
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent'
                      : 'hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* AI Suggestions Panel */}
      <div className="mt-8 mx-4 p-4 bg-light-border/30 dark:bg-dark-border/30 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-light-accent dark:text-dark-accent" />
          <span className="text-sm font-semibold">AI Suggestions</span>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 cursor-pointer transition-colors">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                U{i}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User {i}</p>
                <p className="text-xs text-light-text-muted dark:text-dark-text-muted">React • Node.js</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-light-text-muted dark:text-dark-text-muted mt-3">
          AI-powered recommendations
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;