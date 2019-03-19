import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../database/index';

import server from '../app';
import tokenHandler from '../utils/tokenHandler';

chai.use(chaiHttp);
const { expect } = chai;

before((done) => {
  db.query('DROP TABLE IF EXISTS users CASCADE', (err, res) => {
    done();
  });
});
before((done) => {
  db.query(
    `CREATE TABLE users (
    id serial PRIMARY KEY,
    email varchar(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName varchar(255) NOT NULL,
    lastName varchar(255) NOT NULL
)`,
    (err, res) => done()
  );
});

describe('Test token generator function', () => {
  let newToken = '';
  it('should generate a unique token when user id is passed', (done) => {
    const user = {
      id: 1,
      email: 'tunde@mail.com',
      password: 'secret',
    };
    const token = tokenHandler.generateToken(user);
    newToken = token;
    expect(token).to.be.a('string');
    expect(token).to.have.lengthOf.above(10);
    done();
  });
  it('should return error when token isnt passed to request header', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'guySensei' })
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when token is not a valid token', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'guySensei' })
      .set('Authorization', 'hhjshdhjsjhd')
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when token is validated but user does not exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'guySensei' })
      .set('Authorization', newToken)
      .end((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('error');
        done();
      });
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
  it('should return error if a correct email is not passed to email body', (done) => {
    const user = {
      email: 'john',
      password: 'secret',
      firstName: 'John',
      lastName: 'Snow',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('A valid email is required');
        done();
      });
  });
  it('should return error if password isnt upto six caharacters long', (done) => {
    const user = {
      email: 'john@mail.com',
      password: 'secr',
      firstName: 'John',
      lastName: 'Snow',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Please enter a password with only text and numbers and at least 6 characters long'
        );
        done();
      });
  });
  it('should return error when characters different from text and numbers are passed in password', (done) => {
    const user = {
      email: 'john@mail.com',
      password: '$%^&&',
      firstName: 'John',
      lastName: 'Snow',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Please enter a password with only text and numbers and at least 6 characters long'
        );
        done();
      });
  });
  it('should return error if lastName is not present ', (done) => {
    const user = {
      firstName: 'Tunde',
      email: 'tunde@mail.com',
      password: 'secret',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body.error).to.eql(
          'Last name with at least 2 characters long is required'
        );
        done();
      });
  });
  it('should return error if firstName is not present ', (done) => {
    const user = {
      lastName: 'Nasri',
      email: 'tunde@mail.com',
      password: 'secret',
    };
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body.error).to.eql(
          'First name with at least 2 characters long is required'
        );
        done();
      });
  });
  it('should post the user and return the user object, when correct details are passed along request', (done) => {
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
        expect(res.status).to.eql(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('name');
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
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('Failed');
        expect(res.body.error).to.eql('Email already in use');
        done();
      });
  });
});

describe('Test user sign in route', () => {
  it('should return error when no email or password is avalilable', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({})
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body.error).to.eql(
          'Please input login details email and password'
        );
        done();
      });
  });
  it('should return error if a correct email isnt passed to email body', (done) => {
    const user = {
      email: 'john',
      password: 'secret',
    };
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send(user)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body.error).to.eql('Please enter a valid email');
        done();
      });
  });
  it('should return error if wrong email or password is passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'john@mail.com', password: 'secret' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body.error).to.eql('Invalid email or password');
        done();
      });

    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'superuser@mail.com', password: 'baseball' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('Invalid email or password');
      });
  });
  it('should return success and token when correct details are passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'superuser@mail.com', password: 'secret' })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data).to.have.property('name');
        done();
      });
  });
});

// describe('Test errors returned when database is down', () => {
//   before((done) => {
//     db.query('DROP TABLE IF EXISTS users', (err, res) => { done()});
//   });
//   it('should test for error on signup when database is down', (done) => {
//     chai
//       .request(server)
//       .post('/api/v1/auth/signup')
//       .send({ email: 'superuser@mail.com', password: 'secret', firstName: 'Tunde', lastName: 'Nasri' })
//       .end((err, res) => {
//         expect(res.status).to.eql(500);
//         expect(res.body).to.have.property('status').to.eql('Failed');
//         expect(res.body).to.have.property('error').to.eql('Internal server error');
//         done();
//       });
//   });
//   it('should test for error on login page when database is down', (done) => {
//     chai
//       .request(server)
//       .post('/api/v1/auth/login')
//       .send({ email: 'superuser@mail.com', password: 'secret'})
//       .end((err, res) => {
//         expect(res.status).to.eql(500);
//         expect(res.body).to.have.property('status').to.eql('Failed');
//         expect(res.body).to.have.property('error').to.eql('Internal server error');
//         done();
//       });
//   })
// });
