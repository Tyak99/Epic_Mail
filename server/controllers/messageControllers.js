import MessageService from '../services/messageServices';
import db from '../database/index';
import { validationResult } from 'express-validator/check';

const messageServices = new MessageService();

exports.postMessage = (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    })
  }
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.send({
      status: 400,
      error: 'Please input the required data, subject and message',
    });
  }
  // check if email to is passed along request
  if (req.body.emailTo) {
    db.query(
      'SELECT * FROM users WHERE email = $1',
      [req.body.emailTo],
      (err, user) => {
        if (!user.rows[0]) {
          return res.status(404).json({
            status: 'failed',
            error: 'No user with that email found',
          });
        }
        const values = [
          subject,
          message,
          'sent',
          req.decoded.sub,
          user.rows[0].id,
        ];
        db.query(
          'INSERT INTO messages (subject, message, status, senderid, receiverid) VALUES ($1, $2, $3, $4, $5) RETURNING *',
          values,
          (err, createdMessage) => {
            if (createdMessage.rows[0]) {
              const {
                id,
                subject,
                message,
                status,
                parentmessageid,
                created_at,
              } = createdMessage.rows[0];
              return res.status(201).json({
                status: 'success',
                data: {
                  id,
                  subject,
                  message,
                  status,
                  parentmessageid,
                  created_at,
                },
              });
            }
          }
        );
      }
    );
  } else {
    //post a message without a receiver id making it a draft
    const values = [subject, message, 'draft', req.decoded.sub];
    db.query(
      'INSERT INTO messages (subject, message, status, senderid) VALUES ($1, $2, $3, $4) RETURNING *',
      values,
      (err, createdMessage) => {
        if (createdMessage.rows[0]) {
          const {
            id,
            subject,
            message,
            status,
            parentmessageid,
            created_at,
          } = createdMessage.rows[0];
          return res.status(201).json({
            status: 'success',
            data: {
              id,
              subject,
              message,
              status,
              parentmessageid,
              created_at,
            },
          });
        }
      }
    );
  }
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

exports.getUnreadMessages = (req, res) => {
  const messages = messageServices.getUnreadMessages();
  return res.send({
    status: 200,
    data: messages,
  });
};
