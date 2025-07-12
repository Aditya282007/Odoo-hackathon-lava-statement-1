import { Response } from 'express';
import Report from '../models/Report';
import User from '../models/User';
import { AuthRequest } from '../types';
import { sendSuccess, sendError } from '../utils/response';

export const createReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportedUserId } = req.params;
    const { reason, message } = req.body;
    const fromUserId = req.user?._id;

    if (fromUserId === reportedUserId) {
      sendError(res, 'Cannot report yourself', 400);
      return;
    }

    // Check if reported user exists
    const reportedUser = await User.findById(reportedUserId);
    if (!reportedUser) {
      sendError(res, 'Reported user not found', 404);
      return;
    }

    // Check if user has already reported this user
    const existingReport = await Report.findOne({
      fromUser: fromUserId,
      toUser: reportedUserId
    });

    if (existingReport) {
      sendError(res, 'You have already reported this user', 409);
      return;
    }

    // Create new report
    const newReport = new Report({
      fromUser: fromUserId,
      toUser: reportedUserId,
      reason,
      message: message?.trim() || ''
    });

    await newReport.save();

    // Populate user details
    await newReport.populate('fromUser', 'name email');
    await newReport.populate('toUser', 'name email');

    sendSuccess(res, 'Report submitted successfully', {
      report: newReport
    }, 201);
  } catch (error: any) {
    console.error('Create report error:', error);
    sendError(res, 'Failed to submit report', 500, error.message);
  }
};

export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      reason, 
      sortBy = 'timestamp', 
      sortOrder = 'desc',
      status = 'all'
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = Math.min(parseInt(limit as string), 100);
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    // Filter by reason if provided
    if (reason && reason !== 'all') {
      query.reason = reason;
    }

    // Build sort object
    const sortObj: any = {};
    const validSortFields = ['timestamp', 'reason'];
    const sortField = validSortFields.includes(sortBy as string) ? sortBy as string : 'timestamp';
    const order = sortOrder === 'asc' ? 1 : -1;
    sortObj[sortField] = order;

    const reports = await Report.find(query)
      .populate('fromUser', 'name email photo')
      .populate('toUser', 'name email photo')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum);

    const total = await Report.countDocuments(query);

    // Get reason counts for filtering
    const reasonCounts = await Report.aggregate([
      { $group: { _id: '$reason', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    sendSuccess(res, 'Reports retrieved successfully', {
      reports,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1
      },
      reasonCounts,
      filters: {
        reason: reason || 'all',
        sortBy: sortField,
        sortOrder: order === 1 ? 'asc' : 'desc'
      }
    });
  } catch (error: any) {
    console.error('Get all reports error:', error);
    sendError(res, 'Failed to retrieve reports', 500, error.message);
  }
};

export const getReportStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const stats = await Report.aggregate([
      {
        $group: {
          _id: null,
          totalReports: { $sum: 1 },
          reportsByReason: {
            $push: '$reason'
          }
        }
      },
      {
        $project: {
          totalReports: 1,
          reasonBreakdown: {
            $reduce: {
              input: '$reportsByReason',
              initialValue: {},
              in: {
                $mergeObjects: [
                  '$$value',
                  {
                    $arrayToObject: [
                      [
                        {
                          k: '$$this',
                          v: {
                            $add: [
                              { $ifNull: [{ $getField: { field: '$$this', input: '$$value' } }, 0] },
                              1
                            ]
                          }
                        }
                      ]
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    ]);

    // Get recent reports (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await Report.countDocuments({
      timestamp: { $gte: sevenDaysAgo }
    });

    // Get most reported users
    const mostReportedUsers = await Report.aggregate([
      {
        $group: {
          _id: '$toUser',
          reportCount: { $sum: 1 }
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
            email: '$user.email'
          },
          reportCount: 1
        }
      },
      {
        $sort: { reportCount: -1 }
      },
      {
        $limit: 10
      }
    ]);

    const result = stats[0] || {
      totalReports: 0,
      reasonBreakdown: {}
    };

    sendSuccess(res, 'Report stats retrieved successfully', {
      stats: {
        ...result,
        recentReports,
        mostReportedUsers
      }
    });
  } catch (error: any) {
    console.error('Get report stats error:', error);
    sendError(res, 'Failed to retrieve report stats', 500, error.message);
  }
};