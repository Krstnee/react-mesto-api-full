const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const isUrl = require('validator/lib/isURL');
const BadRequest = require('../errors/400-BadRequestError');
const {
  getUsers, getSelfInfo, getUserById, profileUpdate, avatarUpdate,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getSelfInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), profileUpdate);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom((link) => {
      if (isUrl(link, { require_protocol: true })) {
        return link;
      }
      throw new BadRequest('Некорректный адрес URL');
    }),
  }),
}), avatarUpdate);

module.exports = router;
