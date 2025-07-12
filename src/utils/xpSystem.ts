import { User, Badge } from '../types';
import { availableBadges } from '../data/mockData';

export const XP_REWARDS = {
  COMPLETE_SWAP: 50,
  RECEIVE_5_STAR_REVIEW: 25,
  RECEIVE_4_STAR_REVIEW: 15,
  RECEIVE_3_STAR_REVIEW: 10,
  TEACH_SKILL: 30,
  LEARN_SKILL: 20,
  FIRST_SWAP: 100,
  WEEKLY_ACTIVE: 10,
};

export const calculateLevel = (xp: number): number => {
  return Math.floor(xp / 100) + 1;
};

export const getXpForNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  return currentLevel * 100 - currentXp;
};

export const getLevelProgress = (xp: number): number => {
  const currentLevel = calculateLevel(xp);
  const xpInCurrentLevel = xp - ((currentLevel - 1) * 100);
  return (xpInCurrentLevel / 100) * 100;
};

export const checkForNewBadges = (user: User): Badge[] => {
  const newBadges: Badge[] = [];
  const earnedBadgeIds = user.badges.map(b => b.id);
  
  availableBadges.forEach(badge => {
    if (!earnedBadgeIds.includes(badge.id) && user.xp >= badge.xpRequired) {
      // Additional checks for specific badges
      let shouldEarn = true;
      
      switch (badge.id) {
        case 'first_swap':
          shouldEarn = user.totalSwaps >= 1;
          break;
        case 'mentor':
          shouldEarn = user.totalSwaps >= 5;
          break;
        case 'learner':
          shouldEarn = user.skillsOffered.length >= 3;
          break;
        case 'expert':
          shouldEarn = user.level >= 10;
          break;
        case 'community_builder':
          shouldEarn = user.totalSwaps >= 20;
          break;
        case 'tech_guru':
          const techSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'HTML', 'CSS', 'Java', 'C++'];
          shouldEarn = user.skillsOffered.filter(skill => techSkills.includes(skill)).length >= 5;
          break;
      }
      
      if (shouldEarn) {
        newBadges.push({
          ...badge,
          earnedAt: new Date().toISOString().split('T')[0],
        });
      }
    }
  });
  
  return newBadges;
};

export const awardXp = (user: User, xpAmount: number, reason: string): { newXp: number; newLevel: number; newBadges: Badge[] } => {
  const newXp = user.xp + xpAmount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > user.level;
  
  const updatedUser = { ...user, xp: newXp, level: newLevel };
  const newBadges = checkForNewBadges(updatedUser);
  
  return {
    newXp,
    newLevel,
    newBadges,
  };
};

export const getBadgesByCategory = (badges: Badge[]) => {
  const categories = {
    achievement: badges.filter(b => ['first_swap', 'expert', 'community_builder'].includes(b.id)),
    skill: badges.filter(b => ['mentor', 'learner', 'tech_guru'].includes(b.id)),
  };
  
  return categories;
};

export const getNextBadgeToEarn = (user: User): Badge | null => {
  const earnedBadgeIds = user.badges.map(b => b.id);
  const availableToEarn = availableBadges.filter(badge => 
    !earnedBadgeIds.includes(badge.id) && user.xp < badge.xpRequired
  );
  
  return availableToEarn.sort((a, b) => a.xpRequired - b.xpRequired)[0] || null;
};