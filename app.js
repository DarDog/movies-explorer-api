const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const auth = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/errors');
const { celebrate, Joi, errors } = require('celebrate');
const { setUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

require('dotenv')
  .config();

mongoose.connect('mongodb://localhost:27017/movies-explorer-db');

app.use(bodyParser.json());
app.use(cookieParser());

app.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required(),
      name: Joi.string()
        .min(2)
        .max(30),
      password: Joi.string()
        .required()
        .min(8)
        .max(35),
    }),
}), setUser);

app.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
}), login);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/movies', require('./routes/movies'));

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port:${PORT}`);
});
