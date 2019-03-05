import User from '../models/User';

export default class UserService {
  fetchAll() {
    this.users = [
      {
        id: 1,
        firstName: 'Tunde',
        lastName: 'Nasri',
        email: 'superuser@mail.com',
        password: 'secret',
      },
    ];
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
    const allUser = this.fetchAll();
    const newUser = { id: allUser.length + 1, ...data };
    allUser.push(newUser);
    return newUser;
  }

  loginUser(data) {
    const user = this.fetchAll()[0];

    if (data.email !== user.email) {
      return 'Email already in use';
    }
    if (data.password !== user.password) {
      return 'Invalid password';
    }
    return user;
  }
}
