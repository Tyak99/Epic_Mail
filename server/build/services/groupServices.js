"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Group = _interopRequireDefault(require("../models/Group"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GroupService =
/*#__PURE__*/
function () {
  function GroupService() {
    _classCallCheck(this, GroupService);
  }

  _createClass(GroupService, [{
    key: "allGroups",
    value: function allGroups() {
      this.groups = [{
        id: 1,
        name: 'Team 7',
        members: ['superuser@mail.com', 'john@mail.com']
      }];
      return this.groups.map(function (groups) {
        var group = new _Group.default();
        group.id = groups.id;
        group.name = groups.name;
        group.members = groups.members;
        return group;
      });
    }
  }, {
    key: "postGroup",
    value: function postGroup(data) {
      var allGroups = this.allGroups();
      var newId = allGroups.length + 1;

      if (!data) {
        return 'error';
      }

      if (!data.name || !data.members || data.members.length < 1) {
        return 'error';
      }

      var group = new _Group.default();
      group.id = newId;
      group.name = data.name;
      group.members = data.members;
      return group;
    }
  }]);

  return GroupService;
}();

exports.default = GroupService;
//# sourceMappingURL=groupServices.js.map