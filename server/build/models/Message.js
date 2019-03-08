"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Message = function Message() {
  _classCallCheck(this, Message);

  this.id = null;
  this.createdOn = new Date();
  this.subject = null;
  this.message = null;
  this.status = null;
  this.senderId = null;
  this.receiverId = null;
  this.parentMessageId = null;
};

exports.default = Message;
//# sourceMappingURL=Message.js.map