import { check } from 'express-validator/check';

const postMessageValidation = [
  check('emailTo').isEmail().withMessage('Email is required for emailTo input')
]

module.exports = {
  postMessageValidation,
};
