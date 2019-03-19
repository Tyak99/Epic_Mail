import express from 'express';
import { body } from 'express-validator/check';
import userController from '../controllers/userControllers';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   SignUp:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       firstName:
 *         type: string
 *       lastName:
 *         type: string
 */

/**
 * @swagger
 * definitions:
 *   Login:
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Sign up an account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/SignUp'
 *     responses:
 *       201:
 *         description: token
 *       400:
 *         description: Email already in use
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Sign in an account
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: user
 *         description: user object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Login'
 *     responses:
 *       200:
 *         description: token
 *       400:
 *         description: Invalid email or password
 */

router.post(
  '/signup',
  [
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
    body('firstName')
      .isLength({ min: 2 })
      .withMessage('First name with at least 2 characters long is required'),
    body('lastName')
      .isLength({ min: 2 })
      .withMessage('Last name with at least 2 characters long is required'),
  ],
  userController.signup,
);

router.post(
  '/login',
  [
    body('email')
      .exists()
      .withMessage('Please input login details email and password')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail()
      .trim(),
    body('password')
      .exists()
      .withMessage('Please input login details email and password'),
  ],
  userController.login,
);

export default router;