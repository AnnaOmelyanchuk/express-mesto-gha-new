const { default: mongoose } = require('mongoose');
const Cards = require('../models/cards');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((Cards) => res.status(200).send({ data: Cards }))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.createCard = (req, res) => {
  Cards.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка в данных' })
      }
      else
        return res.status(500).send({ message: 'Произошла ошибка' })
    }
    );
};

module.exports.deleteCard = (req, res, err) => {
  Cards.findByIdAndRemove(
    req.params.cardId,
  )
  .then((card) => {
    if (card != null) {
      res.status(200).send({ data: card })
    } else {
      return res.status(404).send({ message: 'Нет такого id' })
    }})
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Некорректный id' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  })
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate
    (
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (card != null) {
        res.status(200).send({ data: card })
      } else {
        return res.status(404).send({ message: 'Нет такого id' })
      }})
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный id' })
      }
      return res.status(500).send({ message: 'Произошла ошибка' })
    })
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .then((card) => {
    if (card != null) {
      res.status(200).send({ data: card })
    } else {
      return res.status(404).send({ message: 'Нет такого id' })
    }})
  .catch((err) => {
    if (err instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Некорректный id' })
    }
    return res.status(500).send({ message: 'Произошла ошибка' })
  })
};
