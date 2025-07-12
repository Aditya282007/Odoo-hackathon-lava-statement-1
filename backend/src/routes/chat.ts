import { Router } from 'express';
import { sendMessage, getChatHistory, getChatList } from '../controllers/chatController';
import { authMiddleware } from '../middleware/auth';
import { validateChatMessage } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/chat/:userId
 * @desc    Send message to user
 * @access  Private
 */
router.post('/:userId', authMiddleware, validateChatMessage, sendMessage);

/**
 * @route   GET /api/chat/:userId
 * @desc    Get chat history with user
 * @access  Private
 */
router.get('/:userId', authMiddleware, getChatHistory);

/**
 * @route   GET /api/chat
 * @desc    Get list of all chats
 * @access  Private
 */
router.get('/', authMiddleware, getChatList);

export default router;