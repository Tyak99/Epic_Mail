import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import db from '../db/index';

const { expect } = chai;
chai.use(chaiHttp);

before((done) => {
  db.query('DROP TABLE IF EXISTS groupmembers', (err, res) => {
    console.log('DROP TABLE GROUPMEMBERS');

    done();
  });
});

before((done) => {
  db.query('DROP TABLE IF EXISTS groups', (err, res) => {
    done();
  });
});

before((done) => {
  db.query(
    `CREATE TABLE groups (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL UNIQUE
)`,
    (err, res) => {
      console.log('CREATE TABLE GROUPS');
      done();
    }
  );
});

before((done) => {
  db.query(
    `CREATE TABLE groupmembers (
    groupid INT REFERENCES groups(id) ON DELETE CASCADE,
    memberid INT NOT NULL,
    userrole varchar(255) NOT NULL
)`,
    (err, res) => {
      console.log('CREATE TABLE GROUPMEMBERS');
      done();
    }
  );
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
  it('should return error when needed details arent passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({})
      .end((err, res) => {
        expect(res.body.status).an.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql('Please input group name');
        done();
      });
  });
  it('should return error when group name input is less than 4', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'Te' })
      .end((err, res) => {
        expect(res.body.status).an.eql(400);
        expect(res.body).to.have.property('error');
        expect(res.body.error).to.eql(
          'Group name must be upto 4 letters long and contain only letters and numbers'
        );
        done();
      });
  });
  it('should respond with the created group object if its created successfully', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'team1' })
      .end((err, res) => {
        expect(res.body.status).to.eql(201);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('name');
        done();
      });
  });
  it('should return error when group name aready exists in database', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'team1' })
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        done();
      });
  });
});