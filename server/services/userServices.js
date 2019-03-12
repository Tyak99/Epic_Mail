import User from '../models/User';

export default class UserService {
  constructor() {
    this.users = [
      {
        id: 1,
        firstName: 'Tunde',
        lastName: 'Nasri',
        email: 'superuser@mail.com',
        password: 'secret',
      },
    ];
  }

  fetchAll() {
    return this.users.map((data) => {
      const user = new User();
      user.id = data.id;
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.email = data.email;
      user.password = data.password;
      return user;
    });
  }

  createUser(data) {
    const allUser = this.users;
    const newUser = { id: allUser.length + 1, ...data };
    allUser.push(newUser);
    return newUser;
  }

  loginUser(data) {
    const foundUser = this.users.find(element => element.email == data.email);
    if (!foundUser) {
      return 'NO USER';
    }
    if (foundUser.password !== data.password) {
      return 'Invalid password';
    }
    return foundUser;
  }

  findUserByEmail(email) {
    const foundUser = this.users.find((user) => user.email == email);
    if (!foundUser) {
      return 'error';
    }
    return foundUser;
  }
}
