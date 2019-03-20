import { check } from 'express-validator/check';

const postMessageValidation = [
  check('subject').isLength({min: 2}).withMessage('Subject is required with minimun length of 2 characters')
]

module.exports = {
  postMessageValidation,
};
