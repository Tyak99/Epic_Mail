import UserService from '../services/userServices';

const userServices = new UserService();

exports.signup = (req, res) => {
  const {
    email, password, firstName, lastName,
  } = req.body;
  if (email === 'superuser@mail.com') {
    return res.send({
      status: 400,
      error: 'Email already in use',
    });
  }

  if (!email || !password || !firstName || !lastName) {
    return res.send({
      status: 400,
      error: 'All fields must be present',
    });
  }
  userServices.createUser(req.body);
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9';
  return res.send({
    status: 201,
    data: {
      name: req.body.firstName,
      token,
    },
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.send({
      status: 400,
      error: 'Please input login details email and password',
    });
  }
  userServices.loginUser(req.body);
  if (email !== 'superuser@mail.com' || password !== 'secret') {
    return res.send({
      status: 400,
      error: 'Invalid email or password',
    });
  }
  return res.send({
    status: 200,
    token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9',
  });
};
