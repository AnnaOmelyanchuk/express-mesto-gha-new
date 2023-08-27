const { default: mongoose } = require('mongoose');
const Cards = require('../models/cards');

const BadRequesError = require('../error/bad_request_error_400');
const NotFoundError = require('../error/not_found_error_404');
const ForbiddenError = require('../error/forbidden-error_403');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  Cards.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequesError('Ошибка в данных'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const userId = req.user._id;
  Cards.findById(
    req.params.cardId,
  )
    .then(async (card) => {
      if (!card) {
        throw new NotFoundError('Карточки с таким id не существует');
      }
      const ownerId = card.owner.toString();
      if (ownerId === userId) {
        const element = await Cards.deleteOne(card);
        res.send({ data: element });
      } else throw new ForbiddenError('Не твоя карточка:(');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      throw new NotFoundError('Нет такой карточки');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Cards.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        return res.send(card);
      }
      throw new NotFoundError('Нет такой карточки');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
        return;
      }
      next(err);
    });
};
