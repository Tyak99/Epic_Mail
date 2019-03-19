import { validationResult } from 'express-validator/check';
import tokenFunction from '../utils/tokenHandler';


exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
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
