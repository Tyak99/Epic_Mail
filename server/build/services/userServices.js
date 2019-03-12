"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _User = _interopRequireDefault(require("../models/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var UserService =
/*#__PURE__*/
function () {
  function UserService() {
    _classCallCheck(this, UserService);
  }

  _createClass(UserService, [{
    key: "fetchAll",
    value: function fetchAll() {
      this.users = [{
        id: 1,
        firstName: 'Tunde',
        lastName: 'Nasri',
        email: 'superuser@mail.com',
        password: 'secret'
      }];
      return this.users.map(function (data) {
        var user = new _User.default();
        user.id = data.id;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.email = data.email;
        user.password = data.password;
        return user;
      });
    }
  }, {
    key: "createUser",
    value: function createUser(data) {
      var allUser = this.fetchAll();

      var newUser = _objectSpread({
        id: allUser.length + 1
      }, data);

      allUser.push(newUser);
      return newUser;
    }
  }, {
    key: "loginUser",
    value: function loginUser(data) {
      var user = this.fetchAll()[0];

      if (data.email !== user.email) {
        return 'Email already in use';
      }

      if (data.password !== user.password) {
        return 'Invalid password';
      }

      return user;
    }
  }, {
    key: "findUserByEmail",
    value: function findUserByEmail(email) {
      var users = this.fetchAll();
      var foundUser = users.find(function (user) {
        return user.email == email;
      });

      if (!foundUser) {
        return 'error';
      }

      return foundUser;
    }
  }]);

  return UserService;
}();

exports.default = UserService;
//# sourceMappingURL=userServices.js.map