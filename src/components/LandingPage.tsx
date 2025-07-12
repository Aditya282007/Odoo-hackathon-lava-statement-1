import React from 'react';
import { Users, ArrowRight, Sparkles, Trophy, MessageCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-8">
            <div className="p-4 bg-white rounded-full shadow-2xl">
              <Users className="w-16 h-16 text-black" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Skill<span className="text-gray-300">Swap</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with others to exchange skills and knowledge. Learn something new while teaching what you know best.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center space-x-2 text-gray-400">
              <Sparkles className="w-5 h-5" />
              <span>AI-Powered Recommendations</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Trophy className="w-5 h-5" />
              <span>XP & Badge System</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <MessageCircle className="w-5 h-5" />
              <span>Real-time Chat</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onGetStarted}
          className="group bg-white text-black px-12 py-4 rounded-full text-xl font-semibold hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 hover:scale-105 flex items-center space-x-3 mx-auto"
        >
          <span>Get Started</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
        </button>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-gray-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse delay-500"></div>
        <div className="absolute bottom-20 right-10 w-4 h-4 bg-gray-300 rounded-full opacity-30 animate-pulse delay-700"></div>
      </div>
    </div>
  );
};

export default LandingPage;