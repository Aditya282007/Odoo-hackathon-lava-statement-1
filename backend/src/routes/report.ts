import { Router } from 'express';
import { createReport, getAllReports, getReportStats } from '../controllers/reportController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import { validateReport } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/report/:reportedUserId
 * @desc    Report a user
 * @access  Private
 */
router.post('/:reportedUserId', authMiddleware, validateReport, createReport);

/**
 * @route   GET /api/report/stats
 * @desc    Get report statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', authMiddleware, adminMiddleware, getReportStats);

/**
 * @route   GET /api/report/all
 * @desc    Get all reports (Admin only)
 * @access  Private (Admin)
 */
router.get('/all', authMiddleware, adminMiddleware, getAllReports);

export default router;