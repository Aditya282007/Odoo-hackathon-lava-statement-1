import { Response } from 'express';
import User from '../models/User';
import Report from '../models/Report';
import Request from '../models/Request';
import Chat from '../models/Chat';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      status = 'all',
      badge = 'all'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    // Add search functionality
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { skills: { $in: [new RegExp(search as string, 'i')] } }
        ]
      };
    }

    // Filter by status
    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'active') {
      query.isBlocked = false;
    }

    // Filter by badge
    if (badge !== 'all') {
      query.badge = badge;
    }

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['name', 'email', 'xp', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    const users = await User.find(query)
      .select('name email phone skills xp badge isBlocked createdAt updatedAt')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await User.countDocuments(query);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          blockedUsers: { $sum: { $cond: ['$isBlocked', 1, 0] } },
          activeUsers: { $sum: { $cond: ['$isBlocked', 0, 1] } },
          publicProfiles: { $sum: { $cond: ['$isPublic', 1, 0] } },
          averageXp: { $avg: '$xp' }
        }
      }
    ]);

    // Get badge distribution
    const badgeDistribution = await User.aggregate([
      { $group: { _id: '$badge', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    sendSuccess(res, 'Users retrieved successfully', {
      users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      stats: userStats[0] || {
        totalUsers: 0,
        blockedUsers: 0,
        activeUsers: 0,
        publicProfiles: 0,
        averageXp: 0
      },
      badgeDistribution,
      filters: {
        search: search || '',
        status,
        badge,
        sortBy: sortField,
        sortOrder: order === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error: any) {
    console.error('Get all users error:', error);
    sendError(res, 'Failed to retrieve users', 500, error.message);
  }
};

export const blockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (user.isBlocked) {
      sendError(res, 'User is already blocked', 400);
      return;
    }

    // Prevent blocking admin users
    if (user.email.includes('admin')) {
      sendError(res, 'Cannot block admin users', 403);
      return;
    }

    user.isBlocked = true;
    await user.save();

    sendSuccess(res, 'User blocked successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error: any) {
    console.error('Block user error:', error);
    sendError(res, 'Failed to block user', 500, error.message);
  }
};

export const unblockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (!user.isBlocked) {
      sendError(res, 'User is not blocked', 400);
      return;
    }

    user.isBlocked = false;
    await user.save();

    sendSuccess(res, 'User unblocked successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked
      }
    });
  } catch (error: any) {
    console.error('Unblock user error:', error);
    sendError(res, 'Failed to unblock user', 500, error.message);
  }
};

export const getDashboardStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Get current date and 30 days ago
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);

    // Get various statistics
    const [
      totalUsers,
      newUsersThisMonth,
      totalRequests,
      newRequestsThisMonth,
      totalReports,
      newReportsThisMonth,
      totalChats,
      newChatsThisMonth,
      blockedUsers
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Request.countDocuments(),
      Request.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Report.countDocuments(),
      Report.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      Chat.countDocuments(),
      Chat.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ isBlocked: true })
    ]);

    // Get top skills
    const topSkills = await User.aggregate([
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get user growth over last 7 days
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    sendSuccess(res, 'Dashboard stats retrieved successfully', {
      stats: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          blocked: blockedUsers,
          growth: userGrowth
        },
        requests: {
          total: totalRequests,
          newThisMonth: newRequestsThisMonth
        },
        reports: {
          total: totalReports,
          newThisMonth: newReportsThisMonth
        },
        chats: {
          total: totalChats,
          newThisMonth: newChatsThisMonth
        },
        topSkills
      }
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    sendError(res, 'Failed to retrieve dashboard stats', 500, error.message);
  }
};

export const deleteUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Prevent deleting admin users
    if (user.email.includes('admin')) {
      sendError(res, 'Cannot delete admin users', 403);
      return;
    }

    // Delete user and all related data
    await Promise.all([
      User.findByIdAndDelete(id),
      Request.deleteMany({ $or: [{ from: id }, { to: id }] }),
      Chat.deleteMany({ $or: [{ from: id }, { to: id }] }),
      Report.deleteMany({ $or: [{ fromUser: id }, { toUser: id }] })
    ]);

    sendSuccess(res, 'User and all related data deleted successfully', {
      deletedUserId: id
    });
  } catch (error: any) {
    console.error('Delete user error:', error);
    sendError(res, 'Failed to delete user', 500, error.message);
  }
};