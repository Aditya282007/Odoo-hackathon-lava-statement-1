import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendSuccess, sendError } from '../utils/response';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'User with this email already exists', 409);
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password
    });

    await user.save();

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email
    });

    sendSuccess(res, 'User registered successfully', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        skills: user.skills,
        bio: user.bio,
        isPublic: user.isPublic,
        xp: user.xp,
        badge: user.badge
      }
    }, 201);
  } catch (error: any) {
    console.error('Signup error:', error);
    sendError(res, 'Registration failed', 500, error.message);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Check if user is blocked
    if (user.isBlocked) {
      sendError(res, 'Account has been blocked. Please contact support.', 403);
      return;
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(res, 'Invalid email or password', 401);
      return;
    }

    // Generate JWT token
    const token = generateToken({
      id: user._id,
      email: user.email
    });

    sendSuccess(res, 'Login successful', {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        skills: user.skills,
        bio: user.bio,
        isPublic: user.isPublic,
        xp: user.xp,
        badge: user.badge
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    sendError(res, 'Login failed', 500, error.message);
  }
};