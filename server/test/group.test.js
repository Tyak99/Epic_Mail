import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../app';

const { expect } = chai;
chai.use(chaiHttp);


describe('Test create group', () => {
  describe('Test create a group route', () => {
    it('should return 404 on wrong api call', (done) => {
      chai
        .request(server)
        .post('/api/v2/wrongapi')
        .end((err, res) => {
          expect(res.status).to.eql(404);
          done();
        });
    });
    it('should return error when needed details arent passed along', (done) => {
      chai
        .request(server)
        .post('/api/v2/groups')
        .send({})
        .end((err, res) => {
          expect(res.body.status).an.eql(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.eql('Please input group name');
          done();
        });
    });
    it('should respond with the created group object if its created successfully', (done) => {
      chai
        .request(server)
        .post('/api/v2/groups')
        .send({ name: 'Team 1'})
        .end((err, res) => {
          expect(res.body.status).to.eql(201);
          expect(res.body.data).to.be.an('object');
          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('name');
          done();
        });
    });
  });
});
