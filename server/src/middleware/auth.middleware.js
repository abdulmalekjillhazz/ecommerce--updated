import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Protect route - requires valid access token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  // 1. Try reading from httpOnly cookie
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Try reading from Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please sign in to access this resource.');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key_32chars_long'
    );

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(401, 'User account no longer exists or has been deactivated.');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Access token expired. Please refresh your session.');
    }
    throw new ApiError(401, 'Invalid authentication token.');
  }
});

/**
 * Restrict route by user role (e.g. 'admin')
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, 'Forbidden: You do not have permission to perform this administrative action.');
    }
    next();
  };
};

/**
 * Optional authentication - attaches user if token is present, continues otherwise
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.accessToken || (req.headers.authorization?.startsWith('Bearer') ? req.headers.authorization.split(' ')[1] : null);

  if (token) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key_32chars_long'
      );
      const user = await User.findById(decoded.id);
      if (user && user.isActive) {
        req.user = user;
      }
    } catch {
      // Continue unauthenticated
    }
  }
  next();
});
