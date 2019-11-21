import userService from '../services/userService';
import authHelper from '../helpers/authHelper';
import sendConfrimationMail from '../services/sendMail';

const { createUser, getUserRole } = userService;
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

export default { signup };
