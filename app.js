const express = require('express');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errors')

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/movies-explorer-db');

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port:${PORT}`);
})
