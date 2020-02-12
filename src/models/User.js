const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: String,
  lastName: String,
  email: String,
  password: String,
});

userSchema.pre('save', function encryptPassword(next) {
  if (!this.isModified('password')) {
    next();
  } else {
    bcrypt.hash(this.password, 10, (error, hash) => {
      if (error) {
        return next(error);
      }
      this.password = hash;
      return next();
    });
  }
});

userSchema.methods.sanitise = function(obj) {
  const user1 = obj.toObject();
  const { password, ...rest } = user1;
  return rest;
};
const User = mongoose.model('user', userSchema);

module.exports = User;
