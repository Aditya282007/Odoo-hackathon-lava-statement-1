import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import Browse from './components/Browse';
import AIAssistant from './components/AIAssistant';
import Profile from './components/Profile';
import Swaps from './components/Swaps';
import Admin from './components/Admin';
import Chat from './components/Chat';
import LoginModal from './components/LoginModal';
import { mockUsers, mockSwapRequests, mockReviews, mockAdminMessages } from './data/mockData';

const AppContent: React.FC = () => {
  const { currentUser, currentView, setUsers, setSwapRequests, setReviews, setAdminMessages, setChatMessages, setChatRooms } = useApp();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    // Initialize with mock data
    setUsers(mockUsers);
    setSwapRequests(mockSwapRequests);
    setReviews(mockReviews);
    setAdminMessages(mockAdminMessages);
    setChatMessages([]);
    setChatRooms([]);
  }, [setUsers, setSwapRequests, setReviews, setAdminMessages, setChatMessages, setChatRooms]);

  // Show landing page if no user is logged in and landing hasn't been dismissed
  if (!currentUser && showLanding) {
    return (
      <>
        <LandingPage onGetStarted={() => {
          setShowLanding(false);
          setShowLoginModal(true);
        }} />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      </>
    );
  }

  const renderContent = () => {
    if (!currentUser) {
      return (
        <div className="text-center py-20 bg-black rounded-3xl border border-gray-800">
          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">Welcome to SkillSwap</h1>
            <p className="text-lg text-gray-300 mb-8">
              Connect with others to exchange skills and knowledge. Learn something new while teaching what you know best.
            </p>
            <button
              onClick={() => setShowLoginModal(true)}
              className="bg-white text-black px-8 py-3 rounded-full hover:bg-gray-100 transition-colors font-medium text-lg shadow-lg"
            >
              Get Started
            </button>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'browse':
        return <Browse />;
      case 'ai-assistant':
        return <AIAssistant />;
      case 'profile':
        return <Profile />;
      case 'swaps':
        return <Swaps />;
      case 'admin':
        return <Admin />;
      case 'chat':
        return <Chat />;
      default:
        return <Browse />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;