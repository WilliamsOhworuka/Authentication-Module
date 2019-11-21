import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userService from '../services/userService';

dotenv.config();
const { findById } = userService;

/**
   * Verifies token from request
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @return {Object} - Express response object
   */

export default async (req, res, next) => {
  const token = req.headers.authorization || req.query.token || req.params.token;
  let verified;
  jwt.verify(token, process.env.my_secret, async (error, decoded) => {
    if (error) {
      verified = error;
    } else {
      verified = decoded;
    }
  });

  if (verified instanceof Error) {
    const message = (verified.name === 'TokenExpiredError') ? 'token expired' : 'invalid token';
    return res.status(401).json({
      error: message,
    });
  }

  try {
    const user = await findById(verified.id);
    if (!user) {
      return res.status(404).json({
        error: 'user not found',
      });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
