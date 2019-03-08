import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const { expect } = chai;

describe('Test create a group method', () => {
  it('should return error if group name isnt specifid on creation', (done) => {
    const createGroup = groupServices.postGroup();
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
