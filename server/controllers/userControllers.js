import { validationResult } from 'express-validator/check';
import tokenFunction from '../utils/tokenHandler';
import db from '../database/index';


exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
  // first check the database if that email exists previously
  db.query('SELECT * FROM users WHERE email = $1', [req.body.email], (err, user) => {
    if (user.rows[0]) {
      return res.status(404).json({
        status: 'failed',
        error: 'User with this email already exists'
      })
    }
    // if it doesnt then create the user
    const { email, password, firstName, lastName } = req.body;
    const values = [email, password, firstName, lastName];
    db.query('INSERT INTO users (email, password, firstname, lastname) VALUES ($1, $2, $3, $4) RETURNING *', values, (err, createdUser) => {
      if (err) {
        return res.status(500).json({
          status: 'failed',
          error: 'Internal server error',
        });
      }
      return res.status(201).json({
        status: 'success',
        data: {
          name: createdUser.rows[0].firstname,
          token: tokenFunction(req.body)
        },
      });
    });
  });
};

exports.login = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
};
