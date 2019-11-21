const validUser = {
  email: 'dan@yahoo.com',
  password: 'brocky'
};

const invalidUser = {
  id: 100,
  role: 3
};

const newUser = {
  password: 'brocky',
  email: 'samm@yahoo.com',
  firstName: 'williams',
  lastName: 'john'
};


const newUser2 = {
  password: 'brocky',
  email: 'jamm@yahoo.com',
  firstName: 'williams',
  lastName: 'john'
};

const newUser3 = {
  password: 'brocky',
  email: 'jammsh@yahoo.com',
  firstName: 'williams',
  lastName: 'john'
};

const unConfirmed = {
  email: 'john@yahoo.com',
  password: 'brocky'
};

const invalidCredentials = {
  email: 'asdhbfh@dd.com',
  password: 'nds vvsdv'
};

export default {
  validUser, invalidUser, newUser3, invalidCredentials, newUser, unConfirmed, newUser2
};
