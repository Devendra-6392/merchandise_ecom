import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // Extract token from Bearer header or Cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.cookie) {
    // Parse raw cookie header if cookie-parser middleware is not used
    const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) {
      token = match[1];
    }
  }

  if (!token || token === 'none') {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_merchandise_2026');
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User no longer exists.' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token validation failed.' });
  }
};

export const optionalAuth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) {
      token = match[1];
    }
  }

  if (token && token !== 'none') {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_merchandise_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Ignore token verification failure for optional auth
    }
  }

  return next();
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin role required.' });
};
