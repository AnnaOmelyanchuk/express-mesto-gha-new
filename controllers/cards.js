const { default: mongoose } = require('mongoose');
const Cards = require('../models/cards');

const determineError = (err, card) => {
  if (err instanceof mongoose.Error.CastError){
    res.status(400).send({ message: 'Переданны некорректные данные', err })
    return;
  }
  if (!card) {
    res.status(404).send({ message: 'карточка не найдена', err })
  return;
  }
  res.status(500).send({ message: 'ошибка по умолчанию', err })
  return;
};

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then(() => res.status(200).send({ data: Cards }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.createCard = (req, res) => {
  Cards.create({
    name: req.body.name,
    link: req.body.link,
  })
    .then(() => res.send({ data: card }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка', err }));
};

module.exports.deleteCard = (req, res) => {
  Cards.findByIdAndRemove(
    req.params._id)
    .then(card => res.send({ data: card }))
    .catch(determineError(err, req.params._id));
};

module.exports.likeCard = (req, res) => {
  Cards.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
      .then(cards => res.send({ data: cards }))
      .catch(determineError(err, req.params._id)));
};

module.exports.dislikeCard = (req, res) => {
  Cards.findByIdAndUpdate(req.params._id,
    { avatar: req.body.avatar })
    .then(cards => res.send({ data: cards }))
    .catch(determineError(err, req.params._id));
};
