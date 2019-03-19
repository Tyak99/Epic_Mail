import jwt from 'jsonwebtoken';

const tokenFunction = (user) => {
  return jwt.sign({ sub: user.id }, process.env.secret, { expiresIn: '1h' });
};

module.exports = {
  tokenFunction,
};
