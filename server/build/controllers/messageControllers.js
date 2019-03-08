"use strict";

var _messageServices = _interopRequireDefault(require("../services/messageServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var messageServices = new _messageServices.default();

exports.postMessage = function (req, res) {
  var _req$body = req.body,
      subject = _req$body.subject,
      message = _req$body.message;

  if (!subject || !message) {
    return res.send({
      status: 400,
      error: 'Please input all the required data'
    });
  }

  var postMessage = messageServices.postMessage(req.body);

  if (postMessage == 'NOT FOUND') {
    return res.send({
      status: 404,
      error: 'Email not found'
    });
  }

  return res.send({
    status: 201,
    data: postMessage
  });
};

exports.getReceivedMessages = function (req, res) {
  var messages = messageServices.getReceivedMessage();
  res.send({
    status: 200,
    data: messages
  });
};

exports.getSentMessages = function (req, res) {
  var messages = messageServices.getSentMessages();
  res.send({
    status: 200,
    data: messages
  });
};

exports.getMessageById = function (req, res) {
  var message = messageServices.getMessageById(req.params.id);

  if (message === 'error') {
    return res.send({
      status: 400,
      error: 'No message with that id found'
    });
  }

  return res.send({
    status: 200,
    data: message
  });
};

exports.deleteById = function (req, res) {
  var message = messageServices.deleteMessage(req.params.id);

  if (!req.params.id) {
    return res.send({
      status: 404,
      error: 'No id present to locate resource'
    });
  }

  if (message === 'error') {
    return res.send({
      status: 400,
      error: 'No message with that id found'
    });
  }

  return res.send({
    status: 200,
    data: {
      message: 'Message deleted successfully'
    }
  });
};

exports.getUnreadMessages = function (req, res) {
  var messages = messageServices.getUnreadMessages();
  return res.send({
    status: 200,
    data: messages
  });
};
//# sourceMappingURL=messageControllers.js.map