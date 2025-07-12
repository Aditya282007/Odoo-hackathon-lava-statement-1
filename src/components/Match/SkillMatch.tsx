import React, { useState } from 'react';
import { Search, Filter, Star, Users, Send } from 'lucide-react';
import UserCard from '../Common/UserCard';

const SkillMatch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('Most Skilled');

  const skills = ['React', 'Node.js', 'TypeScript', 'Python', 'Design', 'Mobile'];
  const sortOptions = ['Most Skilled', 'Most Active', 'Recently Joined', 'Highest Rated'];

  const users = [
    {
      id: 1,
      name: 'Sarah Chen',
      avatar: 'SC',
      skills: ['React', 'TypeScript', 'Design'],
      xp: 2850,
      level: 8,
      badges: ['🌟', '🤝', '🎓'],
      isOnline: true,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Mike Rodriguez',
      avatar: 'MR',
      skills: ['Node.js', 'Python', 'AWS'],
      xp: 3200,
      level: 9,
      badges: ['🌟', '🤝', '⚡'],
      isOnline: false,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Emily Johnson',
      avatar: 'EJ',
      skills: ['Mobile', 'React Native', 'Swift'],
      xp: 2100,
      level: 6,
      badges: ['🎓', '🤝', '⚡'],
      isOnline: true,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Alex Kim',
      avatar: 'AK',
      skills: ['Python', 'ML', 'Data Science'],
      xp: 4100,
      level: 12,
      badges: ['🌟', '🎓', '⚡'],
      isOnline: true,
      rating: 4.9,
    },
  ];

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Discover Talent</h1>
        <p className="text-light-text-muted dark:text-dark-text-muted">Find skilled professionals to collaborate with</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-light-surface dark:bg-dark-surface rounded-2xl p-6 shadow-soft dark:shadow-none border border-light-border dark:border-dark-border">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted" />
            <input
              type="text"
              placeholder="Search users by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent focus:border-transparent transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent appearance-none cursor-pointer min-w-48 font-medium"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none text-light-text-muted dark:text-dark-text-muted" />
          </div>
        </div>

        {/* Skill Filters */}
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">Filter by skills:</p>
          <div className="flex flex-wrap gap-2">
            {skills.map(skill => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  selectedSkills.includes(skill)
                    ? 'bg-light-accent dark:bg-dark-accent text-white'
                    : 'bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:bg-light-border/50 dark:hover:bg-dark-border/50'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Stats */}
      <div className="flex items-center gap-4 text-light-text-muted dark:text-dark-text-muted">
        <Users className="w-5 h-5" />
        <span>{users.length} users found</span>
        {selectedSkills.length > 0 && (
          <span>• Filtered by: {selectedSkills.join(', ')}</span>
        )}
      </div>

      {/* User Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Load More */}
      <div className="text-center">
        <button className="px-8 py-3 bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl hover:bg-light-border/50 dark:hover:bg-dark-border/50 transition-colors font-medium">
          Load More Users
        </button>
      </div>
    </div>
  );
};

export default SkillMatch;