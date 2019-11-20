/* eslint-disable prefer-promise-reject-errors */
import { check } from 'express-validator';
import userService from '../services/userService';

const { findByEmail } = userService;

const isValidEmail = (field = 'email') => check(field)
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage(`invalid ${field}`)
  .not()
  .isEmpty()
  .withMessage('email is a required field');

const isValidUsername = (field) => check(field)
  .trim()
  .custom((value) => {
    const regex = /^[a-z]*[-]{0,1}[a-z]+$/i;
    return regex.test(value);
  }).escape()
  .withMessage(`${field} can only contain alphabets and a dash(-)`)
  .not()
  .isEmpty()
  .withMessage(`${field} is a required field`);


const isValidPassword = (field = 'password') => check(field)
  .isLength({ min: 6 })
  .withMessage(`${field} must be at least 6 characters long`)
  .not()
  .isEmpty()
  .withMessage(`${field} is a required field`)
  .isAlphanumeric()
  .withMessage(`${field} should contain only numbers and alphabets`);

const notDuplicate = (field = 'email') => check(field)
  .trim()
  .normalizeEmail()
  .custom((value) => findByEmail(value).then((user) => {
    if (user) {
      return Promise.reject(`${field} already exists`);
    }
  }))
  .withMessage('Email already exists');

export default {
  notDuplicate,
  isValidEmail,
  isValidPassword,
  isValidUsername
};
