"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _groupControllers = _interopRequireDefault(require("../controllers/groupControllers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();
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


router.post('/', _groupControllers.default.postGroup);
var _default = router;
exports.default = _default;
//# sourceMappingURL=groupRoutes.js.map