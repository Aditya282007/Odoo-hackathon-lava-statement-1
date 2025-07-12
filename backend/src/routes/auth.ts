import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

/**
 * @route   POST /api/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validateSignup, signup);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLogin, login);

export default router;