import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '../utils/generateTokens.js';

/**
 * Register User
 * POST /api/v1/auth/register
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Please provide name, email, and password.');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(400, 'An account with this email address already exists.');
  }

  // Prevent arbitrary unauthorized admin registration; only allow if explicitly created or default to customer
  const assignedRole = role === 'admin' ? 'admin' : 'customer';

  const user = await User.create({
    name,
    email,
    password,
    phone: phone || '',
    role: assignedRole,
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user,
        accessToken, // also returned in payload for mobile/cross-origin clients
      },
      'User registered successfully'
    )
  );
});

/**
 * Login User
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Please provide both email and password.');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password +refreshToken');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Please contact support.');
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save();

  setAuthCookies(res, accessToken, refreshToken);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: user.toJSON(),
        accessToken,
      },
      'Logged in successfully'
    )
  );
});

/**
 * Logout User
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  }

  clearAuthCookies(res);

  return res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

/**
 * Get Current Authenticated User Profile
 * GET /api/v1/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, 'Profile retrieved successfully'));
});

/**
 * Refresh Access & Refresh Tokens
 * POST /api/v1/auth/refresh-token
 */
export const refreshTokens = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    throw new ApiError(401, 'No refresh token provided. Please log in again.');
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_32chars_long'
    );

    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      clearAuthCookies(res);
      throw new ApiError(401, 'Refresh token is expired or has been revoked.');
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    user.refreshToken = newRefreshToken;
    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          accessToken: newAccessToken,
          user: user.toJSON(),
        },
        'Tokens refreshed successfully'
      )
    );
  } catch (err) {
    clearAuthCookies(res);
    throw new ApiError(401, 'Invalid or expired refresh token. Please sign in again.');
  }
});

/**
 * Update Profile
 * PUT /api/v1/auth/profile
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar, addresses } = req.body;
  const user = req.user;

  if (name) user.name = name;
  if (phone !== undefined) user.phone = phone;
  if (avatar) user.avatar = avatar;
  if (addresses) user.addresses = addresses;

  await user.save();

  return res.status(200).json(new ApiResponse(200, user, 'Profile updated successfully'));
});
