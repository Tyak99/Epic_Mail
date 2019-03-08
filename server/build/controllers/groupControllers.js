"use strict";

var _groupServices = _interopRequireDefault(require("../services/groupServices"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var groupServices = new _groupServices.default();

exports.postGroup = function (req, res) {
  var _req$body = req.body,
      name = _req$body.name,
      members = _req$body.members;

  if (!name || !members) {
    return res.send({
      status: 400,
      error: 'Provide the neccessary details'
    });
  }

  var group = groupServices.postGroup(req.body);
  return res.send({
    status: 201,
    data: group
  });
};
//# sourceMappingURL=groupControllers.js.map