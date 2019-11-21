import chai from 'chai';
import userService from '../src/services/userService';
import mockuser from './Mock/mockuser';

const { expect } = chai;
const {
  createUser, findByEmail, findById,
  getUserRole, authenticate, getUserPermissions
} = userService;
const { newUser3, validUser } = mockuser;
describe('create user service', () => {
  it('should create a new user', async () => {
    const req = {
      body: newUser3
    };
    const { rows: { 0: user } } = await createUser(req);
    expect(newUser3.email).to.equal(user.email);
  });
});

describe('find by email service', () => {
  it('should find user with that email', async () => {
    const email = 'dan@yahoo.com';
    const user = await findByEmail(email);
    expect(email).to.equal(user.email);
  });
});

describe('find by id service', () => {
  it('should find user with that id', async () => {
    const user = await findByEmail(validUser.email);
    const foundUser = await findById(user.id);
    expect(user.id).to.equal(foundUser.id);
  });
});

describe('find role service', () => {
  it('should find user role', async () => {
    const user = await findByEmail(validUser.email);
    const { rows: { 0: { role } } } = await getUserRole(user.id);
    expect(role).to.equal('reader');
  });
});

describe('authenticate service', () => {
  it('should return true for valid credentials', async () => {
    const user = await findByEmail(validUser.email);
    const password = 'brocky';
    const valid = authenticate(password, user);
    expect(valid).to.equal(true);
  });

  it('should return false for invalid credentials', async () => {
    const user = await findByEmail('jdnvj@jfdn.com');
    const password = 'brocky';
    const valid = authenticate(password, user);
    expect(valid).to.equal(false);
  });
});

describe('permissions service', () => {
  it('should return valid permissions for a reader', async () => {
    const { id } = await findByEmail(validUser.email);
    const { rows: { 0: permissions } } = await getUserPermissions(id);
    expect(permissions).to.eql({ read: true, write: false, publish: false });
  });
});
