const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const { setUser, login } = require('../controllers/users');

router.post('/signup', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Поле "email" должно соответствовать формату электронной почты',
          'string.required': 'Поле "email" обязательно должно заполнено',
        }),
      name: Joi.string()
        .min(2)
        .max(30)
        .required()
        .messages({
          'string.required': 'Поле "name" обязательно должно заполнено',
          'string.min': 'Поле "name" должно быть длиной не меньше 2 символов',
          'string.max': 'Поле "name" должно быть длиной не больше 30 символов',
        }),
      password: Joi.string()
        .required()
        .min(8)
        .max(35)
        .messages({
          'string.required': 'Поле "password" обязательно должно заполнено',
          'string.min': 'Поле "password" должно быть длиной не меньше 8 символов',
          'string.max': 'Поле "password" должно быть длиной не больше 35 символов',
        }),
    }),
}), setUser);

router.post('/signin', celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Поле "email" должно соответствовать формату электронной почты',
          'string.required': 'Поле "email" обязательно должно заполнено',
        }),
      password: Joi.string()
        .required()
        .messages({
          'string.required': 'Поле "password" обязательно должно заполнено',
        }),
    }),
}), login);

module.exports = router;
