/* eslint-disable class-methods-use-this */
import Message from '../models/Message';
import UserService from './userServices';

const userServices = new UserService();

export default class MessageService {
  constructor() {
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
        parentMessageId: 1,
        senderId: 3,
        receiverId: 1,
      },
      {
        id: 4,
        subject: 'Howdy',
        message: 'You good',
        status: 'sent',
        senderId: 3,
        receiverId: 1,
        parentMessageId: null,
      },
      {
        id: 5,
        subject: 'Howdy',
        message: 'okay',
        status: 'sent',
        senderId: 3,
        receiverId: 1,
        parentMessageId: null,
      },
    ];
  }

  AllMessage() {
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

  getReceivedMessage() {
    const allMessage = this.AllMessage();
    return allMessage.filter((message) => message.receiverId === 1);
  }

  getSentMessages() {
    const allMessage = this.AllMessage();
    return allMessage.filter((message) => message.senderId === 1);
  }

  postMessage(data) {
    const allMessage = this.AllMessage();
    let toWHo = null;

    // only go through the phase of checking for user id
    // when emailTo is passed along the request
    if (data.emailTo) {
      // retrieve the email in the request body
      const { emailTo } = data;
      // find the user with that email
      const foundUser = userServices.findUserByEmail(emailTo);
      toWHo = foundUser;
    }
    // check if user tried to send to an email and couldnt find the user
    if (toWHo === 'error') {
      // if so, they should be returned an error message
      return 'NOT FOUND';
    }
    // else they can proceed
    const newMessage = new Message();
    //get the last email in the array
    const lastMessage = allMessage[allMessage.length - 1];
    const newId = lastMessage.id + 1;
    // check the id and add one
    newMessage.id = newId;
    newMessage.subject = data.subject;
    newMessage.message = data.message;
    newMessage.status = toWHo === null ? 'draft' : 'sent';
    newMessage.senderId = data.senderId || null;
    // check if the toWho is null then sender id will be null
    newMessage.receiverId = toWHo === null ? null : toWHo.id;
    newMessage.parentMessageId = data.parentMessageId || null;

    this.messages.push(newMessage);
    return newMessage;
  }

  getMessageById(id) {
    if (!id) {
      return 'error';
    }
    const foundMessage = this.AllMessage().find(element => element.id === Number(id));
    if (!foundMessage) {
      return 'error';
    }
    return foundMessage;
  }

  deleteMessage(id) {
    if (!id) {
      return 'error';
    }
    const foundMessage = this.messages.find(element => element.id === Number(id));
    if (!foundMessage) {
      return 'error';
    }
    const messageIndex = this.messages.indexOf(foundMessage);
    this.messages.splice(messageIndex, 1);
    return 'true';
  }

  getUnreadMessages() {
    const allMessages = this.AllMessage();

    return allMessages.filter(
      (message) => message.status !== 'read' && message.receiverId === 1
    );
  }
}
