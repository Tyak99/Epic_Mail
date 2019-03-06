import jwt from 'jwt-simple';

const tokenFunction = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.secret);
};

export default tokenFunction;
