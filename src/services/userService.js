import bcrypt from 'bcryptjs';
import db from '../db/index';

const findByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const value = [email];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

const updateUser = async (text, values) => db.query(text, values);

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

const createUserRole = async (id) => {
  const text = 'INSERT INTO userroles(userId) VALUES($1) RETURNING *';
  const values = [id];
  return db.query(text, values);
};

const getUserRole = async (userId) => {
  const text = 'SELECT roles.name AS role FROM roles INNER JOIN userroles ON userroles.roleid = roles.id WHERE userroles.userid = $1';
  const value = [userId];
  return db.query(text, value);
};

const findById = async (id) => {
  const text = 'SELECT * FROM users WHERE id = $1';
  const value = [id];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

const authenticate = (password, user) => {
  const hashPassword = user ? user.password : null;
  return !!(!!user && bcrypt.compareSync(password, hashPassword));
};

export default {
  findByEmail, findById, createUser, updateUser, getUserRole, authenticate, createUserRole
};
