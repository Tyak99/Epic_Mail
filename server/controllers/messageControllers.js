import MessageService from '../services/messageServices';

const messageServices = new MessageService();

exports.postMessage = (req, res) => {
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.send({
      status: 400,
      error: 'Please input all the required data',
    });
  }
  const postMessage = messageServices.postMessage(req.body);
  if (postMessage == 'NOT FOUND') {
    return res.send({
      status: 404,
      error: 'Email not found',
    });
  }
  return res.send({
    status: 201,
    data: postMessage,
  });
};

exports.getReceivedMessages = (req, res) => {
  const messages = messageServices.getReceivedMessage();
  res.send({
    status: 200,
    data: messages,
  });
};

exports.getSentMessages = (req, res) => {
  const messages = messageServices.getSentMessages();
  res.send({
    status: 200,
    data: messages,
  });
};

exports.getMessageById = (req, res) => {
  const message = messageServices.getMessageById(req.params.id);
  if (message === 'error') {
    return res.send({
      status: 400,
      error: 'No message with that id found',
    });
  }
  return res.send({
    status: 200,
    data: message,
  });
};

exports.deleteById = (req, res) => {
  const message = messageServices.deleteMessage(req.params.id);
  if (!req.params.id) {
    return res.send({
      status: 404,
      error: 'No id present to locate resource',
    });
  }
  if (message === 'error') {
    return res.send({
      status: 400,
      error: 'No message with that id found',
    });
  }
  return res.send({
    status: 200,
    data: {
      message: 'Message deleted successfully',
    },
  });
};
