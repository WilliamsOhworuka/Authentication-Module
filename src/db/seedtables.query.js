import bcrypt from 'bcryptjs';
import database from './index';

const userText = 'INSERT INTO users(firstname, lastname, email, role, password) VALUES($1, $2, $3, $4, $5)';
const userValues1 = ['Dan', 'Webstar', 'dan@yahoo.com', 1, bcrypt.hashSync('brocky', 8)];
const userValues2 = ['John', 'Lock', 'john@yahoo.com', 2, bcrypt.hashSync('brocky', 8)];
const userValues3 = ['Johnna', 'Lockdown', 'johnna@yahoo.com', 3, bcrypt.hashSync('brocky', 8)];
const roleText = 'INSERT INTO roles(name, read, write, publish) VALUES($1, $2, $3, $4)';
const roleValues1 = ['manager', true, true, true];
const roleValues2 = ['writer', true, true, false];
const roleValues3 = ['reader', true, false, false];

const seedTables = async (query, values) => {
  try {
    return await database.query(query, values);
  } catch (error) {
    return console.error('seeding tables', error);
  }
};

seedTables(roleText, roleValues1)
  .then((res) => {
    seedTables(roleText, roleValues2);
    seedTables(roleText, roleValues3);
  }).then((res) => {
    seedTables(userText, userValues1);
    seedTables(userText, userValues2);
    seedTables(userText, userValues3);
  });
