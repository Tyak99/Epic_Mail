"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jwtSimple = _interopRequireDefault(require("jwt-simple"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tokenFunction = function tokenFunction(user) {
  var timestamp = new Date().getTime();
  return _jwtSimple.default.encode({
    sub: user.id,
    iat: timestamp
  }, process.env.secret);
};

var _default = tokenFunction;
exports.default = _default;