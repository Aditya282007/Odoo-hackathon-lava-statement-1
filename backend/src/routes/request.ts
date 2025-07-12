import { Router } from 'express';
import {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
  getRequestStats
} from '../controllers/requestController';
import { authMiddleware } from '../middleware/auth';
import { validateCollaborationRequest } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/request/:toUserId
 * @desc    Send collaboration request
 * @access  Private
 */
router.post('/:toUserId', authMiddleware, validateCollaborationRequest, sendRequest);

/**
 * @route   GET /api/request/received
 * @desc    Get received collaboration requests
 * @access  Private
 */
router.get('/received', authMiddleware, getReceivedRequests);

/**
 * @route   GET /api/request/sent
 * @desc    Get sent collaboration requests
 * @access  Private
 */
router.get('/sent', authMiddleware, getSentRequests);

/**
 * @route   GET /api/request/stats
 * @desc    Get request statistics
 * @access  Private
 */
router.get('/stats', authMiddleware, getRequestStats);

/**
 * @route   POST /api/request/:requestId/accept
 * @desc    Accept collaboration request
 * @access  Private
 */
router.post('/:requestId/accept', authMiddleware, acceptRequest);

/**
 * @route   POST /api/request/:requestId/reject
 * @desc    Reject collaboration request
 * @access  Private
 */
router.post('/:requestId/reject', authMiddleware, rejectRequest);

export default router;