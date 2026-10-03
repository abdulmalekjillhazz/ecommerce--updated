import jwt from 'jsonwebtoken';

/**
 * Generate Access Token
 */
export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET || 'fallback_access_secret_key_32chars_long',
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key_32chars_long',
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }
  );
};

/**
 * Set Auth Cookies on Express Response
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? 'none' : 'lax');

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: sameSite,
    path: '/',
  };

  // Access Token Cookie (15 min default)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  // Refresh Token Cookie (7 days default)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

/**
 * Clear Auth Cookies
 */
export const clearAuthCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (isProd ? 'none' : 'lax');

  const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: sameSite,
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};
