import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

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
