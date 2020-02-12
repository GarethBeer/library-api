const User = require('../models/User');

exports.create = (req, res) => {
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
  });
  user.save().then(() => {
    const secureUser = user.sanitise(user);
    res.status(201).json(secureUser);
  });
};