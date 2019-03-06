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
  it('should return a message object when correct details are passed', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      status: null,
      parentMessageId: null,
      senderId: 1,
      receiverId: 2,
    };
    const newMessage = messageServices.postMessage(dummyMessage);
    expect(newMessage).to.be.an('object');
    expect(newMessage).to.have.property('id');
    expect(newMessage).to.have.property('subject');
    expect(newMessage).to.have.property('message');
    expect(newMessage).to.have.property('createdOn');
    expect(newMessage).to.have.property('status');
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
      status: null,
      parentMessageId: null,
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
  it('sould create message when the required fields are present', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      status: null,
      parentMessageId: null,
      senderId: 1,
      receiverId: 2,
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
        expect(res.body.data).to.have.property('status');
        done();
      });
  });
});

describe('Test add received emails', () => {
  it('should not add an email to received emails if no receiverId is present', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      status: null,
      parentMessageId: null,
    };
    const receivedMessage = messageServices.postReceivedMessage(dummyMessage);
    expect(receivedMessage).to.be.eql('error');
    done();
  });
  it('should add an email to received emails if receiverId is present', (done) => {
    const dummyMessage = {
      receiverId: 2,
      messageId: 1,
      createdOn: new Date(),
    };
    const receivedMessage = messageServices.postReceivedMessage(dummyMessage);
    expect(receivedMessage).to.be.an('object');
    expect(receivedMessage).to.have.property('receiverId');
    expect(receivedMessage).to.have.property('messageId');
    expect(receivedMessage).to.have.property('createdOn');
    done();
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
