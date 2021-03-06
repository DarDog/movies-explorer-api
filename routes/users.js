const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);
router.patch('/users/me', celebrate({
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    email: Joi.string()
      .email()
      .required(),
  }),
}), updateUserInfo);

module.exports = router;
