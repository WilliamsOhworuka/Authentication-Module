import validator from '../helpers/validator';
import validatorError from './errorHandler';

const {
  notDuplicate, isValidEmail,
  isValidPassword, isValidUsername
} = validator;

const userValidator = {
  signupValidator: [
    isValidEmail(),
    isValidUsername('firstName'),
    isValidUsername('lastName'),
    isValidPassword(),
    notDuplicate(),
    validatorError
  ]
};

export default {
  userValidator
};
