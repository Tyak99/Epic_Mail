import { validationResult } from 'express-validator/check';
import tokenFunction from '../utils/tokenHandler';


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
  return res.send({
    status: 201,
    data: {
      name: req.body.firstName,
      token: tokenFunction(req.body),
    },
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
};
