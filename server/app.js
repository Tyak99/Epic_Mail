import express from 'express';
import userRoutes from './routes/userRoutes';
import messageRoutes from './routes/messageRoutes';
import groupRoutes from './routes/groupRoutes';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
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
