const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/User');

describe('Users', () => {
  beforeAll(done => {
    const url = process.env.DATABASE_CONN;
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    done();
  });

  beforeEach(done => {
    User.deleteMany({}, () => {
      done();
    });
  });

  afterAll(done => {
    mongoose.connection.close();
    done();
  });

  describe('POST/ user', () => {
    it('posts users details to the database', done => {
      request(app)
        .post('/users')
        .send({
          firstName: 'Doug',
          lastName: 'Douglas',
          email: 'DD@hotmail.org',
          password: 'hello12345',
        })
        .then(res => {
          expect(res.status).toBe(201);

          User.findById(res.body._id, (err, user) => {
            expect(user.firstName).toBe('Doug');
            expect(user.lastName).toBe('Douglas');
            expect(user.email).toBe('DD@hotmail.org');
            expect(user.password).not.toBe('hello12345');
            expect(user.password.length).toBe(60);
            expect(res.body).not.toHaveProperty('password');
            done();
          });
        });
    });
  });
});
