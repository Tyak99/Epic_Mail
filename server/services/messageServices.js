/* eslint-disable class-methods-use-this */
import Message from '../models/Message';
import ReceivedMessage from '../models/ReceivedMessage';

export default class MessageService {
  AllMessage() {
    this.messages = [
      {
        id: 1,
        subject: 'Hello',
        message: 'Thanks for coming',
        status: 'read',
        parentMessageId: null,
        senderId: 1,
        receiverId: 2,
      },
      {
        id: 2,
        subject: 'Hi',
        message: 'Thanks for going',
        status: 'draft',
        parentMessageId: null,
        senderId: null,
        receiverId: null,
      },
      {
        id: 3,
        subject: 'Hello',
        message: 'You are welcome',
        status: 'read',
        parentMessageId: null,
        senderId: 3,
        receiverId: 1,
      },
    ];
    return this.messages.map((message) => {
      const newMessage = new Message();
      newMessage.id = message.id;
      newMessage.subject = message.subject;
      newMessage.message = message.message;
      newMessage.status = message.status;
      newMessage.senderId = message.senderId;
      newMessage.receiverId = message.receiverId;
      newMessage.parentMessageId = message.parentMessageId;
      return newMessage;
    });
  }

  AllReceivedMessage() {
    this.receivedMessages = [
      {
        receiverId: 4,
        messageId: 1,
        createdOn: 1551886333846,
      },
    ];
    return this.receivedMessages.map((message) => {
      const newReceivedMessage = new ReceivedMessage();
      newReceivedMessage.receiverId = message.receiverId;
      newReceivedMessage.messageId = message.messageId;
      newReceivedMessage.createdOn = message.createdOn;
      return newReceivedMessage;
    });
  }

  postReceivedMessage(data) {
    const { receiverId } = data;
    if (!receiverId) {
      return 'error';
    }
    const message = new ReceivedMessage();
    message.receiverId = data.receiverId;
    message.messageId = data.messageId;
    return message;
  }

  getReceivedMessage() {
    const allMessage = this.AllMessage();
    return allMessage.filter(message => message.receiverId == 1);
  }

  getSentMessages() {
    const allMessage = this.AllMessage();
    return allMessage.filter(message => message.senderId === 1);
  }

  postMessage(data) {
    const allMessage = this.AllMessage();

    const newMessage = new Message();
    newMessage.id = allMessage.length + 1;
    newMessage.subject = data.subject;
    newMessage.message = data.message;
    newMessage.status = data.status || null;
    newMessage.senderId = data.senderId || null;
    newMessage.receiverId = data.receiverId || null;
    newMessage.parentMessageId = data.parentMessageId || null;

    if (newMessage.receiver !== null) {
      this.postReceivedMessage({
        receiverId: newMessage.receiverId,
        messageId: newMessage.id,
      });
    }
    return newMessage;
  }
}
