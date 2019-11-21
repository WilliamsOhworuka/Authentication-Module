import validator from '../helpers/validator';
import validatorError from './errorHandler';

const {
  notDuplicate, isValidEmail,
  isValidPassword, isValidPasswordSignin, isValidUsername
} = validator;

const userValidator = {
  signupValidator: [
    isValidEmail(),
    isValidUsername('firstName'),
    isValidUsername('lastName'),
    isValidPassword(),
    notDuplicate(),
    validatorError
  ],
  signinValidator: [
    isValidEmail(),
    isValidPasswordSignin(),
    validatorError
  ]
};

export default {
  userValidator
};
