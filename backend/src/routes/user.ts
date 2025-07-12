import { Router } from 'express';
import { 
  getProfile, 
  updateProfile, 
  searchUsers, 
  getUserById, 
  getSkillsSuggestions,
  getUserStats 
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { validateUpdateProfile } from '../middleware/validation';

const router = Router();

/**
 * @route   GET /api/user/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, getProfile);

/**
 * @route   PUT /api/user/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authMiddleware, validateUpdateProfile, updateProfile);

/**
 * @route   GET /api/user/stats
 * @desc    Get current user statistics
 * @access  Private
 */
router.get('/stats', authMiddleware, getUserStats);

/**
 * @route   GET /api/user/search
 * @desc    Search users by skills, name, etc.
 * @access  Private
 */
router.get('/search', authMiddleware, searchUsers);

/**
 * @route   GET /api/user/skills/suggestions
 * @desc    Get skills suggestions for autocomplete
 * @access  Private
 */
router.get('/skills/suggestions', authMiddleware, getSkillsSuggestions);

/**
 * @route   GET /api/user/:userId
 * @desc    Get user profile by ID
 * @access  Private
 */
router.get('/:userId', authMiddleware, getUserById);

export default router;