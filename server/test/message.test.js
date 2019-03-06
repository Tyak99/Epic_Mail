import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

import MessageService from '../services/messageServices';

const { expect } = chai;

const messageServices = new MessageService();

describe('Test post a message service method api/v1/messages', () => {
  it('should return a message object when correct details are passed', (done) => {
    const dummyMessage = {
      subject: 'Hello',
      message: 'Thanks for coming',
      createdOn: Date.now(),
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
