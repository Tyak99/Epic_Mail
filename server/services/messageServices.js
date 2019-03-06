import Message from '../models/Message';
import ReceivedMessage from '../models/ReceivedMessage';

export default class MessageService {
  AllMessage() {
    this.messages = [
      {
        id: 1,
        subject: 'Hello',
        message: 'Thanks for coming',
        createdOn: Date.now(),
        status: null,
        parentMessageId: null,
        senderId: 1,
        receiverId: 2,
      },
    ];
    return this.messages.map((message) => {
      const newMessage = new Message();
      newMessage.id = message.id;
      newMessage.subject = message.subject;
      newMessage.message = message.message;
      newMessage.createdOn = message.createdOn;
      newMessage.status = message.status;
      newMessage.senderId = message.senderId;
      newMessage.receiverId = message.receiverId;
      newMessage.parentMessageId = message.parentMessageId;
      return newMessage;
    });
  }

  AllReceivedMessage() {
    this.receivedMessages = [{}, {}];
    return this.receivedMessages.map((message) => {
      const newReceivedMessage = new ReceivedMessage();
      newReceivedMessage.receiverId = message.receiverId;
      newReceivedMessage.messageId = message.messageId;
      newReceivedMessage.createdOn = message.createdOn;
      return newReceivedMessage;
    });
  }

  postMessage(data) {
    const allMessage = this.AllMessage();
    const newMessage = {
      id: allMessage.length + 1,
      createdOn: Date.now(),
      ...data,
    };
    allMessage.push(newMessage);
    return allMessage[newMessage.id - 1];
  }
}
