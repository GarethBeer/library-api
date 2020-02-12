const express = require('express');

const userController = require('./controllers/user');

const app = express();
app.use(express.json());

app.post('/users', userController.create);

module.exports = app;
