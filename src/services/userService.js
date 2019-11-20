import db from '../db/index';

const findByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const value = [email];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

export default { findByEmail };
