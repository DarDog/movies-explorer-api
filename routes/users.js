const router = require('express')
  .Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo, updateUserInfo } = require('../controllers/users')

router.get('/me', getUserInfo);
router.patch('/me', celebrate({
  body: Joi.object({
    name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    email: Joi.string()
      .required()
  })
}), updateUserInfo);

module.exports = router;