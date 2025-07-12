import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, Users, BookOpen, TrendingUp, Star, MessageSquare, Loader } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AIRecommendationService } from '../services/aiService';
import { AIRecommendation } from '../types';

const AIAssistant: React.FC = () => {
  const { currentUser, users, addSwapRequest } = useApp();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'skills' | 'users'>('skills');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: '',
  });

  const aiService = new AIRecommendationService();

  useEffect(() => {
    if (currentUser) {
      loadRecommendations();
    }
  }, [currentUser, activeTab]);

  const loadRecommendations = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      let recs: AIRecommendation[] = [];
      if (activeTab === 'skills') {
        recs = await aiService.getSkillRecommendations(currentUser, users);
      } else {
        recs = await aiService.getUserRecommendations(currentUser, users);
      }
      setRecommendations(recs);
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = () => {
    if (!currentUser || !selectedUser) return;

    const newRequest = {
      id: Date.now().toString(),
      fromUserId: currentUser.id,
      toUserId: selectedUser.id,
      fromUserName: currentUser.name,
      toUserName: selectedUser.name,
      skillOffered: requestData.skillOffered,
      skillWanted: requestData.skillWanted,
      status: 'pending' as const,
      createdAt: new Date().toISOString().split('T')[0],
      message: requestData.message,
    };

    addSwapRequest(newRequest);
    setShowRequestModal(false);
    setSelectedUser(null);
    setRequestData({ skillOffered: '', skillWanted: '', message: '' });
  };

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-400">Please sign in to access AI recommendations.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-white rounded-full">
            <Bot className="w-8 h-8 text-black" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Learning Assistant</h2>
            <p className="text-gray-300">Powered by Gemini AI - Personalized recommendations for your skill journey</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-gray-300">Your Level</span>
            </div>
            <p className="text-2xl font-bold text-white">{currentUser.level}</p>
            <p className="text-sm text-gray-400">{currentUser.xp} XP</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-gray-300">Skills Mastered</span>
            </div>
            <p className="text-2xl font-bold text-white">{currentUser.skillsOffered.length}</p>
          </div>
          
          <div className="bg-gray-800 bg-opacity-50 rounded-2xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-white" />
              <span className="text-sm font-medium text-gray-300">Badges Earned</span>
            </div>
            <p className="text-2xl font-bold text-white">{currentUser.badges.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'skills'
                ? 'bg-white text-black rounded-full'
                : 'text-gray-400 hover:text-white hover:bg-gray-900 rounded-full'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Skill Recommendations</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              activeTab === 'users'
                ? 'bg-white text-black rounded-full'
                : 'text-gray-400 hover:text-white hover:bg-gray-900 rounded-full'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Collaboration Suggestions</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 text-white mx-auto mb-4 animate-spin" />
            <p className="text-gray-400">AI is analyzing your profile...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No recommendations available at the moment.</p>
                <button
                  onClick={loadRecommendations}
                  className="mt-4 bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"
                >
                  Refresh Recommendations
                </button>
              </div>
            ) : (
              recommendations.map((rec, index) => (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 border border-gray-800 hover:border-gray-600 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-full ${rec.type === 'skill' ? 'bg-gray-800' : 'bg-gray-700'}`}>
                        {rec.type === 'skill' ? (
                          <BookOpen className="w-5 h-5 text-white" />
                        ) : (
                          <Users className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                        <p className="text-gray-300 mb-3">{rec.description}</p>
                        
                        {rec.type === 'skill' && rec.data.careerBenefit && (
                          <div className="bg-gray-700 rounded-lg p-3 mb-3">
                            <h4 className="text-sm font-medium text-white mb-1">Career Benefits:</h4>
                            <p className="text-sm text-gray-300">{rec.data.careerBenefit}</p>
                          </div>
                        )}
                        
                        {rec.type === 'user' && rec.data.user && (
                          <div className="flex items-center space-x-3 mb-3">
                            {rec.data.user.profilePhoto && (
                              <img
                                src={rec.data.user.profilePhoto}
                                alt={rec.data.user.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            )}
                            <div>
                              <p className="text-white font-medium">{rec.data.user.name}</p>
                              <p className="text-sm text-gray-400">Level {rec.data.user.level} • {rec.data.user.location}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Sparkles className="w-4 h-4 text-white" />
                          <span className="text-sm text-gray-400">
                            {Math.round(rec.confidence * 100)}% match
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {rec.type === 'user' && rec.data.user && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setSelectedUser(rec.data.user);
                          setShowRequestModal(true);
                        }}
                        className="bg-white text-black px-4 py-2 rounded-full hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Send Collaboration Request</span>
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedUser && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl max-w-md w-full p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-white">Request Collaboration with {selectedUser.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Skill to Offer
                </label>
                <select
                  value={requestData.skillOffered}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillOffered: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white"
                >
                  <option value="">Select a skill you offer</option>
                  {currentUser.skillsOffered.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Skill You Want
                </label>
                <select
                  value={requestData.skillWanted}
                  onChange={(e) => setRequestData(prev => ({ ...prev, skillWanted: e.target.value }))}
                  className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white"
                >
                  <option value="">Select a skill you want</option>
                  {selectedUser.skillsOffered.map((skill: string) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={requestData.message}
                  onChange={(e) => setRequestData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Hi! I'd love to collaborate based on the AI recommendation..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-3 py-2 focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-2 px-4 rounded-full hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={!requestData.skillOffered || !requestData.skillWanted}
                className="flex-1 bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;