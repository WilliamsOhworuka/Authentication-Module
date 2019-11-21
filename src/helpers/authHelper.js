import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
   * Creates Token from user data
   * @param {Object} user - user object
   * @returns {String} - signed token
   */

const createToken = (user) => jwt.sign(
  {
    id: user.id,
    role: user.role,
  },
  process.env.my_secret,
  { expiresIn: '7 days' }
);

export default {
  createToken
};
