export default class Message {
  constructor() {
    this.id = null;
    this.createdOn = new Date();
    this.subject = null;
    this.message = null;
    this.status = null;
    this.senderId = null;
    this.receiverId = null;
    this.parentMessageId = null;
  }
}
