const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const regExp = require('../regexp/regexp');

const { getMovies, setMovie, removeMovie } = require('../controllers/movies');

router.get('/movies/', getMovies());

router.post('/movies/', celebrate({
  body: Joi.object({
    country: Joi.string()
      .required(),
    director: Joi.string()
      .required(),
    duration: Joi.number()
      .required(),
    year: Joi.string()
      .required(),
    description: Joi.string()
      .required(),
    image: Joi.string()
      .pattern(regExp)
      .required(),
    trailer: Joi.string()
      .pattern(regExp)
      .required(),
    thumbnail: Joi.string()
      .pattern(regExp)
      .required(),
    movieId: Joi.number()
      .required(),
    nameRU: Joi.string()
      .required(),
    nameEN: Joi.string()
      .required(),
  }),
}), setMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.string()
        .hex()
        .length(24),
    }),
}), removeMovie);

module.exports = router;
