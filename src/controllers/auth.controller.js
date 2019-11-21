import userService from '../services/userService';
import authHelper from '../helpers/authHelper';
import sendConfrimationMail from '../services/sendMail';
import verifyToken from '../middlewares/verifyToken';

const { createUser, getUserRole, updateUser } = userService;
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
  const { params: { token }, user: { verificationtoken, confirmed, id } } = req;

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

export default { signup, confirmAccount };
