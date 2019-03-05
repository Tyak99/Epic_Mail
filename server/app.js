import express from 'express';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1/auth', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to epic mail');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('server has started');
});

module.exports = app;
