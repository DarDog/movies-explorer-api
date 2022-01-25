const router = require('express')
  .Router();
const { isURL } = require('validator');
const { celebrate, Joi } = require('celebrate');

const { getMovies, setMovie, removeMovie } = require('../controllers/movies');

router.get('/movies/', getMovies);

router.post('/movies/',
//   celebrate({
//   body: Joi.object({
//     country: Joi.string()
//       .required(),
//     director: Joi.string()
//       .required(),
//     duration: Joi.number()
//       .required(),
//     year: Joi.string()
//       .required(),
//     description: Joi.string()
//       .required(),
//     image: Joi.string()
//       .custom((value, helpers) => {
//         if (isURL(value)) return value;
//         return helpers.message('Поле image должно быть в формате URL');
//       })
//       .required(),
//     trailer: Joi.string()
//       .custom((value, helpers) => {
//         if (isURL(value)) return value;
//         return helpers.message('Поле trailer должно быть в формате URL');
//       })
//       .required(),
//     thumbnail: Joi.string()
//       .custom((value, helpers) => {
//         if (isURL(value)) return value;
//         return helpers.message('Поле thumbnail должно быть в формате URL');
//       })
//       .required(),
//     movieId: Joi.number()
//       .required(),
//     nameRU: Joi.string()
//       .required(),
//     nameEN: Joi.string()
//       .required(),
//   }),
// }),
  setMovie);

router.delete('/movies/:movieId', celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.number(),
    }),
}), removeMovie);

module.exports = router;
