import bcrypt from 'bcryptjs';
import db from '../db/index';

const findByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const value = [email];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

const updateUser = async (id, text, values) => db.query(text, values);

const createUser = async (req) => {
  const hashPassword = bcrypt.hashSync(req.body.password, 8);
  const text = 'INSERT INTO users(firstName, lastName, email, password) VALUES($1, $2, $3, $4) RETURNING *';
  const values = [
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    hashPassword,
  ];
  return db.query(text, values);
};

const getUserRole = async (email) => {
  const text = 'SELECT roles.name AS role FROM users INNER JOIN roles ON users.role = roles.id WHERE email = $1';
  const value = [email];
  return db.query(text, value);
};

export default {
  findByEmail, createUser, updateUser, getUserRole
};
