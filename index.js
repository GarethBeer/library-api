const mongoose = require('mongoose');
const app = require('./src/app');

const url = process.env.DATABASE_CONN;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
  app.listen(3000, () => {
    // eslint-disable-next-line no-console
    console.log('App listening on port 3000');
  });
});
