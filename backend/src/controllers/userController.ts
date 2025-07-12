import { Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    sendSuccess(res, 'Profile retrieved successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        skills: user.skills,
        bio: user.bio,
        isPublic: user.isPublic,
        xp: user.xp,
        badge: user.badge,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Get profile error:', error);
    sendError(res, 'Failed to retrieve profile', 500, error.message);
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, phone, skills, bio, photo, isPublic } = req.body;
    
    const user = await User.findById(req.user?._id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        sendError(res, 'Email is already in use', 409);
        return;
      }
    }

    // Update fields
    if (name) user.name = name.trim();
    if (email) user.email = email.toLowerCase().trim();
    if (phone) user.phone = phone.trim();
    if (Array.isArray(skills)) user.skills = skills.map(skill => skill.trim()).filter(Boolean);
    if (bio !== undefined) user.bio = bio.trim();
    if (photo !== undefined) user.photo = photo.trim();
    if (isPublic !== undefined) user.isPublic = isPublic;

    await user.save();

    sendSuccess(res, 'Profile updated successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        photo: user.photo,
        skills: user.skills,
        bio: user.bio,
        isPublic: user.isPublic,
        xp: user.xp,
        badge: user.badge,
        updatedAt: user.updatedAt
      }
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    sendError(res, 'Failed to update profile', 500, error.message);
  }
};

export const searchUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      skills, 
      name, 
      page = 1, 
      limit = 10, 
      sortBy = 'xp', 
      sortOrder = 'desc',
      minXp,
      maxXp,
      badge
    } = req.query;
    
    let query: any = {
      isPublic: true,
      isBlocked: false,
      _id: { $ne: req.user?._id } // Exclude current user
    };

    // Add skills filter if provided
    if (skills) {
      const skillsArray = (skills as string).split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Add name search if provided
    if (name) {
      query.name = { $regex: name as string, $options: 'i' };
    }

    // Add XP range filter
    if (minXp || maxXp) {
      query.xp = {};
      if (minXp) query.xp.$gte = parseInt(minXp as string);
      if (maxXp) query.xp.$lte = parseInt(maxXp as string);
    }

    // Add badge filter
    if (badge) {
      query.badge = badge;
    }

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50); // Max 50 results per page
    const skip = (pageNum - 1) * limitNum;

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['name', 'xp', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'xp';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    const users = await User.find(query)
      .select('name email skills bio xp badge photo createdAt updatedAt')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    // Add computed fields
    const usersWithComputedFields = users.map(user => ({
      ...user.toObject(),
      level: Math.floor(user.xp / 100) + 1,
      nextLevelXp: (Math.floor(user.xp / 100) + 1) * 100,
      progressToNextLevel: user.xp % 100
    }));

    sendSuccess(res, 'Users retrieved successfully', {
      users: usersWithComputedFields,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      filters: {
        skills: skills ? (skills as string).split(',') : [],
        name: name || '',
        sortBy: sortField,
        sortOrder: order === 1 ? 'asc' : 'desc',
        minXp: minXp ? parseInt(minXp as string) : undefined,
        maxXp: maxXp ? parseInt(maxXp as string) : undefined,
        badge: badge || ''
      }
    });
  } catch (error: any) {
    console.error('Search users error:', error);
    sendError(res, 'Failed to search users', 500, error.message);
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('name email skills bio xp badge photo createdAt isPublic');
    
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (!user.isPublic && user._id.toString() !== req.user?._id) {
      sendError(res, 'User profile is private', 403);
      return;
    }

    const userWithComputedFields = {
      ...user.toObject(),
      level: Math.floor(user.xp / 100) + 1,
      nextLevelXp: (Math.floor(user.xp / 100) + 1) * 100,
      progressToNextLevel: user.xp % 100
    };

    sendSuccess(res, 'User retrieved successfully', {
      user: userWithComputedFields
    });
  } catch (error: any) {
    console.error('Get user by ID error:', error);
    sendError(res, 'Failed to retrieve user', 500, error.message);
  }
};

export const getSkillsSuggestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.query;
    
    if (!query || (query as string).length < 2) {
      sendSuccess(res, 'Skills suggestions retrieved', { skills: [] });
      return;
    }

    // Get unique skills from all users that match the query
    const skills = await User.aggregate([
      { $unwind: '$skills' },
      { 
        $match: { 
          skills: { $regex: query as string, $options: 'i' },
          isBlocked: false
        }
      },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { skill: '$_id', count: 1, _id: 0 } }
    ]);

    sendSuccess(res, 'Skills suggestions retrieved', { skills });
  } catch (error: any) {
    console.error('Get skills suggestions error:', error);
    sendError(res, 'Failed to retrieve skills suggestions', 500, error.message);
  }
};

export const getUserStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    
    // Get user's collaboration stats
    const [sentRequests, receivedRequests, acceptedCollaborations] = await Promise.all([
      // Count sent requests
      require('../models/Request').countDocuments({ from: userId }),
      // Count received requests  
      require('../models/Request').countDocuments({ to: userId }),
      // Count accepted collaborations
      require('../models/Request').countDocuments({
        $or: [
          { from: userId, status: 'accepted' },
          { to: userId, status: 'accepted' }
        ]
      })
    ]);

    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    const stats = {
      xp: user.xp,
      level: Math.floor(user.xp / 100) + 1,
      badge: user.badge,
      collaborations: acceptedCollaborations,
      requestsSent: sentRequests,
      requestsReceived: receivedRequests,
      skillsCount: user.skills.length,
      joinedDate: user.createdAt,
      profileViews: 0, // Placeholder for future implementation
      successRate: sentRequests > 0 ? Math.round((acceptedCollaborations / sentRequests) * 100) : 0
    };

    sendSuccess(res, 'User stats retrieved successfully', { stats });
  } catch (error: any) {
    console.error('Get user stats error:', error);
    sendError(res, 'Failed to retrieve user stats', 500, error.message);
  }
};