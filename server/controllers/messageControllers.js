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