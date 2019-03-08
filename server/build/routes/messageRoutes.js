"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _messageControllers = _interopRequireDefault(require("../controllers/messageControllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();
/**
 * @swagger
 * definitions:
 *   Message:
 *     properties:
 *       subject:
 *         type: string
 *       message:
 *         type: string
 *       status:
 *         type: string
 *       createdOn:
 *         type: string
 *       senderId:
 *         type: integer
 *       receiverId:
 *         type: integer
 *       parentMessageId:
 *         type: integer
 */

/**
 * @swagger
 * /api/v1/messages:
 *   get:
 *     summary: Get all received messages
 *     description: Returns a list of user's received emails
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: An array of received messages
 *         schema:
 *           $ref: '#/definitions/Message'
 */

/**
 * @swagger
 * /api/v1/messages:
 *   post:
 *     tags:
 *       - Messages
 *     description: Send an email to an individual
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: message
 *         description: message object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Message'
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Please input all the required data
 *       404:
 *         description: Email not found
 */

/**
 * @swagger
 * /api/v1/messages/sent:
 *   get:
 *     summary: Get all sent messages
 *     description: Returns a list of user's sent emails
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: An array of sent messages
 *         schema:
 *           $ref: '#/definitions/Message'
 */

/**
 * @swagger
 * /api/v1/messages/unread:
 *   get:
 *     summary: Get all user's unread messages
 *     description: Returns a list of user's unread emails
 *     tags:
 *       - Messages
 *     responses:
 *       200:
 *         description: An array of unread messages
 *         schema:
 *           $ref: '#/definitions/Message'
 */

/**
 * @swagger
 * /api/v1/messages/{id}:
 *   get:
 *     tags:
 *       - Messages
 *     description: Returns a single user's message
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Message's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: A single message
 *         schema:
 *           $ref: '#/definitions/Message'
 */

/**
 * @swagger
 * /api/v1/messages/{id}:
 *   delete:
 *     tags:
 *       - Messages
 *     description: Deletes a single message
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Message's id
 *         in: path
 *         required: true
 *         type: integer
 *     responses:
 *       200:
 *         description: Message Successfully deleted
 *       400:
 *         description: No message with that id found
 *       404:
 *         description: No id present to locate resource
 */


router.post('/', _messageControllers.default.postMessage);
router.get('/', _messageControllers.default.getReceivedMessages);
router.get('/sent', _messageControllers.default.getSentMessages);
router.get('/unread', _messageControllers.default.getUnreadMessages);
router.get('/:id', _messageControllers.default.getMessageById);
router.delete('/:id', _messageControllers.default.deleteById);
var _default = router;
exports.default = _default;
//# sourceMappingURL=messageRoutes.js.map