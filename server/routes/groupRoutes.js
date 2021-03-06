import express from 'express';
import groupController from '../controllers/groupControllers';
import tokenHandler from '../utils/tokenHandler';
import validator from '../utils/validator';

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

router.get('/', tokenHandler.verifyToken, groupController.getAllGroups);
router.post('/', tokenHandler.verifyToken, validator.postGroupValidation, groupController.postGroup);

router.put('/:groupid/name', tokenHandler.verifyToken, validator.updateGroupValidator, groupController.updateGroup);

router.post('/:groupid/users/', tokenHandler.verifyToken, validator.GroupIdValidation, groupController.addUserToGroup);

router.delete('/:groupid/users/:userid', tokenHandler.verifyToken, validator.deleteUserFromGroupValidation, groupController.removeMember)

router.delete('/:groupid', tokenHandler.verifyToken, validator.GroupIdValidation, groupController.deleteGroup)

router.post('/messages', tokenHandler.verifyToken,validator.postMessageToGroupValidation,  groupController.postGroupMessage)

router.get('/:groupid/members', tokenHandler.verifyToken, validator.GroupIdValidation, groupController.getGroupMembers);
export default router;
