import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../app';
import UserService from '../services/userServices';
import tokenFunction from '../utils/tokenHandler';

chai.use(chaiHttp);
const userServices = new UserService();
const { expect } = chai;

describe('Test token generator function', () => {
  it('should generate a unique token when user id is passed', (done) => {
    const user = {
      id: 1,
      email: 'tunde@mail.com',
      password: 'secret',
    };
    const token = tokenFunction(user);
    expect(token).to.be.a('string');
    done();
  });
});

describe('Test user signup services', () => {
  it('should return a user object when email,password,firstName,lastName is passed along', (done) => {
    const user = {
      firstName: 'Tunde',
      lastName: 'Nasri',
      email: 'tunde@mail.com',
      password: 'secret',
    };
    const newUser = userServices.createUser(user);
    expect(newUser).to.be.an('object');
    expect(newUser).to.have.property('id');
    expect(newUser).to.have.property('firstName');
    expect(newUser).to.have.property('lastName');
    expect(newUser).to.have.property('email');
    expect(newUser).to.have.property('password');
    done();
  });
});

describe('Test user signup route', () => {
  it('should return 404 on wrong api call', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return email already in use, if the email exists', (done) => {
    const user = {
      firstName: 'Tunde',
      lastName: 'Nasri',
      email: 'superuser@mail.com',
      password: 'secret',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should post the user and return the user object, when correct details are passed along request', (done) => {
    const user = {
      firstName: 'Tunde',
      lastName: 'Nasri',
      email: 'tunde@mail.com',
      password: 'secret',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.body.status).to.eql(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('name');
        done();
      });
  });
});

describe('Test user sign in service method', () => {
  it('should return error if emails dont match', (done) => {
    const data = {
      email: 'tunde@mail.com',
      password: 'secret',
    };
    const logInUser = userServices.loginUser(data);

    expect(logInUser).to.eql('Email already in use');
    done();
  });
  it('should return error if password dont match', (done) => {
    const data = {
      email: 'superuser@mail.com',
      password: 'baseball',
    };
    const logInUser = userServices.loginUser(data);
    expect(logInUser).to.eql('Invalid password');
    done();
  });
  it('should return a user object when passed email and password', (done) => {
    const user = {
      email: 'superuser@mail.com',
      password: 'secret',
    };
    const loggedInUser = userServices.loginUser(user);
    expect(loggedInUser).to.be.an('object');
    expect(loggedInUser).to.have.property('id');
    expect(loggedInUser).to.have.property('firstName');
    expect(loggedInUser).to.have.property('lastName');
    expect(loggedInUser).to.have.property('email');
    expect(loggedInUser).to.have.property('password');
    done();
  });
});

describe('Test user sign in route', () => {
  it('should return error when no email or password is avalilable', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({})
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error if wrong email or password is passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'tunde@mail.com', password: 'secret' })
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });

    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'superuser@mail.com', password: 'baseball' })
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
      });
  });
  it('should return success and token when correct details are passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'superuser@mail.com', password: 'secret' })
      .end((err, res) => {
        expect(res.body.status).to.eql(200);
        expect(res.body.data).to.have.property('token');
        done();
      });
  });
});
