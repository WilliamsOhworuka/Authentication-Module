/* eslint-disable prefer-promise-reject-errors */
import { check } from 'express-validator';
import userService from '../services/userService';

const { findByEmail } = userService;

/**
   * Validate email
   * @param {String} field - email property from request body
   */

const isValidEmail = (field = 'email') => check(field)
  .trim()
  .normalizeEmail()
  .isEmail()
  .withMessage(`invalid ${field}`)
  .not()
  .isEmpty()
  .withMessage('email is a required field');

/**
   * Validate user firstname and lastname
   * @param {String} field - firstname and lastname property from request body
   */

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

/**
   * Validate user password
   * @param {String} field - password property from request body
   */

const isValidPassword = (field = 'password') => check(field)
  .isLength({ min: 6 })
  .withMessage(`${field} must be at least 6 characters long`)
  .not()
  .isEmpty()
  .withMessage(`${field} is a required field`)
  .isAlphanumeric()
  .withMessage(`${field} should contain only numbers and alphabets`);

/**
   * Validate user Password during signin
   * @param {String} field -  Password property from request body
   */

const isValidPasswordSignin = (field = 'password') => check(field)
  .isLength({ min: 6 })
  .withMessage('invalid email or password')
  .not()
  .isEmpty()
  .withMessage(`${field} is a required field`);

/**
   * Validate email
   * @param {String} field -  email property from request body
   */

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
  isValidPasswordSignin,
  isValidUsername
};
