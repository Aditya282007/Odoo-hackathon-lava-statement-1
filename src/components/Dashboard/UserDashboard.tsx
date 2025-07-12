import React, { useState } from 'react';
import { Camera, Award, TrendingUp, Edit, Check, X, Plus } from 'lucide-react';

const UserDashboard: React.FC = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [selectedSkills, setSelectedSkills] = useState(['React', 'Node.js', 'TypeScript']);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSkills, setTempSkills] = useState(selectedSkills);
  const [newSkill, setNewSkill] = useState('');

  const availableSkills = [
    'React', 'Node.js', 'TypeScript', 'Python', 'JavaScript', 'Java', 'Go',
    'PHP', 'Ruby', 'Swift', 'Kotlin', 'C++', 'C#', 'Vue.js', 'Angular',
    'Next.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel'
  ];

  const badges = [
    { name: 'Early Adopter', icon: '🌟', color: 'from-yellow-400 to-orange-500' },
    { name: 'Collaborator', icon: '🤝', color: 'from-blue-400 to-purple-500' },
    { name: 'Mentor', icon: '🎓', color: 'from-green-400 to-teal-500' },
  ];

  const handleSkillToggle = (skill: string) => {
    setTempSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addNewSkill = () => {
    if (newSkill && !tempSkills.includes(newSkill)) {
      setTempSkills([...tempSkills, newSkill]);
      setNewSkill('');
    }
  };

  const saveSkills = () => {
    setSelectedSkills(tempSkills);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setTempSkills(selectedSkills);
    setIsEditing(false);
    setNewSkill('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Your Dashboard</h1>
        <p className="text-light-text-muted dark:text-dark-text-muted">Manage your profile and track your progress</p>
      </div>

      {/* Profile Section */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Profile Photo */}
          <div className="relative group">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl font-semibold text-white">
              JD
            </div>
            <button className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  defaultValue="John Doe"
                  className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  defaultValue="john.doe@example.com"
                  className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Make profile public</span>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                    isPublic ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-border dark:bg-dark-border'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                      isPublic ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Your Skills</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded-xl hover:bg-light-accent/20 dark:hover:bg-dark-accent/20 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Skills
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={saveSkills}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
              >
                <Check className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={cancelEdit}
                className="flex items-center gap-2 px-4 py-2 bg-light-border dark:bg-dark-border rounded-xl hover:bg-light-border/80 dark:hover:bg-dark-border/80 transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a new skill..."
                className="flex-1 px-4 py-2 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
                onKeyPress={(e) => e.key === 'Enter' && addNewSkill()}
              />
              <button
                onClick={addNewSkill}
                className="px-4 py-2 bg-light-accent dark:bg-dark-accent text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                    tempSkills.includes(skill)
                      ? 'bg-light-accent dark:bg-dark-accent text-white'
                      : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {selectedSkills.map((skill) => (
              <span
                key={skill}
                className="px-4 py-2 bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent rounded-lg font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* XP and Badges */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* XP Progress */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-light-accent dark:text-dark-accent" />
            <h2 className="text-xl font-semibold">Experience Points</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-light-text-muted dark:text-dark-text-muted">Current Level</span>
              <span className="text-2xl font-semibold">Level 7</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-light-text-muted dark:text-dark-text-muted">
                <span>2,850 XP</span>
                <span>3,000 XP</span>
              </div>
              <div className="w-full bg-light-border dark:bg-dark-border rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-light-accent to-blue-600 dark:from-dark-accent dark:to-blue-400 h-full transition-all duration-500 rounded-full" 
                  style={{ width: '95%' }}
                ></div>
              </div>
              <p className="text-sm text-light-text-muted dark:text-dark-text-muted">150 XP until next level</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-8 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-light-accent dark:text-dark-accent" />
            <h2 className="text-xl font-semibold">Badges</h2>
          </div>
          
          <div className="space-y-4">
            {badges.map((badge, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-light-bg dark:bg-dark-bg rounded-xl">
                <div className={`w-12 h-12 bg-gradient-to-br ${badge.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {badge.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-sm text-light-text-muted dark:text-dark-text-muted">Earned for outstanding contributions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;