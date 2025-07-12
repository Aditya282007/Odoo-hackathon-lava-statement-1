import React, { useState, useMemo } from 'react';
import { Search, MapPin, Star, MessageSquare, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User } from '../types';

const Browse: React.FC = () => {
  const { users, currentUser, addSwapRequest } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: '',
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (!user.isPublic || user.id === currentUser?.id || user.isBanned) return false;
      
      const searchLower = searchTerm.toLowerCase();
      return (
        user.name.toLowerCase().includes(searchLower) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchLower)) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchLower)) ||
        user.location?.toLowerCase().includes(searchLower)
      );
    });
  }, [users, searchTerm, currentUser]);

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

  return (
    <div className="space-y-6">
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h2 className="text-2xl font-bold text-white mb-4">Browse Skills</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name, skill, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-full focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-400"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-black rounded-3xl shadow-lg p-6 hover:shadow-xl transition-all border border-gray-800 hover:border-gray-600">
            <div className="flex items-start space-x-4">
              {user.profilePhoto ? (
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <Eye className="w-8 h-8 text-gray-600" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{user.name}</h3>
                {user.location && (
                  <p className="text-sm text-gray-400 flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user.location}
                  </p>
                )}
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-300 ml-1">{user.rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-400 ml-2">({user.totalSwaps} swaps)</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-3">
                <h4 className="text-sm font-medium text-white mb-2">Skills Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Skills Wanted</h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Available</h4>
                <div className="flex flex-wrap gap-1">
                  {user.availability.map((time, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedUser(user);
                  setShowRequestModal(true);
                }}
                className="w-full bg-white text-black py-2 px-4 rounded-full hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 shadow-lg font-medium"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Request Swap</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <EyeOff className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No users found matching your search.</p>
        </div>
      )}

      {/* Request Modal */}
      {showRequestModal && selectedUser && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-3xl max-w-md w-full p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 text-white">Request Skill Swap with {selectedUser.name}</h3>
            
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
                  {selectedUser.skillsOffered.map(skill => (
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
                  placeholder="Introduce yourself and explain what you'd like to learn..."
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

export default Browse;