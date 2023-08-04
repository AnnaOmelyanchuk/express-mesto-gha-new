const { default: mongoose } = require('mongoose');
const Cards = require('../models/cards');

const BadRequesError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ServerError).send({ message: 'Произошла ошибка', err }));
};

module.exports.createCard = (req, res) => {
  Cards.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BadRequesError).send({ message: 'Ошибка в данных' });
      }
      return res.status(NotFoundError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(
    req.params.cardId,
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      return res.status(NotFoundError).send({ message: 'Нет такого id' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BadRequesError).send({ message: 'Некорректный id' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      return res.status(NotFoundError).send({ message: 'Нет такого id' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BadRequesError).send({ message: 'Некорректный id' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      return res.status(NotFoundError).send({ message: 'Нет такого id' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BadRequesError).send({ message: 'Некорректный id' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};
