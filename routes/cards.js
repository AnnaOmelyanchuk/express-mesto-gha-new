const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), getCards);

router.delete('/cards/:cardId', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), deleteCard);

router.post('/cards', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
  body: Joi.object().keys({
    name: Joi.string(),
    link: Joi.string().pattern(new RegExp('^(http|https)://[^ "]+$')),
  }),
}), createCard);

router.put('/cards/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), likeCard);

router.delete('/cards/:cardId/likes', celebrate({
  headers: Joi.object().keys({
    authorization: Joi.string(),
    cardId: Joi.string().alphanum().length(24),
  }).unknown(true),
  body: Joi.object().keys({

  }),
}), dislikeCard);

module.exports = router;
