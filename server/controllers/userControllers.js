import { validationResult } from 'express-validator/check';
import UserService from '../services/userServices';
import tokenFunction from '../utils/tokenHandler';

const userServices = new UserService();

exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send({
      status: 422,
      error: errors.array()[0].msg,
    });
  }
  const createdUser = userServices.createUser(req.body);

  if (createdUser === 'EMAIL ALREADY IN USE') {
    return res.send({
      status: 400,
      error: 'Email already in use',
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
  const loginUser = userServices.loginUser(req.body);
  if (loginUser === 'NO USER' || loginUser === 'Invalid password') {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  return res.send({
    status: 200,
    data: {
      name: loginUser.firstName,
      token: tokenFunction(req.body),
    },
  });
};
