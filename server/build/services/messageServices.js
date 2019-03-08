"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Message = _interopRequireDefault(require("../models/Message"));

var _ReceivedMessage = _interopRequireDefault(require("../models/ReceivedMessage"));

var _SentMessages = _interopRequireDefault(require("../models/SentMessages"));

var _userServices = _interopRequireDefault(require("./userServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var userServices = new _userServices.default();

var MessageService =
/*#__PURE__*/
function () {
  function MessageService() {
    _classCallCheck(this, MessageService);
  }

  _createClass(MessageService, [{
    key: "AllMessage",
    value: function AllMessage() {
      this.messages = [{
        id: 1,
        subject: 'Hello',
        message: 'Thanks for coming',
        status: 'read',
        parentMessageId: null,
        senderId: 1,
        receiverId: 2
      }, {
        id: 2,
        subject: 'Hi',
        message: 'Thanks for going',
        status: 'draft',
        parentMessageId: null,
        senderId: null,
        receiverId: null
      }, {
        id: 3,
        subject: 'Hello',
        message: 'You are welcome',
        status: 'read',
        parentMessageId: 1,
        senderId: 3,
        receiverId: 1
      }, {
        id: 4,
        subject: 'Howdy',
        message: 'You good',
        status: 'sent',
        senderId: 3,
        receiverId: 1,
        parentMessageId: null
      }, {
        id: 5,
        subject: 'Howdy',
        message: 'okay',
        status: 'sent',
        senderId: 3,
        receiverId: 1,
        parentMessageId: null
      }];
      return this.messages.map(function (message) {
        var newMessage = new _Message.default();
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
  }, {
    key: "AllReceivedMessage",
    value: function AllReceivedMessage() {
      this.receivedMessages = [{
        receiverId: 4,
        messageId: 1,
        createdOn: 1551886333846
      }];
      return this.receivedMessages.map(function (message) {
        var newReceivedMessage = new _ReceivedMessage.default();
        newReceivedMessage.receiverId = message.receiverId;
        newReceivedMessage.messageId = message.messageId;
        newReceivedMessage.createdOn = message.createdOn;
        return newReceivedMessage;
      });
    }
  }, {
    key: "AllSentMessages",
    value: function AllSentMessages() {
      this.sentMessages = [{
        senderId: 1,
        messageId: 1,
        createdOn: 1551886333846
      }];
      return this.sentMessages.map(function (message) {
        var newSentMessage = new _SentMessages.default();
        newSentMessage.receiverId = message.senderId;
        newSentMessage.messageId = message.messageId;
        newSentMessage.createdOn = message.createdOn;
        return newSentMessage;
      });
    }
  }, {
    key: "postReceivedMessage",
    value: function postReceivedMessage(data) {
      var receiverId = data.receiverId;

      if (!receiverId) {
        return 'error';
      }

      var message = new _ReceivedMessage.default();
      message.receiverId = data.receiverId;
      message.messageId = data.messageId;
      return message;
    }
  }, {
    key: "postSentMessage",
    value: function postSentMessage(data) {
      var senderId = data.senderId,
          messageId = data.messageId;

      if (!senderId) {
        return 'error';
      }

      var message = new _SentMessages.default();
      message.senderId = senderId;
      message.messageId = messageId;
      return message;
    }
  }, {
    key: "getReceivedMessage",
    value: function getReceivedMessage() {
      var allMessage = this.AllMessage();
      return allMessage.filter(function (message) {
        return message.receiverId === 1;
      });
    }
  }, {
    key: "getSentMessages",
    value: function getSentMessages() {
      var allMessage = this.AllMessage();
      return allMessage.filter(function (message) {
        return message.senderId === 1;
      });
    }
  }, {
    key: "postMessage",
    value: function postMessage(data) {
      var allMessage = this.AllMessage();
      var toWHo = null; // only go through the phase of checking for user id
      // when emailTo is passed along the request

      if (data.emailTo) {
        // retrieve the email in the request body
        var emailTo = data.emailTo; // find the user with that email

        var foundUser = userServices.findUserByEmail(emailTo);
        toWHo = foundUser;
      } // check if user tried to send to an email and couldnt find the user


      if (toWHo === 'error') {
        // if so, they should be returned an error message
        return 'NOT FOUND';
      } // else they can proceed


      var newMessage = new _Message.default();
      newMessage.id = allMessage.length + 1;
      newMessage.subject = data.subject;
      newMessage.message = data.message;
      newMessage.status = toWHo === null ? 'draft' : 'sent';
      newMessage.senderId = data.senderId || null; // check if the toWho is null then sender id will be null

      newMessage.receiverId = toWHo === null ? null : toWHo.id;
      newMessage.parentMessageId = data.parentMessageId || null;

      if (newMessage.receiverId !== null) {
        this.postReceivedMessage({
          receiverId: newMessage.receiverId,
          messageId: newMessage.id
        });
      }

      if (newMessage.senderId !== null) {
        this.postSentMessage({
          senderId: newMessage.senderId,
          messageId: newMessage.id
        });
      }

      return newMessage;
    }
  }, {
    key: "getMessageById",
    value: function getMessageById(id) {
      var message = this.AllMessage()[id - 1];

      if (!id) {
        return 'error';
      }

      if (!message) {
        return 'error';
      }

      return message;
    }
  }, {
    key: "deleteMessage",
    value: function deleteMessage(id) {
      var message = this.AllMessage()[id - 1];

      if (!id) {
        return 'error';
      }

      if (!message) {
        return 'error';
      }

      this.AllMessage().splice([id - 1], 1);
      return 'true';
    }
  }, {
    key: "getUnreadMessages",
    value: function getUnreadMessages() {
      var allMessages = this.AllMessage();
      return allMessages.filter(function (message) {
        return message.status !== 'read' && message.receiverId === 1;
      });
    }
  }]);

  return MessageService;
}();

exports.default = MessageService;
//# sourceMappingURL=messageServices.js.map