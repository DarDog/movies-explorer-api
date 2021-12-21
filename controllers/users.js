const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');
const BadRequestError = require('../errors/BadRequest');
const ConflictError = require('../errors/Conflict');
const UnauthorizedError = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .orFail(new Error('InvalidEmail'))
    .then(user => {
      bcrypt.compare(password, user.password)
        .then(matched => {
          if (!matched) {
            next(new UnauthorizedError('Неправильный email или password'));
          } else {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              { expiresIn: '7d' },
            );
            res
              .cookie('jwt', token, {
                maxAge: 3600000 * 24 * 7,
                httpOnly: true,
                //TODO Вернуть настройки куки перед деплоем
                // sameSite: 'None',
                // secure: true,
              })
              .end();
          }
        });
    })
    .catch(err => {
      if (err.message === 'InvalidEmail') {
        next(new UnauthorizedError('Неправильный email или password'));
      } else {
        next(err);
      }
    });
};
