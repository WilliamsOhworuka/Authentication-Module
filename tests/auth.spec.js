import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import app from '../src/app';
import middleware from '../src/middlewares';
import mockuser from './Mock/mockuser';
import authHelper from '../src/helpers/authHelper';
import authController from '../src/controllers/auth.controller';
import userService from '../src/services/userService';


chai.use(chaiHttp);
const { expect } = chai;
const { createToken } = authHelper;
const { findById } = userService;
const {
  validUser, invalidUser, newUser2, invalidCredentials, newUser, unConfirmed
} = mockuser;
const { signup, signin, confirmAccount } = authController;
const { verifyToken } = middleware;
const LOGIN_URL = '/v1/user/auth';
const SIGNUP_URL = '/v1/user/signup';
describe('VerifyToken', () => {
  let authToken;
  before((done) => {
    chai.request(app)
      .post(LOGIN_URL)
      .send(validUser)
      .end((error, response) => {
        const { token } = response.body;
        authToken = token;
        done();
      });
  });
  it('should call next() if token is valid', async () => {
    const req = {
      query: { token: authToken },
      headers: {}
    };
    const res = {
      status() {},
      json() {}
    };
    const next = sinon.spy();
    await verifyToken(req, res, next);
    sinon.assert.calledOnce(next);
  });

  it('req should not contain user if token is invalid', async () => {
    const req = {
      query: { token: 'smf ewjnfvewg.er.grthernvjdsnvds' },
      headers: {}
    };

    const json = () => {};
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const next = sinon.spy();
    await verifyToken(req, res, next);
    expect(req).to.not.have.property('user');
  });


  it('should return error if token is invalid', async () => {
    const req = {
      query: { token: 'smf ewjnfvewg.er.grthernvjdsnvds' },
      headers: {}
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const next = sinon.spy();
    const error = await verifyToken(req, res, next);
    expect(error).to.equal('invalid token');
  });
  it('should return error if user does not exist', async () => {
    const token = createToken(invalidUser);
    const req = {
      query: { token },
      headers: {}
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const next = sinon.spy();
    const error = await verifyToken(req, res, next);
    expect(error).to.equal('user not found');
  });
});

describe('signup/signin', () => {
  it('signup response should contain newly created user email ', async () => {
    const req = {
      body: newUser
    };

    const json = (value) => value.email;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await signup(req, res);
    expect(response).to.equal(newUser.email);
  });

  it('signin response should contain valid user email if user is confirmed', async () => {
    const req = {
      body: validUser
    };

    const json = (value) => value.data.email;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await signin(req, res);
    expect(response).to.equal(validUser.email);
  });
  it('signin response should contain error if user is not confirmed', async () => {
    const req = {
      body: unConfirmed
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await signin(req, res);
    expect(response).to.equal('please confirm account to signin');
  });

  it('signin response should contain error for invalid credentials', async () => {
    const req = {
      body: invalidCredentials
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await signin(req, res);
    expect(response).to.equal('invalid email or password');
  });
});

describe('confirm account', () => {
  let userId;
  before((done) => {
    chai.request(app)
      .post(SIGNUP_URL)
      .send(newUser2)
      .end((error, response) => {
        const { id } = response.body;
        userId = id;
        done();
      });
  });
  it(' should update user account confirmation status if user is not confirmed', async () => {
    const user = await findById(userId);
    const req = {
      user,
      query: { token: user.verificationtoken }
    };

    const json = () => {};
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    await confirmAccount(req, res);
    const { confirmed } = await findById(userId);
    expect(confirmed).to.equal(true);
  });

  it(' should update user account confirmation status if user is not confirmed', async () => {
    const user = await findById(userId);
    const req = {
      user,
      query: { token: user.verificationtoken }
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await confirmAccount(req, res);
    expect(response).to.equal('user already verified');
  });


  it(' should update user account confirmation status if user is not confirmed', async () => {
    const user = await findById(userId);
    const req = {
      user,
      query: { token: 'asejfvbewjs.sffgewnsvsde.f.we' }
    };

    const json = (value) => value.error;
    const res = {
      status() {
        return {
          json,
        };
      },
    };
    const response = await confirmAccount(req, res);
    expect(response).to.equal('Sorry could not verify email');
  });
});
