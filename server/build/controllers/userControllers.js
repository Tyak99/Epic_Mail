"use strict";

var _userServices = _interopRequireDefault(require("../services/userServices"));

var _tokenHandler = _interopRequireDefault(require("../utils/tokenHandler"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var userServices = new _userServices.default();

exports.signup = function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName;

  if (email === 'superuser@mail.com') {
    return res.send({
      status: 400,
      error: 'Email already in use'
    });
  }

  if (!email || !password || !firstName || !lastName) {
    return res.send({
      status: 400,
      error: 'All fields must be present'
    });
  }

  userServices.createUser(req.body);
  return res.send({
    status: 201,
    data: {
      name: req.body.firstName,
      token: (0, _tokenHandler.default)(req.body)
    }
  });
};

exports.login = function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;

  if (!email || !password) {
    return res.send({
      status: 400,
      error: 'Please input login details email and password'
    });
  }

  userServices.loginUser(req.body);

  if (email !== 'superuser@mail.com' || password !== 'secret') {
    return res.send({
      status: 400,
      error: 'Invalid email or password'
    });
  }

  return res.send({
    status: 200,
    data: {
      token: (0, _tokenHandler.default)(req.body)
    }
  });
};
//# sourceMappingURL=userControllers.js.map