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
let thirdToken = '';

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
  it('should return success and token when correct details so that token can be used', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'joe@mail.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Champion',
      })
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.have.property('token');
        thirdToken = res.body.data.token;
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
        expect(res.status).an.eql(422);
        expect(res.body)
          .to.have.property('status')
          .eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should respond with the created group object if its created successfully', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups')
      .send({ name: 'lakers' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
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
      .send({ name: 'lakers' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(409);
        expect(res.body.status).to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Test UPDATE group name route', () => {
  it('return error when the id is not a number', (done) => {
    chai
      .request(server)
      .put('/api/v1/groups/sjsjd/name')
      .send({ name: 'Akatsuki' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body.status).to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when input name is not the allowed characters', (done) => {
    chai
      .request(server)
      .put('/api/v1/groups/1/name')
      .send({ name: '' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body.status).to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return the updated group', (done) => {
    chai
      .request(server)
      .put('/api/v1/groups/1/name')
      .send({ name: 'Akatsuki' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('name');
        done();
      });
  });
});
describe('Test GET all created groups route', () => {
  it('should return no group found when no group is found', (done) => {
    chai
      .request(server)
      .get('/api/v1/groups')
      .set('Authorization', thirdToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
  it('should return found groups as an array when group is found', (done) => {
    chai
      .request(server)
      .get('/api/v1/groups')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.be.an('array');
        done();
      });
  });
});
describe('Test add user to group route', () => {
  it('should return error when group id is not an integter', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/hhsdj/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        done();
      });
  });
  it('should return error if group user wants to add members to doesnt exist', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/999/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        done();
      });
  });
  it('should return error if  the user making the request to add new user to group is not the owner of the group', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        done();
      });
  });
  it('should return error if  the user that should be added to group is not available', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'jonbellion@mail.com' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        done();
      });
  });
  it('should return error if the admin is trying to add himeself to group', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'superuser@mail.com' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(409);
        expect(res.body).to.have.property('error');
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        done();
      });
  });
  it('should add the user to group member and return the user group details', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/1/users/')
      .send({ email: 'tunde@mail.com' })
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body)
          .to.have.property('data')
          .to.be.an('object');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('userId');
        expect(res.body.data).to.have.property('userRole');
        done();
      });
  });
});

describe('Test POST message to group route', () => {
  it('should return error when the needed details is not passed along request', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/messages')
      .send({ subject: 'Hi there' })
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when no group is found with the name', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/messages')
      .send({ subject: 'Hi there', message: 'Hey you', groupname: 'none' })
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return the posted message object when it sends messages to the group members', (done) => {
    chai
      .request(server)
      .post('/api/v1/groups/messages')
      .send({
        subject: 'Hi guys',
        message: 'I just want to thank you all for coming over',
        groupname: 'Akatsuki',
      })
      .set('Authorization', thirdToken)
      .end((err, res) => {
        // expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('subject');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('created_at');
        expect(res.body.data).to.have.property('parentmessageid');
        done();
      });
  });
});

describe('Test delete user from a group route', () => {
  it('should return error when the gorup is invalid', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/hjshsdj/users/6')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should retur error when an admin is tried to be removed from group', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/1/users/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when group isnt found by the id provided in the route parameter', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/100/users/6')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when a user that isnt an admin tries to delete user from the group', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/1/users/2')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should remove user from group when all conditions are met', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/1/users/2')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
  it('should return error when user tries to remove am member that doesnt exist in the group', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/1/users/999')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
});

describe('Test user delete group they own route', () => {
  it('should return eror when group id parameter is not an integter', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/uhww')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when no group is found', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/5')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should delete group and return successs when all conditions are met', (done) => {
    chai
      .request(server)
      .delete('/api/v1/groups/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body)
          .to.have.property('status')
          .to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
});
