import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../app';
import UserService from '../services/userServices';

chai.use(chaiHttp);
const userServices = new UserService();
const { expect } = chai;

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
