import { check, param, body } from 'express-validator/check';

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
  body(
    'password',
    'Please enter a password with only text and numbers and at least 6 characters long'
  ).trim(),
];

const signUpValidation = [
  body('email')
    .isEmail()
    .withMessage('A valid email is required')
    .normalizeEmail()
    .trim(),
  body(
    'password',
    'Please enter a password with only text and numbers and at least 6 characters long'
  )
    .trim()
    .isLength({ min: 6 })
    .isAlphanumeric(),
  body('firstName', 'First name that contains only text and numbers with minimum of 2 characters long is required')
    .isLength({ min: 2 })
    .isAlphanumeric()
    .trim(),
  body('lastName', 'Last name that contains only text and numbers with minimum of 2 characters long is required')
    .isLength({ min: 2 })
    .isAlphanumeric()
    .trim(),
];
const postMessageValidation = [
  check('subject')
    .isLength({ min: 2 })
    .withMessage('Subject is required with minimun length of 2 characters'),
  check('message')
    .isLength({ min: 2 })
    .withMessage('Message is required with minimum length of 2 characters')
    .trim(),
];

const postGroupValidation = [
  check(
    'name',
    'Name is required to be only number and letters with 2 minimum characters'
  )
    .trim()
    .isLength({ min: 2 })
    .isAlphanumeric(),
];

const GroupIdValidation = [param('groupid', 'Invalid group id').isNumeric()];

const deleteUserFromGroupValidation = [
  param('groupid', 'Invalid group id').isNumeric(),
  param('userid', 'Invalid user id').isNumeric(),
];
const postMessageToGroupValidation = [
  check(
    'subject',
    'Subject is required with minimun length of 2 characters'
  ).isLength({ min: 2 }),
  check(
    'message',
    'Message is required with minimu length of 2 characters'
  ).isLength({ min: 2 }),
];

const updateGroupValidator = [
  param('groupid', 'Invalid group id').isNumeric(),
  check(
    'name',
    'Name is required to be only number and letters with 2 minimum characters'
  )
    .trim()
    .isLength({ min: 2 })
    .isAlphanumeric(),
];

const messageIdValidation = [param('id', 'Invalid message id').isNumeric()];

module.exports = {
  postMessageValidation,
  postGroupValidation,
  GroupIdValidation,
  deleteUserFromGroupValidation,
  postMessageToGroupValidation,
  updateGroupValidator,
  messageIdValidation,
  signUpValidation,
  loginValidation,
};
