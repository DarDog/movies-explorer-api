const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const { setUser, login } = require('../controllers/users');

router.post('/signup', celebrate({
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

router.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .required(),
    }),
}), login);
