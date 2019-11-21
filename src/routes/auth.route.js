import express from 'express';
import Auth from '../controllers/auth.controller';
import middlewares from '../middlewares';

const router = express.Router();
const { signup, confirmAccount } = Auth;
const { authValidator: { userValidator: { signupValidator } }, verifyToken } = middlewares;

router.post('/signup', signupValidator, signup);
router.patch('/confirm/:token', verifyToken, confirmAccount);

export default router;
