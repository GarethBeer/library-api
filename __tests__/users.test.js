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

    it('it errors if not a vaild email is entered', done => {
      request(app)
        .post('/users')
        .send({
          firstName: 'Gareth',
          lastName: 'Beer',
          email: 'thisisntavalidemail@',
          password: 'blahblah123',
        })
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.errors.email).toBe('Invalid email address');
        });

      User.countDocuments({}, function(err, count) {
        console.log(count);
        expect(count).toBe(0);
        done();
      });
    });

    it('errors if password is not 8 or more characters long', done => {
      request(app)
        .post('/users')
        .send({
          firstName: 'Gareth',
          lastName: 'Beer',
          email: 'hellow@hotmail.com',
          password: 'blah',
        })
        .then(res => {
          expect(res.status).toBe(400);
          expect(res.body.errors.password).toBe('Password must be at least 8 characters long');
          done();
        });
    });
  });
});
