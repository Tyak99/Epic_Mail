import chai from 'chai';
import server from '../app';
import UserService from '../services/userServices';

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
    expect(newUser).to.have.property('emai');
    expect(newUser).to.have.property('password');
    done();
  });
});
