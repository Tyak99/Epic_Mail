"use strict";

var _express = _interopRequireDefault(require("express"));

var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));

var _path = _interopRequireDefault(require("path"));

var _userRoutes = _interopRequireDefault(require("./routes/userRoutes"));

var _messageRoutes = _interopRequireDefault(require("./routes/messageRoutes"));

var _groupRoutes = _interopRequireDefault(require("./routes/groupRoutes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

var app = (0, _express.default)(); // swagger definition

var swaggerDefinition = {
  info: {
    title: 'Epic Mail',
    version: '1.0.0',
    description: 'Exchange message/information'
  },
  host: 'https://intense-thicket-60071.herokuapp.com/',
  basePath: '/'
}; // options for the swagger docs

var options = {
  // import swaggerDefinitions
  swaggerDefinition: swaggerDefinition,
  // path to the API docs
  apis: ['./server/routes/*.js']
}; // initialize swagger-jsdoc

var swaggerSpec = (0, _swaggerJsdoc.default)(options);
app.get('/docs', function (req, res) {
  res.sendFile(_path.default.join(__dirname, 'redoc.html'));
});
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
})); // serve swagger

app.get('/swagger.json', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.use('/api/v1/auth', _userRoutes.default);
app.use('/api/v1/messages', _messageRoutes.default);
app.use('/api/v1/groups', _groupRoutes.default);
app.get('/', function (req, res) {
  res.send('Welcome to epic mail');
});
var PORT = 3000;
app.listen(PORT, function () {
  console.log('server has started');
});
module.exports = app;
//# sourceMappingURL=app.js.map