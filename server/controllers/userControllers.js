import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import sgTrasport from 'nodemailer-sendgrid-transport';
import { validationResult } from 'express-validator/check';
import tokenHandler from '../utils/tokenHandler';
import db from '../database/index';

const options = {
  auth: {
    api_key:
      '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',
  },
};
const transporter = nodemailer.createTransport(sgTrasport(options));

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  // first check the database if that email exists previously
  db.query(
    'SELECT * FROM users WHERE email = $1',
    [req.body.email],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      if (user.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'Email already in use',
        });
      }
      // if it doesnt then create the user
      const { email, password, firstName, lastName } = req.body;
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const values = [email, hash, firstName, lastName];
      db.query(
        'INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *',
        values,
        (err, createdUser) => {
          console.log(createdUser.rows[0]);
          transporter.sendMail(
            {
              from: 'noreply@epic-mail.com',
              to: createdUser.rows[0].email,
              subject: 'Welcome to epic mail',
              html: '<h1> You successfully signed up </h1>',
            },
            (err, info) => {
              if (err) {
                console.log(err);
              } else {
                console.log('Message sent');
              }
            }
          );
          return res.status(201).json({
            status: 'success',
            data: {
              name: createdUser.rows[0].firstname,
              token: tokenHandler.generateToken(createdUser.rows[0]),
            },
          });
        }
      );
    }
  );
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'failed',
      error: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'failed',
        error: 'Internal server error',
      });
    }
    if (!user.rows[0]) {
      return res.status(400).json({
        status: 'failed',
        error: 'Invalid email or password',
      });
    }
    const hash = user.rows[0].password;
    bcrypt.compare(password, hash, (err, response) => {
      if (response === false) {
        return res.status(400).json({
          status: 'failed',
          error: 'Invalid email or password',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: {
          name: user.rows[0].firstname,
          token: tokenHandler.generateToken(user.rows[0]),
        },
      });
    });
  });
};

exports.resetPassword = (req, res) => {
  // receiver email
  const userEmail = req.body.email;
  console.log(userEmail)
  // find the database if the email exists
  db.query(
    'SELECT * FROM users WHERE email = $1',
    [userEmail],
    (err, foundUser) => {
      if (err) {
        console.log(err);
      }
      if (!foundUser.rows[0]) {
        return res.status(404).json({
          status: 'failed',
          error: 'No user with that email found',
        });
      }
      if (foundUser.rows[0]) {
        // token generator
        const generateResetToken = (user) => {
          return jwt.sign({ sub: user.id }, process.env.secret, { expiresIn: '1h' });
        };
        const token = generateResetToken(foundUser.rows[0]);
        // mail sender
        transporter.sendMail(
          {
            from: 'noreply@epic-mail.com',
            to: foundUser.rows[0].email,
            subject: 'Reset your password',
            html: `<h2>  Click this <a href= https://tyak99.github.io/Epic_Mail/Ui/index.html?resetToken=${token}>link</a> to reset your password <a>  </a></h2>`,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log('Reset token sent');
            }
          }
        );
        return res.status(200).json({
          status: 'success',
          data: {
            message: 'Check your email for reset password message',
          },
        });
      }
    }
  );
};