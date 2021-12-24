const router = require('express').Router();
const NotFoundError = require('../errors/NotFound');

router.use('/', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
