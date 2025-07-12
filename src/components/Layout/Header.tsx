import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bell, User, LogOut, Menu, Sun, Moon } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-40 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md border-b border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-br from-light-accent to-blue-600 dark:from-dark-accent dark:to-blue-400 rounded-lg"></div>
            <span className="font-semibold text-lg">SkillSync</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          
          <button className="relative p-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                JD
              </div>
              <span className="hidden sm:block text-sm font-medium">John Doe</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;