const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errors');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

const { NODE_ENV, PORT = 3000, DB } = process.env;
const app = express();

require('dotenv')
  .config();

app.use(cors({
  option: [
    'http://localhost:3000',
    'http://movie.explorer.subb.front.nomoredomains.rocks',
    'https://movie.explorer.subb.front.nomoredomains.rocks',
  ],
  origin: [
    'http://localhost:3000',
    'http://movie.explorer.subb.front.nomoredomains.rocks',
    'https://movie.explorer.subb.front.nomoredomains.rocks',
  ],
  credential: true,
}));

mongoose.connect(`${NODE_ENV === 'production'
  ? DB
  : 'mongodb://localhost:27017/moviesdb'}`);

app.use(bodyParser.json());
app.use(cookieParser());

app.use(requestLogger);

app.use(require('./routes/auth'));

app.use(auth);

app.use(require('./routes/users'));
app.use(require('./routes/movies'));

app.use(require('./routes/signout'));

app.use(require('./routes/notFound'));

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port:${PORT}`);
});
