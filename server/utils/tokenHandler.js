import jwt from 'jsonwebtoken';
import db from '../database/index';

const tokenFunction = (user) => {
  return jwt.sign({ sub: user.id }, process.env.secret, { expiresIn: '1h' });
};
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({
      status: 'Failed',
      error: 'Unathorized, token must be provided',
    });
  }
  jwt.verify(token, process.env.secret, (err, decoded) => {
    if (!decoded) {
      return res.status(401).json({
        status: 'Failed',
        error: 'Unable to authenticate token',
      });
    }
    db.query(
      'SELECT * FROM users WHERE id = $1',
      [decoded.sub],
      (err, user) => {
        if (!user.rows[0]) {
          return res.status(401).json({
            status: 'Failed',
            error: 'Unable to authenticate token',
          });
        }
        req.decoded = decoded;
        next();
      }
    );
  });
};

module.exports = {
  tokenFunction,
  verifyToken,
};
