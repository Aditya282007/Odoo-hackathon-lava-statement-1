import { GoogleGenerativeAI } from '@google/generative-ai';
import { User, AIRecommendation } from '../types';

const API_KEY = 'AIzaSyBo151mVQLNQyswSgtvMNYXn_ThpmQdJC0';
const genAI = new GoogleGenerativeAI(API_KEY);

export class AIRecommendationService {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  async getSkillRecommendations(user: User, allUsers: User[]): Promise<AIRecommendation[]> {
    try {
      const prompt = `
        Based on the following user profile, suggest 3-5 skills they should learn next and explain why:
        
        User Profile:
        - Current Skills: ${user.skillsOffered.join(', ')}
        - Wants to Learn: ${user.skillsWanted.join(', ')}
        - Level: ${user.level}
        - XP: ${user.xp}
        - Location: ${user.location || 'Not specified'}
        
        Available skills from other users: ${allUsers.flatMap(u => u.skillsOffered).filter((skill, index, arr) => arr.indexOf(skill) === index).join(', ')}
        
        Please respond in JSON format with an array of recommendations:
        [
          {
            "skill": "skill name",
            "reason": "why this skill would be valuable",
            "difficulty": "beginner|intermediate|advanced",
            "timeToLearn": "estimated time",
            "careerBenefit": "how it helps career growth"
          }
        ]
        
        Focus on skills that:
        1. Complement their existing skills
        2. Are in demand in their field
        3. Match their current level
        4. Are available from other users on the platform
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const skillData = JSON.parse(text);
        return skillData.map((skill: any, index: number) => ({
          type: 'skill' as const,
          title: `Learn ${skill.skill}`,
          description: `${skill.reason} (${skill.difficulty} level, ~${skill.timeToLearn})`,
          data: skill,
          confidence: Math.max(0.7, 1 - index * 0.1),
        }));
      } catch (parseError) {
        // Fallback if JSON parsing fails
        return this.getFallbackSkillRecommendations(user, allUsers);
      }
    } catch (error) {
      console.error('AI recommendation error:', error);
      return this.getFallbackSkillRecommendations(user, allUsers);
    }
  }

  async getUserRecommendations(user: User, allUsers: User[]): Promise<AIRecommendation[]> {
    try {
      const compatibleUsers = allUsers.filter(u => 
        u.id !== user.id && 
        u.isPublic && 
        !u.isBanned &&
        (u.skillsOffered.some(skill => user.skillsWanted.includes(skill)) ||
         user.skillsOffered.some(skill => u.skillsWanted.includes(skill)))
      );

      const prompt = `
        Based on the following user profile, recommend 3-5 users they should collaborate with:
        
        User Profile:
        - Skills Offered: ${user.skillsOffered.join(', ')}
        - Skills Wanted: ${user.skillsWanted.join(', ')}
        - Level: ${user.level}
        - Location: ${user.location || 'Not specified'}
        
        Compatible Users:
        ${compatibleUsers.map(u => `
        - ${u.name} (Level ${u.level}): Offers [${u.skillsOffered.join(', ')}], Wants [${u.skillsWanted.join(', ')}], Location: ${u.location || 'Not specified'}
        `).join('')}
        
        Please respond in JSON format with an array of user recommendations:
        [
          {
            "userId": "user_id",
            "reason": "why they should collaborate",
            "skillMatch": "what skills they can exchange",
            "compatibility": "high|medium|low"
          }
        ]
        
        Focus on users who:
        1. Have complementary skills
        2. Are at a similar or slightly higher level
        3. Have good mutual skill exchange potential
        4. Are geographically close if location is specified
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const userData = JSON.parse(text);
        return userData.map((rec: any, index: number) => {
          const recommendedUser = compatibleUsers.find(u => u.id === rec.userId || u.name.toLowerCase().includes(rec.userId?.toLowerCase()));
          if (!recommendedUser) return null;
          
          return {
            type: 'user' as const,
            title: `Collaborate with ${recommendedUser.name}`,
            description: `${rec.reason} - Exchange: ${rec.skillMatch}`,
            data: { user: recommendedUser, ...rec },
            confidence: rec.compatibility === 'high' ? 0.9 : rec.compatibility === 'medium' ? 0.7 : 0.5,
          };
        }).filter(Boolean);
      } catch (parseError) {
        return this.getFallbackUserRecommendations(user, compatibleUsers);
      }
    } catch (error) {
      console.error('AI user recommendation error:', error);
      return this.getFallbackUserRecommendations(user, allUsers.filter(u => 
        u.id !== user.id && u.isPublic && !u.isBanned
      ));
    }
  }

  private getFallbackSkillRecommendations(user: User, allUsers: User[]): AIRecommendation[] {
    const availableSkills = allUsers.flatMap(u => u.skillsOffered).filter((skill, index, arr) => arr.indexOf(skill) === index);
    const recommendedSkills = availableSkills.filter(skill => 
      !user.skillsOffered.includes(skill) && 
      (user.skillsWanted.includes(skill) || this.isComplementarySkill(skill, user.skillsOffered))
    ).slice(0, 3);

    return recommendedSkills.map((skill, index) => ({
      type: 'skill' as const,
      title: `Learn ${skill}`,
      description: `This skill complements your existing expertise and is available from other users.`,
      data: { skill, difficulty: 'intermediate', timeToLearn: '2-3 months' },
      confidence: Math.max(0.6, 1 - index * 0.15),
    }));
  }

  private getFallbackUserRecommendations(user: User, compatibleUsers: User[]): AIRecommendation[] {
    return compatibleUsers.slice(0, 3).map((recommendedUser, index) => ({
      type: 'user' as const,
      title: `Collaborate with ${recommendedUser.name}`,
      description: `Level ${recommendedUser.level} user with complementary skills for mutual learning.`,
      data: { user: recommendedUser, compatibility: 'medium' },
      confidence: Math.max(0.6, 1 - index * 0.1),
    }));
  }

  private isComplementarySkill(skill: string, userSkills: string[]): boolean {
    const techSkills = ['React', 'TypeScript', 'Node.js', 'Python', 'JavaScript', 'HTML', 'CSS'];
    const designSkills = ['Photoshop', 'Illustrator', 'UI/UX Design', 'Figma'];
    const businessSkills = ['Project Management', 'Excel', 'Data Analysis', 'Marketing'];
    
    const userHasTech = userSkills.some(s => techSkills.includes(s));
    const userHasDesign = userSkills.some(s => designSkills.includes(s));
    const userHasBusiness = userSkills.some(s => businessSkills.includes(s));
    
    if (userHasTech && designSkills.includes(skill)) return true;
    if (userHasDesign && techSkills.includes(skill)) return true;
    if (userHasBusiness && (techSkills.includes(skill) || designSkills.includes(skill))) return true;
    
    return false;
  }
}