import bcrypt from 'bcryptjs';
import db from '../db/index';

/**
   * Find user by email
   * @param {String} email - user email
   * @returns {Object} - user object
   */

const findByEmail = async (email) => {
  const text = 'SELECT * FROM users WHERE email = $1';
  const value = [email];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

const updateUser = async (text, values) => db.query(text, values);

/**
   * Create user
   * @param {Object} req - request object
   * @returns {Object} - response constaining user object
   */

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

/**
   * Create user role
   * @param {Number} id - user id
   * @returns {Object} - response constaining role object
   */

const createUserRole = async (id) => {
  const text = 'INSERT INTO userroles(userId) VALUES($1) RETURNING *';
  const values = [id];
  return db.query(text, values);
};

/**
   * Get user role
   * @param {Number} id - user id
   * @returns {Object} - response constaining user roles
   */

const getUserRole = async (userId) => {
  const text = 'SELECT roles.name AS role FROM roles INNER JOIN userroles ON userroles.roleid = roles.id WHERE userroles.userid = $1';
  const value = [userId];
  return db.query(text, value);
};

/**
   * Find user by id
   * @param {Number} id - user id
   * @returns {Object} - user object
   */

const findById = async (id) => {
  const text = 'SELECT * FROM users WHERE id = $1';
  const value = [id];
  const { rows: { 0: user } } = await db.query(text, value);
  return user;
};

/**
   * Check user credentials email/password
   * @param {String} password - password from req
   * @param {Object} user - user object
   * @returns {Boolean} - valid credentials?
   */

const authenticate = (password, user) => {
  const hashPassword = user ? user.password : null;
  return !!(!!user && bcrypt.compareSync(password, hashPassword));
};

/**
   * Get user permissions
   * @param {Number} id - user id
   * @returns {Object} - constain user roles
   */

const getUserPermissions = (id) => {
  const text = `SELECT roles.read, roles.write, roles.publish
                FROM roles 
                INNER JOIN userroles ON roles.id = userroles.roleid 
                INNER JOIN users ON users.id = userroles.userid
                WHERE users.id = $1`;
  const values = [id];
  return db.query(text, values);
};

export default {
  findByEmail,
  findById,
  createUser,
  updateUser,
  getUserRole,
  authenticate,
  createUserRole,
  getUserPermissions,
};
