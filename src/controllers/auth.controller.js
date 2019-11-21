import userService from '../services/userService';
import authHelper from '../helpers/authHelper';
import sendConfrimationMail from '../services/sendMail';

const {
  createUser, getUserRole, updateUser,
  authenticate, findByEmail, createUserRole,
  getUserPermissions
} = userService;
const { createToken } = authHelper;

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const signup = async (req, res) => {
  try {
    const { rows: { 0: user } } = await createUser(req);
    await createUserRole(user.id);
    const { rows: { 0: { role } } } = await getUserRole(user.id);

    await sendConfrimationMail({ id: user.id, firstname: user.firstname, email: user.email });
    return res.status(201).json({
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      error: error.message,
    });
  }
};

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const confirmAccount = async (req, res) => {
  const { query: { token }, user: { verificationtoken, confirmed, id } } = req;

  if (verificationtoken !== token) {
    return res.status(403).json({
      error: 'Sorry could not verify email'
    });
  }

  if (confirmed) {
    return res.status(400).json({
      error: 'user already verified'
    });
  }

  const text = `UPDATE users
                SET confirmed = $1    
                WHERE id = $2`;
  const values = [true, id];

  try {
    await updateUser(text, values);
    res.status(200).json({
      message: 'Account confirmed'
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const signin = async (req, res) => {
  const { body: { password, email } } = req;
  try {
    const user = await findByEmail(email);
    const valid = authenticate(password, user);

    if (valid && user.confirmed) {
      const token = createToken(user);
      const { rows: { 0: { role } } } = await getUserRole(user.id);
      return res.status(200).json({
        token,
        data: {
          ...user, role, password: undefined, verificationtoken: undefined
        },
      });
    }

    const message = user && !user.confirmed ? 'please confirm account to signin' : 'invalid email or password';

    return res.status(401).json({
      error: message
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

/**
 *
 *
 * @param {object} request
 * @param {object} response
 * @returns {json} - json
 */

const getPermissions = async (req, res) => {
  const { user: { id } } = req;
  try {
    const { rows } = await getUserPermissions(id);
    return res.status(200).json({
      data: rows
    });
  } catch (error) {
    return res.status(500).json({
      data: error.message
    });
  }
};

export default {
  signup, confirmAccount, getPermissions, signin
};
