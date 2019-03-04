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
}
