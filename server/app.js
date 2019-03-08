import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import groupRoutes from './routes/groupRoutes';

require('dotenv').config();

const app = express();

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Epic Mail',
    version: '1.0.0',
    description: 'Exchange message/information',
  },
  host: 'localhost:3000',
  basePath: '/',
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API docs
  apis: ['./server/routes/*.js'],
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// serve swagger
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/groups', groupRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to epic mail');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('server has started');
});

module.exports = app;
