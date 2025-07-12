import { Response } from 'express';
import Request from '../models/Request';
import User from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const sendRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { toUserId } = req.params;
    const { message } = req.body;
    const fromUserId = req.user?._id;

    if (fromUserId === toUserId) {
      sendError(res, 'Cannot send request to yourself', 400);
      return;
    }

    // Check if target user exists and is not blocked
    const targetUser = await User.findById(toUserId);
    if (!targetUser) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (targetUser.isBlocked) {
      sendError(res, 'Cannot send request to blocked user', 403);
      return;
    }

    if (!targetUser.isPublic) {
      sendError(res, 'Cannot send request to private profile', 403);
      return;
    }

    // Check if request already exists
    const existingRequest = await Request.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId }
      ]
    });

    if (existingRequest) {
      let errorMessage = 'Request already exists between these users';
      if (existingRequest.status === 'accepted') {
        errorMessage = 'You are already collaborating with this user';
      } else if (existingRequest.status === 'rejected') {
        errorMessage = 'Previous request was rejected';
      }
      sendError(res, errorMessage, 409);
      return;
    }

    // Create new request
    const newRequest = new Request({
      from: fromUserId,
      to: toUserId,
      message: message?.trim() || ''
    });

    await newRequest.save();

    // Populate user details
    await newRequest.populate('from', 'name email skills photo xp badge');
    await newRequest.populate('to', 'name email skills photo xp badge');

    sendSuccess(res, 'Collaboration request sent successfully', {
      request: newRequest
    }, 201);
  } catch (error: any) {
    console.error('Send request error:', error);
    sendError(res, 'Failed to send request', 500, error.message);
  }
};

export const getReceivedRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { 
      page = 1, 
      limit = 10, 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    let query: any = { to: userId };
    
    // Filter by status if specified
    if (status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    const requests = await Request.find(query)
      .populate('from', 'name email skills photo xp badge createdAt')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Request.countDocuments(query);

    // Get status counts
    const statusCounts = await Request.aggregate([
      { $match: { to: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {
      all: total,
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    statusCounts.forEach(item => {
      counts[item._id as keyof typeof counts] = item.count;
    });

    sendSuccess(res, 'Received requests retrieved successfully', {
      requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      statusCounts: counts,
      filters: {
        status,
        sortBy: sortField,
        sortOrder: order === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error: any) {
    console.error('Get received requests error:', error);
    sendError(res, 'Failed to retrieve received requests', 500, error.message);
  }
};

export const getSentRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { 
      page = 1, 
      limit = 10, 
      status = 'all',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    let query: any = { from: userId };
    
    // Filter by status if specified
    if (status !== 'all') {
      query.status = status;
    }

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    const requests = await Request.find(query)
      .populate('to', 'name email skills photo xp badge createdAt')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Request.countDocuments(query);

    // Get status counts
    const statusCounts = await Request.aggregate([
      { $match: { from: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const counts = {
      all: total,
      pending: 0,
      accepted: 0,
      rejected: 0
    };

    statusCounts.forEach(item => {
      counts[item._id as keyof typeof counts] = item.count;
    });

    sendSuccess(res, 'Sent requests retrieved successfully', {
      requests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      statusCounts: counts,
      filters: {
        status,
        sortBy: sortField,
        sortOrder: order === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error: any) {
    console.error('Get sent requests error:', error);
    sendError(res, 'Failed to retrieve sent requests', 500, error.message);
  }
};

export const acceptRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const userId = req.user?._id;

    const request = await Request.findById(requestId);
    if (!request) {
      sendError(res, 'Request not found', 404);
      return;
    }

    // Check if user is the recipient
    if (request.to !== userId) {
      sendError(res, 'Unauthorized to accept this request', 403);
      return;
    }

    if (request.status !== 'pending') {
      sendError(res, 'Request has already been processed', 400);
      return;
    }

    // Update request status
    request.status = 'accepted';
    await request.save();

    // Award XP to both users
    await Promise.all([
      User.findByIdAndUpdate(request.from, { $inc: { xp: 50 } }),
      User.findByIdAndUpdate(request.to, { $inc: { xp: 50 } })
    ]);

    await request.populate('from', 'name email skills photo xp badge');
    await request.populate('to', 'name email skills photo xp badge');

    sendSuccess(res, 'Request accepted successfully', {
      request,
      xpAwarded: 50
    });
  } catch (error: any) {
    console.error('Accept request error:', error);
    sendError(res, 'Failed to accept request', 500, error.message);
  }
};

export const rejectRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { requestId } = req.params;
    const userId = req.user?._id;

    const request = await Request.findById(requestId);
    if (!request) {
      sendError(res, 'Request not found', 404);
      return;
    }

    // Check if user is the recipient
    if (request.to !== userId) {
      sendError(res, 'Unauthorized to reject this request', 403);
      return;
    }

    if (request.status !== 'pending') {
      sendError(res, 'Request has already been processed', 400);
      return;
    }

    // Update request status
    request.status = 'rejected';
    await request.save();

    await request.populate('from', 'name email skills photo xp badge');
    await request.populate('to', 'name email skills photo xp badge');

    sendSuccess(res, 'Request rejected successfully', {
      request
    });
  } catch (error: any) {
    console.error('Reject request error:', error);
    sendError(res, 'Failed to reject request', 500, error.message);
  }
};

export const getRequestStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    const stats = await Request.aggregate([
      {
        $match: {
          $or: [{ from: userId }, { to: userId }]
        }
      },
      {
        $group: {
          _id: null,
          totalSent: {
            $sum: { $cond: [{ $eq: ['$from', userId] }, 1, 0] }
          },
          totalReceived: {
            $sum: { $cond: [{ $eq: ['$to', userId] }, 1, 0] }
          },
          acceptedSent: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$from', userId] }, { $eq: ['$status', 'accepted'] }] },
                1,
                0
              ]
            }
          },
          acceptedReceived: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$to', userId] }, { $eq: ['$status', 'accepted'] }] },
                1,
                0
              ]
            }
          },
          pendingSent: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$from', userId] }, { $eq: ['$status', 'pending'] }] },
                1,
                0
              ]
            }
          },
          pendingReceived: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ['$to', userId] }, { $eq: ['$status', 'pending'] }] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalSent: 0,
      totalReceived: 0,
      acceptedSent: 0,
      acceptedReceived: 0,
      pendingSent: 0,
      pendingReceived: 0
    };

    const responseStats = {
      ...result,
      totalCollaborations: result.acceptedSent + result.acceptedReceived,
      successRate: result.totalSent > 0 ? Math.round((result.acceptedSent / result.totalSent) * 100) : 0,
      responseRate: result.totalReceived > 0 ? Math.round(((result.acceptedReceived + (result.totalReceived - result.pendingReceived - result.acceptedReceived)) / result.totalReceived) * 100) : 0
    };

    sendSuccess(res, 'Request stats retrieved successfully', {
      stats: responseStats
    });
  } catch (error: any) {
    console.error('Get request stats error:', error);
    sendError(res, 'Failed to retrieve request stats', 500, error.message);
  }
};