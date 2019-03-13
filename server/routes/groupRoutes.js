import express from 'express';
import { body } from 'express-validator/check';
import groupController from '../controllers/groupControllers';

const router = express.Router();

/**
 * @swagger
 * definitions:
 *   Group:
 *     properties:
 *       name:
 *         type: string
 *       members:
 *         type: array
 */

/**
 * @swagger
 * /api/v1/group:
 *   post:
 *     tags:
 *       - Groups
 *     description: Create a group
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: group
 *         description: group object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Group'
 *     responses:
 *       200:
 *         description: Created successfully
 *       400:
 *         description: Provide the necessary details
 */

router.post(
  '/',
  body(
    'name',
    'Group name must be upto 4 letters long and contain only letters and numbers'
  )
    .isLength({ min: 4 })
    .isAlphanumeric(),
  groupController.postGroup,
);

export default router;
