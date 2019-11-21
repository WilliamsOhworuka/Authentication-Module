import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import userService from '../services/userService';

dotenv.config();
const { findById } = userService;
export default (req, res, next) => {
  const token = req.headers.authorization || req.query.token || req.params.token;
  jwt.verify(token, process.env.my_secret, async (error, decoded) => {
    if (error) {
      const message = (error.name === 'TokenExpiredError') ? 'token expired' : 'invalid token';
      return res.status(401).json({
        error: message,
      });
    }
    try {
      const user = await findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          error: 'user not found',
        });
      }
      req.user = user;
      return next();
    } catch (err) {
      return res.status(500).json({
        error: err.message,
      });
    }
  });
};
