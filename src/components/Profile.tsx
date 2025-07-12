import React, { useState } from 'react';
import { User, MapPin, Calendar, Plus, X, Eye, EyeOff, Save, Star, Trophy, Zap, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateLevel, getXpForNextLevel, getLevelProgress, getNextBadgeToEarn } from '../utils/xpSystem';

const Profile: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(currentUser || {
    id: '',
    name: '',
    email: '',
    location: '',
    profilePhoto: '',
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
    isPublic: true,
    rating: 0,
    totalSwaps: 0,
    xp: 0,
    level: 1,
    badges: [],
    joinedDate: '',
  });
  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Please sign in to view your profile.</p>
      </div>
    );
  }

  const handleSave = () => {
    updateUser(currentUser.id, editData);
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim() && !editData.skillsOffered.includes(newSkillOffered.trim())) {
      setEditData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim() && !editData.skillsWanted.includes(newSkillWanted.trim())) {
      setEditData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const addAvailability = () => {
    if (newAvailability.trim() && !editData.availability.includes(newAvailability.trim())) {
      setEditData(prev => ({
        ...prev,
        availability: [...prev.availability, newAvailability.trim()]
      }));
      setNewAvailability('');
    }
  };

  const removeSkillOffered = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter(s => s !== skill)
    }));
  };

  const removeSkillWanted = (skill: string) => {
    setEditData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter(s => s !== skill)
    }));
  };

  const removeAvailability = (time: string) => {
    setEditData(prev => ({
      ...prev,
      availability: prev.availability.filter(a => a !== time)
    }));
  };

  const nextBadge = getNextBadgeToEarn(currentUser);
  const xpForNextLevel = getXpForNextLevel(currentUser.xp);
  const levelProgress = getLevelProgress(currentUser.xp);
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* XP and Level Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 bg-white text-black rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {currentUser.level}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1">
                <Zap className="w-4 h-4 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mt-2">Level {currentUser.level}</h3>
            <p className="text-gray-300 text-sm">{currentUser.xp} XP Total</p>
          </div>
          
          <div>
            <h4 className="text-white font-medium mb-2">Progress to Level {currentUser.level + 1}</h4>
            <div className="bg-gray-800 rounded-full h-3 mb-2">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
            <p className="text-gray-300 text-sm">{xpForNextLevel} XP needed</p>
          </div>
          
          <div className="text-center">
            <Trophy className="w-8 h-8 text-white mx-auto mb-2" />
            <h4 className="text-white font-medium">{currentUser.badges.length} Badges</h4>
            <p className="text-gray-300 text-sm">{currentUser.totalSwaps} Collaborations</p>
          </div>
        </div>
        
        {nextBadge && (
          <div className="mt-6 bg-gray-800 bg-opacity-50 rounded-2xl p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-6 h-6 text-white" />
              <div>
                <h4 className="text-white font-medium">Next Badge: {nextBadge.name}</h4>
                <p className="text-gray-300 text-sm">{nextBadge.description}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {nextBadge.xpRequired - currentUser.xp} XP remaining
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Badges Section */}
      {currentUser.badges.length > 0 && (
        <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-white" />
            <span>Earned Badges</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentUser.badges.map((badge, index) => (
              <div key={index} className="bg-gray-900 border border-gray-700 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{badge.icon}</div>
                <h5 className="text-white font-medium text-sm">{badge.name}</h5>
                <p className="text-gray-300 text-xs mt-1">{badge.description}</p>
                {badge.earnedAt && (
                  <p className="text-gray-400 text-xs mt-2">
                    Earned {new Date(badge.earnedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-white">My Profile</h2>
          <button
            onClick={() => {
              if (isEditing) {
                handleSave();
              } else {
                setEditData(currentUser);
                setIsEditing(true);
              }
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isEditing
                ? 'bg-white text-black hover:bg-gray-100 shadow-lg rounded-full'
                : 'bg-white text-black hover:bg-gray-100 shadow-lg rounded-full'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="text-center">
              {currentUser.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.name}
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              
              {isEditing ? (
                <input
                  type="url"
                  value={editData.profilePhoto || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, profilePhoto: e.target.value }))}
                  placeholder="Profile photo URL"
                  className="w-full text-center bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400"
                />
              ) : (
                <h3 className="text-xl font-semibold text-white">{currentUser.name}</h3>
              )}
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Basic Information</h4>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 text-white"
                    />
                  ) : (
                    <p className="text-white">{currentUser.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <p className="text-white">{currentUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.location || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="City, State"
                      className="w-full bg-gray-900 border border-gray-700 rounded-full px-3 py-2 text-white placeholder-gray-400"
                    />
                  ) : (
                    <p className="text-white flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentUser.location || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Profile Visibility</label>
                  {isEditing ? (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setEditData(prev => ({ ...prev, isPublic: true }))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                          editData.isPublic
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Public</span>
                      </button>
                      <button
                        onClick={() => setEditData(prev => ({ ...prev, isPublic: false }))}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-colors flex items-center space-x-2 ${
                          !editData.isPublic
                            ? 'bg-white text-black'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        <EyeOff className="w-4 h-4" />
                        <span>Private</span>
                      </button>
                    </div>
                  ) : (
                    <p className={`flex items-center ${currentUser.isPublic ? 'text-white' : 'text-gray-400'}`}>
                      {currentUser.isPublic ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                      {currentUser.isPublic ? 'Public' : 'Private'}
                    </p>
                  )}
                </div>

                <div className="text-sm text-gray-400 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Joined {new Date(currentUser.joinedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Offered */}
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h4 className="text-lg font-semibold text-white mb-4">Skills I Offer</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {(isEditing ? editData.skillsOffered : currentUser.skillsOffered).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-green-900 text-green-300 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              {isEditing && (
                <button
                  onClick={() => removeSkillOffered(skill)}
                  className="text-green-400 hover:text-green-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillOffered}
              onChange={(e) => setNewSkillOffered(e.target.value)}
              placeholder="Add a skill you offer"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-3 py-2 text-sm text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
            />
            <button
              onClick={addSkillOffered}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Skills Wanted */}
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h4 className="text-lg font-semibold text-white mb-4">Skills I Want to Learn</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {(isEditing ? editData.skillsWanted : currentUser.skillsWanted).map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-900 text-blue-300 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{skill}</span>
              {isEditing && (
                <button
                  onClick={() => removeSkillWanted(skill)}
                  className="text-blue-400 hover:text-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newSkillWanted}
              onChange={(e) => setNewSkillWanted(e.target.value)}
              placeholder="Add a skill you want to learn"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-3 py-2 text-sm text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
            />
            <button
              onClick={addSkillWanted}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Availability */}
      <div className="bg-black rounded-3xl shadow-lg p-6 border border-gray-800">
        <h4 className="text-lg font-semibold text-white mb-4">Availability</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {(isEditing ? editData.availability : currentUser.availability).map((time, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm flex items-center space-x-2"
            >
              <span>{time}</span>
              {isEditing && (
                <button
                  onClick={() => removeAvailability(time)}
                  className="text-gray-400 hover:text-gray-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAvailability}
              onChange={(e) => setNewAvailability(e.target.value)}
              placeholder="e.g., Weekends, Evenings, Mornings"
              className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-3 py-2 text-sm text-white placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && addAvailability()}
            />
            <button
              onClick={addAvailability}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;