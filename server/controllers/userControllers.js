import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator/check';
import tokenHandler from '../utils/tokenHandler';
import db from '../database/index';

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: 'Failed',
      error: errors.array()[0].msg,
    })
  }
  // first check the database if that email exists previously
  db.query(
    'SELECT * FROM users WHERE email = $1',
    [req.body.email],
    (err, user) => {
      if (err) {
        return res.status(500).json({
          status: 'Failed',
          error: 'Internal server error',
        });
      }
      if (user.rows[0]) {
        return res.status(404).json({
          status: 'Failed',
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
      status: 'Failed',
      error: errors.array()[0].msg,
    })
  }
  const { email, password } = req.body;
  db.query('SELECT * FROM users WHERE email = $1', [email], (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'Failed',
        error: 'Internal server error',
      })
    }
    if (!user.rows[0]) {
      return res.status(400).json({
        status: 'Failed',
        error: 'Invalid email or password',
      });
    }
    const hash = user.rows[0].password;
    bcrypt.compare(password, hash, (err, response) => {
      if (response === false) {
        return res.status(400).json({
          status: 'Failed',
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
