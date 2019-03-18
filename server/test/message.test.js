import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

import MessageService from '../services/messageServices';

const { expect } = chai;
chai.use(chaiHttp);
const messageServices = new MessageService();

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
describe('Test post a message service method', () => {
  it('should return an object with senderId and receiverId as null if emailTo isnt passed along', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
    };
    const newMessage = messageServices.postMessage(dummyMessage);
    expect(newMessage).to.be.an('object');
    expect(newMessage).to.have.property('id');
    expect(newMessage).to.have.property('message');
    expect(newMessage).to.have.property('subject');
    expect(newMessage)
      .to.have.property('status')
      .eql('draft');
    expect(newMessage).to.have.property('senderId');
    expect(newMessage).to.have.property('receiverId');
    expect(newMessage).to.have.property('parentMessageId');
    done();
  });
  it('should return an error if an emailTo is passed along but the user isnt found', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      emailTo: 'nouser@mail.com',
      senderId: 2,
    };
    const newMessage = messageServices.postMessage(dummyMessage);
    expect(newMessage).to.eql('NOT FOUND');
    done();
  });
  it('should return a message object when correct details are passed', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      emailTo: 'superuser@mail.com',
      senderId: 2,
    };
    const newMessage = messageServices.postMessage(dummyMessage);
    expect(newMessage).to.be.an('object');
    expect(newMessage).to.have.property('id');
    expect(newMessage).to.have.property('subject');
    expect(newMessage).to.have.property('message');
    expect(newMessage).to.have.property('createdOn');
    expect(newMessage)
      .to.have.property('status')
      .eql('sent');
    expect(newMessage).to.have.property('senderId');
    expect(newMessage).to.have.property('receiverId');
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
      .send(dummyMessage)
      .end((err, res) => {
        expect(res.body).to.have.property('error');
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
      .end((err, res) => {
        expect(res.body.status).to.eql(404);
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
      .end((err, res) => {
        expect(res.body.status).to.eql(201);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('subject');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('createdOn');
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
      emailTo: 'superuser@mail.com',
      senderId: 3,
    };
    chai
      .request(server)
      .post('/api/v1/messages')
      .send(dummyMessage)
      .end((err, res) => {
        expect(res.body.status).to.eql(201);
        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('message');
        expect(res.body.data).to.have.property('subject');
        expect(res.body.data).to.have.property('receiverId');
        expect(res.body.data).to.have.property('senderId');
        expect(res.body.data)
          .to.have.property('status')
          .eql('sent');
        done();
      });
  });
});


describe('Test get received emails method', () => {
  it('should return all recieved emails', (done) => {
    const receivedMessages = messageServices.getReceivedMessage();
    expect(receivedMessages).to.be.an('array');
    receivedMessages.forEach((message) => {
      expect(message).to.have.property('id');
      expect(message).to.have.property('subject');
      expect(message).to.have.property('message');
      expect(message).to.have.property('status');
      expect(message).to.have.property('createdOn');
      expect(message).to.have.property('receiverId');
      expect(message).to.have.property('senderId');
    });
    done();
  });
});

describe('Test get received emails route', () => {
  it('should return error on wrong api call', (done) => {
    chai
      .request(server)
      .get('/api/v1/wrongapi')
      .end((err, res) => {
        expect(res.status).to.eql(404);
        done();
      });
  });
  it('should return an array of received emails', (done) => {
    chai
      .request(server)
      .get('/api/v1/messages')
      .end((err, res) => {
        expect(res.body.status).to.eql(200);
        expect(res.body.data).to.be.an('array');
        res.body.data.forEach((message) => {
          expect(message).to.have.property('id');
          expect(message).to.have.property('createdOn');
          expect(message).to.have.property('message');
          expect(message).to.have.property('subject');
          expect(message).to.have.property('receiverId');
          expect(message).to.have.property('senderId');
          expect(message).to.have.property('status');
        });
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
