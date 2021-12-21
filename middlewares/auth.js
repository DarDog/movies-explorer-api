const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    next(new UnauthorizedError('У этому ресурсу есть доступ только для авторизированных пользователей'));
  }

  let payload;
  try {
    payload = jwt.verify(token, `${NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret'}`);
  } catch (err) {
    next(new UnauthorizedError('Ваш токен устарел или не валиден'));
  }

  req.user = payload

  next();
}
