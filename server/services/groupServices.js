import Group from '../models/Group';

export default class GroupService {
  allGroups() {
    this.groups = [
      {
        id: 1,
        name: 'Team 7',
        members: ['superuser@mail.com', 'john@mail.com'],
      },
    ];
    return this.groups.map((groups) => {
      const group = new Group();
      group.id = groups.id;
      group.name = groups.name;
      group.members = groups.members;
      return group;
    });
  }

  postGroup(data) {
    const allGroups = this.allGroups();
    const newId = allGroups.length + 1;
    if (!data) {
      return 'error';
    }
    if (!data.name || !data.members || data.members.length < 1) {
      return 'error';
    }
    const group = new Group();
    group.id = newId;
    group.name = data.name;
    group.members = data.members;
    return group;
  }
}
