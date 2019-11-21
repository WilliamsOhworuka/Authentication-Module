import express from 'express';
import Auth from '../controllers/auth.controller';
import middlewares from '../middlewares';

const router = express.Router();
const { signup, confirmAccount, signin } = Auth;
const {
  authValidator: { userValidator: { signupValidator, signinValidator } },
  verifyToken
} = middlewares;

router.post('/signup', signupValidator, signup);
router.post('/auth', signinValidator, signin);
router.patch('/confirm', verifyToken, confirmAccount);

export default router;
