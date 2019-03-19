import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import db from '../database/index';

const { expect } = chai;
chai.use(chaiHttp);

before((done) => {
  db.query('DROP TABLE IF EXISTS groupmembers', (err, res) => {
    done();
  });
});

before((done) => {
  db.query('DROP TABLE IF EXISTS groups CASCADE', (err, res) => {
    done();
  });
});
before((done) => {
  db.query(
    `CREATE TABLE groups (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    adminid INT REFERENCES users(id) ON DELETE CASCADE
)`,
    (err, res) => {
      done();
    }
  );
});

before((done) => {
  db.query(
    `CREATE TABLE groupmembers (
    groupid INT REFERENCES groups(id) ON DELETE CASCADE,
    memberid INT REFERENCES users(id) ON DELETE CASCADE,
    userrole VARCHAR(180) NOT NULL
)`,
    (err, res) => {
      done();
    }
  );
});

let userToken = '';
let secondToken = '';

describe('Test signup a new user', () => {
  it('should return success and token when correct details so that token can be used', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/login')
      .send({ email: 'superuser@mail.com', password: 'secret' })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.have.property('token');
        userToken = res.body.data.token;
        done();
      });
  });
  it('should return success and token when correct details so that token can be used', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'tunde@mail.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Champion',
      })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.have.property('token');
        secondToken = res.body.data.token;
        done();
      });
  });
});

describe('Test create a group route', () => {
  it('should return 404 on wrong api call', (done) => {
    chai
      .request(server)
      .post('/api/v1/wrongapi')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return error when needed details are not passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({})
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).an.eql(400);
        expect(res.body)
          .to.have.property('status')
          .eql('Failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should respond with the created group object if its created successfully', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'Lakers' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('name');
        expect(res.body.data).to.have.property('role');
        done();
      });
  });
  it('should respond error when group name already exists', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'Lakers' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(409);
        expect(res.body.status).to.eql('Failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Test add user to group route', () => {
  it('should return error if group user wants to add members to doesnt exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/wrongid/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authroization', userToken)
      .send((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        done();
      });
  });
  it('should return error if  the user making the request to add new user to group is not the owner of the group', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/wrongid/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authroization', secondToken)
      .send((err, res) => {
        expect(res.status).to.eql(401);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        done();
      });
  });
  it('should return error if  the user that should be added to group is not available', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authroization', userToken)
      .send((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('Failed');
        done();
      });
  });
  it('should add the user to group member and return the user group details', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'tunde@mail.com' })
      .set('Authroization', userToken)
      .send((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('userId');
        expect(res.body).to.have.property('userRole');
        done();
      });
  });
});
