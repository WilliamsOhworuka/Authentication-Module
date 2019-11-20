import express from 'express';
import Auth from '../controllers/auth.controller';
import authValidator from '../middlewares/auth.validate';

const router = express.Router();
const { userValidator: { signupValidator } } = authValidator;
const { signup } = Auth;

router.post('/signup', signupValidator, signup);

export default router;
