const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
  login,
} = require('../controllers/users');

router.post('/signin', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(new RegExp('^(http)s?://((?=.{3,253}$)((([^ ]){1,63}.[^ ]+)))$')),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}),
createUser);

router.get('/users', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), getUsers);

router.get('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), getUser);

router.get('/users/:userId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), getUserById);

router.patch('/users/me', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    avatar: Joi.string().pattern(new RegExp('^(http)s?://((?=.{3,253}$)((([^ ]){1,63}.[^ ]+)))$')),
  }).unknown(true),
}), updateUserAvatar);

module.exports = router;
