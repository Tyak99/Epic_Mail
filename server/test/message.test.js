import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import db from '../database/index';

import MessageService from '../services/messageServices';

const { expect } = chai;
chai.use(chaiHttp);
const messageServices = new MessageService();

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
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

describe('Test that an array exists in all message service method', () => {
  it('should return an array when allmessage methis is called', (done) => {
    const GetAllMessage = messageServices.AllMessage();
    expect(GetAllMessage).to.be.an('array');
    expect(GetAllMessage[0]).to.have.property('id');
    expect(GetAllMessage[0]).to.have.property('subject');
    expect(GetAllMessage[0]).to.have.property('message');
    expect(GetAllMessage[0]).to.have.property('createdOn');
    expect(GetAllMessage[0]).to.have.property('status');
    done();
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

describe('Test get sent emails method', () => {
  it('should test get sent emails method ', (done) => {
    const sentMessages = messageServices.getSentMessages();
    expect(sentMessages).to.be.an('array');
    sentMessages.forEach((message) => {
      expect(message).to.have.property('id');
      expect(message).to.have.property('subject');
      expect(message).to.have.property('message');
      expect(message).to.have.property('receiverId');
      expect(message).to.have.property('senderId');
      expect(message).to.have.property('status');
      done();
    });
  });
});

describe('Test get sent messages route', () => {
  it('should return error 404 on wrong api call', (done) => {
    chai
      .request(server)
      .get('/wrongapi')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return an array of sent messages', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/sent')
      .end((err, res) => {
        expect(res.body.status).to.eql(200);
        expect(res.body.data).to.be.an('array');
        done();
      });
  });
});

describe('Test get email by id service method', () => {
  it('it should return an email that correspond with the given id', (done) => {
    const message = messageServices.getMessageById(1);
    expect(message).to.be.an('object');
    expect(message).to.have.property('id');
    expect(message).to.have.property('subject');
    expect(message).to.have.property('message');
    done();
  });
  it('should return error when no id is passed along the request', (done) => {
    const message = messageServices.getMessageById();
    expect(message).to.be.eql('error');
    done();
  });
});

describe('Test get email by id route', () => {
  it('should return error when no email is found with the provided id', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/:id')
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return a message object when message is found', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages/1')
      .end((err, res) => {
        expect(res.body.status).to.eql(200);
        expect(res.body.data).to.be.an('object');
        expect(res.body.data).to.has.property('id');
        expect(res.body.data).to.has.property('message');
        expect(res.body.data).to.has.property('subject');
        expect(res.body.data).to.has.property('createdOn');
        expect(res.body.data).to.has.property('senderId');
        expect(res.body.data).to.has.property('receiverId');
        done();
      });
  });
});

describe('Test delete email service method', () => {
  it('should return error if no message with the id is found', (done) => {
    const message = messageServices.deleteMessage(654);
    expect(message).to.eql('error');
    done();
  });
  it('shohld return error if no id is passed along at all', (done) => {
    const message = messageServices.deleteMessage();
    expect(message).to.eql('error');
    done();
  });
  it('should return true if mesage has been found and deleted', (done) => {
    const message = messageServices.deleteMessage(1);
    expect(message).to.eql('true');
    done();
  });
});

describe('Test the delete message route', () => {
  it('should return error if wrong id is passed', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/5678')
      .end((err, res) => {
        expect(res.body.status).to.eql(400);
        expect(res.body).to.have.property('error');
        done();
      });
  });
  it('should return error if no id is passed', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return done deleted when the right id is passed and the message is deleted', (done) => {
    chai
      .request(server)
      .delete('/api/v1/messages/1')
      .end((err, res) => {
        expect(res.body.status).to.eql(200);
        expect(res.body.data).to.have.property('message');
        done();
      });
  });
});

describe('Test for unread email', () => {
  describe('Test get unread emails service method ', () => {
    it('should return an empty array if no data match the criteria', (done) => {
      const unreadMessages = messageServices.getUnreadMessages();
      expect(unreadMessages).to.be.an('array');
      done();
    });
    it('should return an array of messages that match the criteria of status !== read', (done) => {
      const dummyMessage = {
        subject: 'Hello',
        message: 'You are welcome',
        emailTo: 'superuser@mail.com',
      };
      messageServices.postMessage(dummyMessage);
      const unreadMessages = messageServices.getUnreadMessages();
      expect(unreadMessages).to.be.an('array');
      unreadMessages.forEach((message) => {
        expect(message).to.have.property('id');
        expect(message).to.have.property('subject');
        expect(message).to.have.property('message');
        expect(message).to.have.property('senderId');
        expect(message).to.have.property('receiverId');
        expect(message)
          .to.have.property('status')
          .not.eql('read');
      });
      done();
    });
  });
  describe('Test get unread messages route', () => {
    it('should return array of messages if unread messages is found', (done) => {
      chai
        .request(server)
        .get('/api/v1/messages/unread')
        .end((err, res) => {
          expect(res.body.data).to.be.an('array');
          res.body.data.forEach((message) => {
            expect(message).to.have.property('id');
            expect(message).to.have.property('subject');
            expect(message).to.have.property('message');
            expect(message).to.have.property('senderId');
            expect(message).to.have.property('receiverId');
            expect(message)
              .to.have.property('status')
              .not.eql('read');
          });
          done();
        });
    });
  });
});
