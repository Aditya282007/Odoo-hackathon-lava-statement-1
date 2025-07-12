import { Request, Response, NextFunction } from 'express';

export const validateSignup = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    res.status(400).json({
      success: false,
      message: 'All fields (name, email, phone, password) are required'
    });
    return;
  }

  if (name.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
    return;
  }

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
    return;
  }

  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid phone number'
    });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
    return;
  }

  next();
};

export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction): void => {
  const { name, email, phone, skills, bio } = req.body;

  if (name && name.trim().length < 2) {
    res.status(400).json({
      success: false,
      message: 'Name must be at least 2 characters long'
    });
    return;
  }

  if (email) {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }
  }

  if (phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid phone number'
      });
      return;
    }
  }

  if (skills && Array.isArray(skills)) {
    if (skills.length > 20) {
      res.status(400).json({
        success: false,
        message: 'Maximum 20 skills allowed'
      });
      return;
    }

    for (const skill of skills) {
      if (typeof skill !== 'string' || skill.trim().length < 1) {
        res.status(400).json({
          success: false,
          message: 'Each skill must be a non-empty string'
        });
        return;
      }
    }
  }

  if (bio && bio.length > 500) {
    res.status(400).json({
      success: false,
      message: 'Bio cannot exceed 500 characters'
    });
    return;
  }

  next();
};

export const validateCollaborationRequest = (req: Request, res: Response, next: NextFunction): void => {
  const { message } = req.body;

  if (message && message.length > 500) {
    res.status(400).json({
      success: false,
      message: 'Message cannot exceed 500 characters'
    });
    return;
  }

  next();
};

export const validateReport = (req: Request, res: Response, next: NextFunction): void => {
  const { reason, message } = req.body;

  const validReasons = [
    'Inappropriate behavior',
    'Harassment or bullying', 
    'Spam or fake profile',
    'Inappropriate content',
    'Scam or fraud',
    'Other'
  ];

  if (!reason || !validReasons.includes(reason)) {
    res.status(400).json({
      success: false,
      message: 'Please provide a valid reason for reporting'
    });
    return;
  }

  if (message && message.length > 500) {
    res.status(400).json({
      success: false,
      message: 'Report message cannot exceed 500 characters'
    });
    return;
  }

  next();
};

export const validateChatMessage = (req: Request, res: Response, next: NextFunction): void => {
  const { message } = req.body;

  if (!message || message.trim().length === 0) {
    res.status(400).json({
      success: false,
      message: 'Message cannot be empty'
    });
    return;
  }

  if (message.length > 1000) {
    res.status(400).json({
      success: false,
      message: 'Message cannot exceed 1000 characters'
    });
    return;
  }

  next();
};