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
let thirdToken = '';

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
  it('should return success and token when correct details so that token can be used', (done) => {
    chai
      .request(server)
      .post('/api/v1/auth/signup')
      .send({
        email: 'john@mail.com',
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
  it('should return error if no message is passed along is passed along', (done) => {
    chai
      .request(server)
      .post('/api/v1/messages')
      .set('Authorization', userToken)
      .send({ subject: 'Hello dear' })
      .end((err, res) => {
        expect(res.status).to.eql(400);
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
      .set('Authorization', userToken)
      .send(dummyMessage)
      .end((err, res) => {
        expect(res.status).to.eql(422);
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
          .eql('unread');
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

describe('Test get sent message route', () => {
  it('should return no content when no sent messages is found ', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/sent')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
  it('should return an array of found sent messages', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/sent')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});

describe('Test get message by id route', () => {
  it('should return error when no message is found by the provided id', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/999')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(404);
        expect(res.body.status).to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error when the user making request is not the sender or receiver of message', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/1')
      .set('Authorization', thirdToken)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body.status).to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return the found message object', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body.status).to.eql('success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('object');
        done();
      });
  });
});

describe('Test  get all unread messages route', () => {
  it('should return no unread messages found if none is found', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/unread')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
  it('should return array of unread messages if they exist ', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/unread')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});

describe('Test DELETE message by id route', () => {
  it('should return no message found if id is incorrect', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/999')
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
  it('should return error when the person requesting to delete the message is neither the sender nor receiver', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/1')
      .set('Authorization', thirdToken)
      .end((err, res) => {
        expect(res.status).to.eql(403);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return deleted successfully when the receiver is making the request', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/1')
      .set('Authorization', secondToken)
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
  it('should delete message successfully when the sender is making the request', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/1')
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
  })
});

describe('Test errors returned when database is down', () => {
  before((done) => {
    db.query('DROP TABLE IF EXISTS messages CASCADE', (err, res) => {
      done();
    });
  });
  it('should test for error on GET MESSAGE by id when database is down', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/1')
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body)
          .to.have.property('error')
          .to.eql('Internal server error');
        done();
      });
  });
  it('should test for error on login page when database is down', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/unread')
      .set('Authorization', secondToken)
      .end((err, res) => {
        expect(res.status).to.eql(500);
        expect(res.body)
          .to.have.property('status')
          .to.eql('failed');
        expect(res.body)
          .to.have.property('error')
          .to.eql('Internal server error');
        done();
      });
  });
});
