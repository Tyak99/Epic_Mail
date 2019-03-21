import { check } from 'express-validator/check';

const postMessageValidation = [
  check('subject')
    .isLength({ min: 2 })
    .withMessage('Subject is required with minimun length of 2 characters'),
];

const postGroupValidation = [
  check('name', 'Name is required to be only number and letters with 2 minimum characters')
    .trim()
    .isLength({ min: 2 })
    .isAlphanumeric(),
];

module.exports = {
  postMessageValidation,
  postGroupValidation,
};
