const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');

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
      runValidators: true
    },
  )
    .orFail(new Error('InvalidId'))
    .then(user => res.send(user))
    .catch(err => {
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
