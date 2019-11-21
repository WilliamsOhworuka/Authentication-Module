import bcrypt from 'bcryptjs';
import database from './index';

const userText = 'INSERT INTO users(firstname, lastname, email, password, confirmed) VALUES($1, $2, $3, $4, $5)';
const userValues1 = ['Dan', 'Webstar', 'dan@yahoo.com', bcrypt.hashSync('brocky', 8), true];
const userValues2 = ['John', 'Lock', 'john@yahoo.com', bcrypt.hashSync('brocky', 8), false];
const userValues3 = ['Johnna', 'Lockdown', 'johnna@yahoo.com', bcrypt.hashSync('brocky', 8), false];
const roleText = 'INSERT INTO roles(name, read, write, publish) VALUES($1, $2, $3, $4)';
const roleValues1 = ['manager', true, true, true];
const roleValues2 = ['writer', true, true, false];
const roleValues3 = ['reader', true, false, false];
const userrolesText = 'INSERT INTO userroles(userid) VALUES($1)';
const userrolesValue1 = [1];
const userrolesValue2 = [2];
const userrolesValue3 = [3];


const seedTables = async (query, values) => {
  try {
    return await database.query(query, values);
  } catch (error) {
    return console.error('seeding tables', error);
  }
};

const seedAll = async () => {
  await seedTables(roleText, roleValues1);
  await seedTables(roleText, roleValues2);
  await seedTables(roleText, roleValues3);
  await seedTables(userText, userValues1);
  await seedTables(userText, userValues2);
  await seedTables(userText, userValues3);
  await seedTables(userrolesText, userrolesValue1);
  await seedTables(userrolesText, userrolesValue2);
  await seedTables(userrolesText, userrolesValue3);
};

seedAll();
