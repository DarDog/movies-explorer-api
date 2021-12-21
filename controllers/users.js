const User = require('../models/user');
const bcrypt = require('bcrypt');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then(user => res.send(user))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('InvalidId'))
    .then(user => res.send(user))
    .catch(err => {
      console.log(err);
      if (err.message === 'InvalidId') {
        next(new NotFoundError(`Пользователь с ID: ${req.user._id} не найден`));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создание пользователя'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Введен некорректный ID'));
      }
      next(err);
    });
};

module.exports.setUser = (req, res, next) => {
  const { email, name, password } = req.body;

  bcrypt.hash(password, 10)
    .then(hash => User.create({
      email,
      name,
      password: hash,
    }))
    .then(() =>
      res.send({
        data: {
          name,
          email
        }
      })
    )
    .catch(err => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};
