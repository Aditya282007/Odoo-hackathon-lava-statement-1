import { Router } from 'express';
import { 
  getAllUsers, 
  blockUser, 
  unblockUser, 
  getDashboardStats,
  deleteUser 
} from '../controllers/adminController';
import { getAllReports, getReportStats } from '../controllers/reportController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();

/**
 * @route   GET /api/admin/dashboard
 * @desc    Get admin dashboard statistics
 * @access  Private (Admin)
 */
router.get('/dashboard', authMiddleware, adminMiddleware, getDashboardStats);

/**
 * @route   GET /api/admin/users
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);

/**
 * @route   GET /api/admin/reports
 * @desc    Get all reports (Admin only)
 * @access  Private (Admin)
 */
router.get('/reports', authMiddleware, adminMiddleware, getAllReports);

/**
 * @route   GET /api/admin/reports/stats
 * @desc    Get report statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/reports/stats', authMiddleware, adminMiddleware, getReportStats);

/**
 * @route   PUT /api/admin/user/:id/block
 * @desc    Block a user (Admin only)
 * @access  Private (Admin)
 */
router.put('/user/:id/block', authMiddleware, adminMiddleware, blockUser);

/**
 * @route   PUT /api/admin/user/:id/unblock
 * @desc    Unblock a user (Admin only)
 * @access  Private (Admin)
 */
router.put('/user/:id/unblock', authMiddleware, adminMiddleware, unblockUser);

/**
 * @route   DELETE /api/admin/user/:id
 * @desc    Delete a user and all related data (Admin only)
 * @access  Private (Admin)
 */
router.delete('/user/:id', authMiddleware, adminMiddleware, deleteUser);

export default router;