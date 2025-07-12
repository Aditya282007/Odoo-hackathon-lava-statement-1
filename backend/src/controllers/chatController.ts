import { Response } from 'express';
import Chat from '../models/Chat';
import Request from '../models/Request';
import User from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    const fromUserId = req.user?._id;

    if (fromUserId === userId) {
      sendError(res, 'Cannot send message to yourself', 400);
      return;
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      sendError(res, 'User not found', 404);
      return;
    }

    if (targetUser.isBlocked) {
      sendError(res, 'Cannot send message to blocked user', 403);
      return;
    }

    // Check if there's an accepted collaboration request between users
    const acceptedRequest = await Request.findOne({
      $or: [
        { from: fromUserId, to: userId, status: 'accepted' },
        { from: userId, to: fromUserId, status: 'accepted' }
      ]
    });

    if (!acceptedRequest) {
      sendError(res, 'Chat is only available after mutual collaboration acceptance', 403);
      return;
    }

    // Create new message
    const newMessage = new Chat({
      from: fromUserId,
      to: userId,
      message: message.trim()
    });

    await newMessage.save();

    // Populate sender details
    await newMessage.populate('from', 'name photo');
    await newMessage.populate('to', 'name photo');

    sendSuccess(res, 'Message sent successfully', {
      message: newMessage
    }, 201);
  } catch (error: any) {
    console.error('Send message error:', error);
    sendError(res, 'Failed to send message', 500, error.message);
  }
};

export const getChatHistory = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50, before } = req.query;
    const currentUserId = req.user?._id;

    if (currentUserId === userId) {
      sendError(res, 'Cannot get chat history with yourself', 400);
      return;
    }

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Check if there's an accepted collaboration request between users
    const acceptedRequest = await Request.findOne({
      $or: [
        { from: currentUserId, to: userId, status: 'accepted' },
        { from: userId, to: currentUserId, status: 'accepted' }
      ]
    });

    if (!acceptedRequest) {
      sendError(res, 'Chat history is only available after mutual collaboration acceptance', 403);
      return;
    }

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    };

    // Add before filter for pagination
    if (before) {
      query.timestamp = { $lt: new Date(before as string) };
    }

    // Get messages between the two users
    const messages = await Chat.find(query)
      .populate('from', 'name photo')
      .populate('to', 'name photo')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limitNum);

    const total = await Chat.countDocuments({
      $or: [
        { from: currentUserId, to: userId },
        { from: userId, to: currentUserId }
      ]
    });

    // Reverse to show oldest first
    messages.reverse();

    sendSuccess(res, 'Chat history retrieved successfully', {
      messages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      chatPartner: {
        id: targetUser._id,
        name: targetUser.name,
        photo: targetUser.photo,
        skills: targetUser.skills,
        isOnline: false // Placeholder for future real-time implementation
      }
    });
  } catch (error: any) {
    console.error('Get chat history error:', error);
    sendError(res, 'Failed to retrieve chat history', 500, error.message);
  }
};

export const getChatList = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const currentUserId = req.user?._id;
    const { page = 1, limit = 20 } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 50);
    const skip = (pageNum - 1) * limitNum;

    // Get all users with whom current user has accepted collaborations
    const acceptedCollaborations = await Request.find({
      $or: [
        { from: currentUserId, status: 'accepted' },
        { to: currentUserId, status: 'accepted' }
      ]
    }).populate('from to', 'name photo skills');

    // Extract unique user IDs
    const collaboratorIds = new Set();
    acceptedCollaborations.forEach(collab => {
      if (collab.from._id.toString() !== currentUserId) {
        collaboratorIds.add(collab.from._id.toString());
      }
      if (collab.to._id.toString() !== currentUserId) {
        collaboratorIds.add(collab.to._id.toString());
      }
    });

    if (collaboratorIds.size === 0) {
      sendSuccess(res, 'Chat list retrieved successfully', {
        chats: [],
        pagination: {
          page: pageNum,
          limit: limitNum,
          total: 0,
          pages: 0,
          hasNext: false,
          hasPrev: false
        }
      });
      return;
    }

    // Get latest message with each collaborator
    const chatList = await Chat.aggregate([
      {
        $match: {
          $or: [
            { from: currentUserId, to: { $in: Array.from(collaboratorIds) } },
            { from: { $in: Array.from(collaboratorIds) }, to: currentUserId }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$from', currentUserId] },
              '$to',
              '$from'
            ]
          },
          lastMessage: { $first: '$$ROOT' },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$to', currentUserId] },
                    { $eq: ['$read', false] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          user: {
            id: '$user._id',
            name: '$user.name',
            photo: '$user.photo',
            skills: '$user.skills'
          },
          lastMessage: {
            message: '$lastMessage.message',
            timestamp: '$lastMessage.timestamp',
            from: '$lastMessage.from'
          },
          unreadCount: 1
        }
      },
      {
        $sort: { 'lastMessage.timestamp': -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limitNum
      }
    ]);

    const total = collaboratorIds.size;

    sendSuccess(res, 'Chat list retrieved successfully', {
      chats: chatList,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error: any) {
    console.error('Get chat list error:', error);
    sendError(res, 'Failed to retrieve chat list', 500, error.message);
  }
};