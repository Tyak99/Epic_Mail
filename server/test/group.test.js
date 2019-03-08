import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import GroupService from '../services/groupServices';

const { expect } = chai;

const groupServices = new GroupService();

describe('Test all group service method', () => {
  it('should return an array of group objects', (done) => {
    const groups = groupServices.allGroups();
    expect(groups).to.be.an('array');
    groups.forEach((group) => {
      expect(group).an.have.property('id');
      expect(group).an.have.property('name');
      expect(group)
        .an.have.property('members')
        .to.be.an('array');
    });
    done();
  });
});
describe('Test create a group method', () => {
  it('should return error if group no data is passed along the request to create group', (done) => {
    const createGroup = groupServices.postGroup();
    expect(createGroup).to.eql('error');
    done();
  });
  it('should return error if any required data isnt passed along request', (done) => {
    const createGroup = groupServices.postGroup({ name: 'Team 2' });
    expect(createGroup).to.eql('error');
    done();
  });
  it('should return an object of the created group details', (done) => {
    const group = {
      name: 'Akatsuki',
      members: ['superuser@mail.com', 'tunde@mail.com'],
    };
    const createdGroup = groupServices.postGroup(group);
    expect(createdGroup).to.be.an('object');
    expect(createdGroup).an.have.property('id');
    expect(createdGroup).an.have.property('name');
    done();
  });
});
