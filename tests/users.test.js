const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const userHelpers = require('./helpers/user-helpers');
const DataFactory = require('./helpers/data-factory');

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
      const data = DataFactory.user();
      userHelpers
        .signUp(app, data)
        .then(res => {
          expect(res.status).toBe(201);

          User.findById(res.body._id, (err, user) => {
            expect(user.firstName).toBe(data.firstName);
            expect(user.lastName).toBe(data.lastName);
            expect(user.email).toBe(data.email);
            expect(user.password).not.toBe('hello12345');
            expect(user.password.length).toBe(60);
            expect(res.body).not.toHaveProperty('password');
            done();
          });
        })
        .catch(error => done(error));
    });

    it('it errors if not a vaild email is entered', done => {
      const data = DataFactory.user({ email: '111111111@' });
      userHelpers.signUp(app, data).then(res => {
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
      const data = DataFactory.user({ password: 'pass' });
      userHelpers.signUp(app, data).then(res => {
        expect(res.status).toBe(400);
        expect(res.body.errors.password).toBe('Password must be at least 8 characters long');
        done();
      });
    });
  });
});
