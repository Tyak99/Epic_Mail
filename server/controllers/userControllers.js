import { validationResult } from 'express-validator/check';
import bcrypt from 'bcryptjs';
import tokenFunction from '../utils/tokenHandler';
import db from '../db/index';

exports.signup = (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName || !lastName) {
    return res.send({
      status: 400,
      error: 'All fields must be present',
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
  // first check the database if such email doesnt exists
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, response) => {
    if (err) {
      return res.send({
        status: 500,
        error: 'Internal server error',
      });
    }
    if (response.rows[0]) {
      return res.send({
        status: 400,
        error: 'Email already in use',
      });
    }
    // if it doesnt. then save it to the database
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.query(
      'INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *',
      [email, hash, firstName, lastName],
      (err, data) => {
        if (err) {
          return res.send({
            status: 500,
            error: 'Internal server error',
          });
        }
        return res.send({
          status: 201,
          data: {
            name: data.rows[0].firstname,
            token: tokenFunction(req.body),
          },
        });
      },
    );
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({
      status: 400,
      error: 'Please input login details email and password',
    });
  }
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, user) => {
    if (err) {
      return res.send({
        status: 500,
        error: 'Internal server error',
      });
    }
    if (!user.rows[0]) {
      return res.send({
        status: 400,
        error: 'Invalid email or password',
      });
    }
    const hash = user.rows[0].password;
    bcrypt.compare(password, hash, (err, response) => {
      if (err) {
        return res.send({
          status: 500,
          error: 'Internal server error',
        });
      }
      if (response === false) {
        return res.send({
          status: 400,
          error: 'Invalid email or password',
        });
      }
      return res.send({
        status: 200,
        data: {
          name: user.rows[0].firstname,
          token: tokenFunction(user.rows[0]),
        },
      });
    });
  });
};
