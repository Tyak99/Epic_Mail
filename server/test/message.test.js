import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import db from '../database/index';

const { expect } = chai;
chai.use(chaiHttp);

before((done) => {
  db.query('DROP TABLE IF EXISTS messages', (err, res) => {
    done();
  });
});

before((done) => {
  db.query(
    `CREATE TABLE messages (
      id serial PRIMARY KEY,
      message TEXT NOT NULL,
      subject TEXT NOT NULL,
      status VARCHAR(255) NOT NULL,
      senderid INT REFERENCES users(id) ON DELETE CASCADE,
      receiverid INT REFERENCES users(id) ON DELETE CASCADE,
      parentmessageid INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      receiverdeleted iNT DEFAULT 0
    )`,
    (err, res) => {
      done();
    }
  );
});

let userToken = '';
let secondToken = '';

describe('Login a user in the message test', () => {
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
      .post('/api/v1/auth/login')
      .send({
        email: 'tunde@mail.com',
        password: 'secret',
        firstName: 'John',
        lastName: 'Champion',
      })
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body.data).to.have.property('token');
        secondToken = res.body.data.token;
        done();
      });
  });
});

describe('Test post a message route', () => {
  it('should return error 404 on wrong api call', (done) => {
    chai
      .request(server)
      .post('/api/v1/wrong')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return error if no data is passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/messages')
      .set('Authorizatioin', userToken)
      .send({})
      .end((err, res) => {
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error if all the required fields arent passed along', (done) => {
    const dummyMessage = {
      message: 'Thanks for coming',
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .set('Authorizatioin', userToken)
      .send(dummyMessage)
      .end((err, res) => {
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when the input subject is less than 2 characters', (done) => {
    const dummyMessage = {
      subject: 'H',
      message: 'Thanks for coming',
      emailTo: 'tunde@mail.com',
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .send(dummyMessage)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(422);
        expect(res.body).to.have.property('error');
        expect(res.body.status).to.eql('failed');
        done();
      });
  });
  it('should return error when the email user wants to send to cant be found', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      emailTo: 'jon@mail.com',
      senderId: 2,
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .send(dummyMessage)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('sould create message as draft when emailTo isnt passed along', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .send(dummyMessage)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('subject');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('created_at');
        expect(res.body.data)
          .to.have.property('status')
          .eql('draft');
        done();
      });
  });
  it('should send a message to an inidividual when emailTo is passed along', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      emailTo: 'tunde@mail.com',
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .send(dummyMessage)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(201);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('subject');
        expect(res.body.data).to.have.property('created_at');
        expect(res.body.data)
          .to.have.property('status')
          .eql('sent');
        done();
      });
  });
});


describe('Test get received emails route', () => {
  it('should return no content when no received mesage is found', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
  it('should return the found array of received messages', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});