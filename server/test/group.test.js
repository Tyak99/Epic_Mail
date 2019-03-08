import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';
import GroupService from '../services/groupServices';

const { expect } = chai;
chai.use(chaiHttp);

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

describe('Test create group', () => {
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

  describe('Test create a group route', () => {
    it('should return 404 on wrong api call', (done) => {
      chai
        .request(server)
        .post('/api/v1/wrongapi')
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done();
        });
    });
    it('should return error when needed details arent passed along', (done) => {
      chai
        .request(server)
        .post('/api/v1/groups')
        .send({})
        .end((err, res) => {
          expect(res.body.status).an.eql(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
    it('should respond with the created group object if its created successfully', (done) => {
      chai
        .request(server)
        .post('/api/v1/groups')
        .sned({ name: 'Team 1', members: ['name@mail.com', 'hope@mail.com'] })
        .end((err, res) => {
          expect(res.body.status).property.eql(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('name');
          expect(res.body.data)
            .to.have.property('members')
            .to.be.an('array');
          done();
        });
    });
  });
});
