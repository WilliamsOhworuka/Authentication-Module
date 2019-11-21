import userService from '../services/userService';
import authHelper from '../helpers/authHelper';
import sendConfrimationMail from '../services/sendMail';

const {
  createUser, getUserRole, updateUser, authenticate, findByEmail
} = userService;
const { createToken } = authHelper;

const signup = async (req, res) => {
  try {
    const { rows: { 0: user } } = await createUser(req);
    const { rows: { 0: { role } } } = await getUserRole(user.email);

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
                WHERE id=$2`;
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

const signin = async (req, res) => {
  const { body: { password, email } } = req;
  try {
    const user = await findByEmail(email);
    const valid = authenticate(password, user);
    // delete user.password;
    // delete user.verificationtoken;

    if (valid && user.confirmed) {
      const token = await createToken(user);
      const { rows: { 0: { role } } } = await getUserRole(email);
      return res.status(200).json({
        token,
        data: {
          ...user, role, password: undefined, verificationtoken: undefined
        },
      });
    }
    const message = !user.confirmed ? 'please confirm account to signin' : 'invalid email or password';
    res.status(401).json({
      error: message
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

export default { signup, confirmAccount, signin };
