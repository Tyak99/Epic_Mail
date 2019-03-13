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
      (err, response) => {
        if (err) {
          console.log(err);
        }
        return res.send({
          status: 201,
          data: {
            name: response.rows[0].firstname,
            token: tokenFunction(req.body),
          },
        });
      }
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
  // User is already verified before they get here
  // so here i need to give the user token
  res.send({
    status: 200,
    data: {
      name: req.user.firstname,
      token: tokenFunction(req.user),
    },
  });
};
