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
