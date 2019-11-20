import { validationResult } from 'express-validator';

/**
   *This middleware handles validator errors and send a response to the user on error
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   * @return {Object} - Express response object
   */
const validatorError = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).send({
      errors: errors.array(),
    });
  }
  next();
};

export default validatorError;
