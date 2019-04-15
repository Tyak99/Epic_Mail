import { validationResult, check } from 'express-validator/check';
import db from '../database/index';

exports.postMessage = (req, res) => {
  // an email check function
  const validateEmail = (data) => {
    const emailCheck = /\S+@\S+\.\S+/;
    return emailCheck.test(data);
  };
  // check if email is present in request then run the validation function
  if (req.body.emailTo) {
    if (validateEmail(req.body.emailTo) == false) {
      return res.status(422).json({
        status: 'failed',
        error: 'Invalid email input',
      });
    }
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { subject, message } = req.body;
  const newSubject = subject.replace(/\s+/g, ' ');
  const newMessage = message.replace(/\s+/g, ' ');
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
          newSubject,
          newMessage,
          'unread',
          req.userEmail,
          user.rows[0].email,
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
                parentmessageid,
                created_at,
              } = createdMessage.rows[0];
              return res.status(201).json({
                status: 'success',
                data: {
                  id,
                  subject,
                  message,
                  status: 'sent',
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
    const values = [newSubject, newMessage, 'draft', req.userEmail];
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
    [req.userEmail, 0],
    (err, message) => {
      if (!message.rows[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'No received messages found',
          },
        });
      }
      const result = [];
      message.rows.map((element) => {
        const obj = {
          id: element.id,
          subject: element.subject,
          message: element.message,
          senderid: element.senderid,
          receiverid: element.receiverid,
          created_at: element.created_at,
          parentmessageid: element.parentmessageid,
        };
        result.push(obj);
      });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  );
};

exports.getSentMessages = (req, res) => {
  // search the message db table by the users id
  db.query(
    'SELECT * FROM messages WHERE senderid = $1 AND status != $2',
    [req.userEmail, 'draft'],
    (err, message) => {
      if (!message.rows[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'No sent messages found',
          },
        });
      }
      const result = [];
      message.rows.map((element) => {
        const obj = {
          id: element.id,
          subject: element.subject,
          message: element.message,
          senderid: element.senderid,
          receiverid: element.receiverid,
          created_at: element.created_at,
          parentmessageid: element.parentmessageid,
        };
        result.push(obj);
      });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  );
};

exports.getDrafts = (req, res) => {
  const { userEmail } = req;
  db.query(
    'SELECT * FROM messages WHERE senderid = $1 AND status = $2',
    [userEmail, 'draft'],
    (err, messages) => {
      if (!messages.rows[0]) {
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'No draft messages found',
          },
        });
      }
      const result = [];
      messages.rows.map((element) => {
        const obj = {
          id: element.id,
          subject: element.subject,
          message: element.message,
          senderid: element.senderid,
          status: element.status,
          created_at: element.created_at,
        };
        result.push(obj);
      });
      return res.status(200).json({
        status: 'success',
        data: result,
      });
    }
  );
};

exports.getMessageById = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { sub } = req.decoded;
  // check the db for the id passed in the parameter
  db.query(
    'SELECT * FROM messages WHERE id = $1',
    [req.params.id],
    (err, message) => {
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
      delete message.rows[0].status;
      delete message.rows[0].receiverdeleted;
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
      if (!messages.rows[0]) {
        return res.status(200).json({
          status: 'success',
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { sub } = req.decoded;
  // check if the message exists
  db.query(
    'SELECT * FROM messages WHERE id = $1',
    [req.params.id],
    (err, message) => {
      if (!message.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'No message with that id found',
        });
      }
      if (
        message.rows[0].receiverid !== sub &&
        message.rows[0].senderid !== sub
      ) {
        return res.status(403).json({
          status: 'failed',
          error:
            'Sorry, you can request a message only when you are the sender or receiver',
        });
      }
      if (message.rows[0].receiverid == sub) {
        db.query(
          'UPDATE messages SET receiverdeleted = $1 WHERE id = $2 RETURNING *',
          [1, req.params.id],
          (err, removedMessage) => {
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
      if (message.rows[0].senderid == sub) {
        db.query(
          'DELETE FROM messages WHERE id = $1 RETURNING *',
          [req.params.id],
          (err, deletedMessage) => {
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
    }
  );
};
