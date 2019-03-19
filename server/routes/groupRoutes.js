import express from 'express';
import groupController from '../controllers/groupControllers';
import tokenHandler from '../utils/tokenHandler';

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


router.post('/', tokenHandler.verifyToken, groupController.postGroup);

router.post('/:groupid/users/', tokenHandler.verifyToken, groupController.addUserToGroup);

export default router;
