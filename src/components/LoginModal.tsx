import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUsers } from '../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { setCurrentUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      // For demo purposes, find user by email
      const user = mockUsers.find(u => u.email === formData.email && u.password === formData.password);
      if (user && user.password === formData.password) {
        setCurrentUser(user);
        onClose();
      } else {
        alert('Invalid credentials. Try admin@gmail.com with password: admin123');
      }
    } else {
      // For demo purposes, create a new user
      const newUser = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        skillsOffered: [],
        skillsWanted: [],
        availability: [],
        isPublic: true,
        rating: 0,
        totalSwaps: 0,
        xp: 0,
        level: 1,
        badges: [],
        joinedDate: new Date().toISOString().split('T')[0],
      };
      setCurrentUser(newUser);
      onClose();
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-black rounded-3xl max-w-md w-full p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <User className="w-6 h-6 text-white" />
          <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full focus:ring-2 focus:ring-white focus:border-transparent text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-full focus:ring-2 focus:ring-white focus:border-transparent text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-black py-3 px-4 rounded-full hover:bg-gray-100 transition-colors font-medium shadow-lg"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-white hover:text-gray-300 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>


        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default LoginModal;