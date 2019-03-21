import { validationResult } from 'express-validator/check';
import db from '../database/index';

exports.postMessage = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({
      status: 'failed',
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
          'unread',
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
  // search the message db table by the users id
  db.query(
    'SELECT * FROM messages WHERE receiverid = $1 AND receiverdeleted = $2',
    [req.decoded.sub, 0],
    (err, message) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (!message.rows[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'No received messages found',
          },
        });
      }
      return res.status(200).json({
        status: 'success',
        data: message.rows,
      });
    }
  );
};

exports.getSentMessages = (req, res) => {
  // search the message db table by the users id
  db.query(
    'SELECT * FROM messages WHERE senderid = $1',
    [req.decoded.sub],
    (err, message) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (!message.rows[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'No sent messages found',
          },
        });
      }
      return res.status(200).json({
        status: 'success',
        data: message.rows,
      });
    }
  );
};

exports.getMessageById = (req, res) => {
  const { sub } = req.decoded;
  // check the db for the id passed in the parameter
  db.query(
    'SELECT * FROM messages WHERE id = $1',
    [req.params.id],
    (err, message) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (!message.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'No message with that id found',
        });
      }
      if (
        message.rows[0].senderid !== sub &&
        message.rows[0].receiverid !== sub
      ) {
        return res.status(403).json({
          status: 'failed',
          error:
            'Sorry, you can request a message only when you are the sender or receiver',
        });
      }
      if (
        sub == message.rows[0].receiverid &&
        message.rows[0].receiverdeleted == 1
      ) {
        return res.status(404).json({
          status: 'failed',
          error: 'Sorry, the requested message has been deleted from inbox',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: message.rows[0],
      });
    }
  );
};

exports.getUnreadMessages = (req, res) => {
  // check the db for messages that the user is the receiver
  db.query(
    'SELECT * FROM messages WHERE receiverid = $1 AND status = $2 AND receiverdeleted = $3',
    [req.decoded.sub, 'unread', 0],
    (err, messages) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (!messages.rows[0]) {
        return res.status(200).json({
          status: 'failed',
          data: {
            message: 'No unread messages found',
          },
        });
      }
      return res.status(200).json({
        status: 'success',
        data: messages.rows,
      });
    }
  );
};

exports.deleteById = (req, res) => {
  // check if the message exists
  db.query(
    'SELECT * FROM messages WHERE id = $1',
    [req.params.id],
    (err, message) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (!message.rows[0]) {
        return res.status(404)({
          status: 'failed',
          error: 'No message with that id found',
        });
      }
      if (
        message.rows[0].senderid !== sub &&
        message.rows[0].receiverid !== sub
      ) {
        return res.status(403)({
          status: 'failed',
          error:
            'Sorry, you can request a message only when you are the sender or receiver',
        });
      }
      if (message.rows[0].receiverid == sub) {
        db.query(
          'UPDATE TABLE messages WHERE id = $1 SET receiverdeleted = 1',
          (err, removedMessage) => {
            if (err) {
              return res.status(500).json({
                status: 'failed',
                error: 'Internal server error',
              });
            }
            if (removedMessage.rows[0]) {
              return res.status(200).json({
                status: 'success',
                data: {
                  message: 'Message deleted successfully',
                },
              });
            }
          }
        );
      }
      db.query(
        'DELETE FROM messages WHERE id = $1 RETURNING *',
        [req.params.id],
        (err, deletedMessage) => {
          if (err) {
            return res.status(500).json({
              status: 'failed',
              error: 'Internal server error',
            });
          }
          if (deletedMessage.rows[0]) {
            return res.status(200).json({
              status: 'success',
              data: {
                message: 'Message deleted successfully',
              },
            });
          }
        }
      );
    }
  );
};
