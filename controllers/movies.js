const Movies = require('../models/movie');
const BadRequestError = require('../errors/BadRequest');
const ForbiddenError = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFound');

module.exports.getMovies = (req, res, next) => {
  Movies.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.setMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const { _id } = req.user;

  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: _id,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(err.message || 'Переданы некорректные данные при сохранение фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.removeMovie = (req, res, next) => {
  Movies.findOne({movieId: req.params.movieId})
    .orFail(new NotFoundError(`Фильм с ID:${req.params.movieId} не найден`))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id.toString()) {
        return movie.remove()
          .then(() => res.status(200)
            .send({ message: 'Фильм успешно удален' }));
      }
      throw new ForbiddenError(`
        message: Не возможно удалить фильм,
        isOwner: ${movie.owner.toString() === req.user._id.toString()},
        movieOwner: ${movie.owner.toString()},
        userId: ${req.user._id.toString()},
        thisMovie: ${movie}
      `);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};
