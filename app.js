const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errorHandler } = require('./middlewares/errors');
const { celebrate, Joi } = require('celebrate');
const { setUser } = require('./controllers/users')

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/movies-explorer-db');

app.use(bodyParser.json());

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
}), setUser)

app.use((req, res, next) => {
  req.user = {
    _id: '61c1553737cf3918c833a882'
  };

  next();
});

app.use('/users', require('./routes/users'))
app.use('/movies', require('./routes/movies'))

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port:${PORT}`);
})
