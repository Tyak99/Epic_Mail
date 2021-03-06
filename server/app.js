import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import cors from 'cors';
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
  host: 'https://intense-thicket-60071.herokuapp.com/',
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

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'redoc.html'));
});

app.use(cors());
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
  res.redirect('/docs');
});

app.use((req, res, next)  => {
  res.status(404).json('Error! Route does not exist')
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('server has started');
});

module.exports = app;
