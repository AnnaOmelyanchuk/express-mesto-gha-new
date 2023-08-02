const Users = require('../models/users');
const { default: mongoose } = require('mongoose');

const determineError = (err, user) => {
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: 'Переданны некорректные данные', err })
    return;
  }
  if (!user) {
    res.status(404).send({ message: 'карточка не найдена', err })
    return;
  }
  res.status(500).send({ message: 'ошибка по умолчанию', err })
  return;
};

module.exports.getUsers = (req, res, err) => {
  Users.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(determineError(err, req.params._id));
};

module.exports.getUserById = (req, res, err) => {
  if (!users[req.params.id]) {
    res.send(`Такого пользователя не существует`);
    return;
  }
  const { name, about, avatar } = users[req.params.id];

  res.send({ name, about, avatar })
    .catch(determineError(err, req.params._id));
};

module.exports.createUser = (req, res) => {
  Users.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((users) => res(201).send({ data: users }))
    .catch(err => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.updateUserInfo = (req, res, err) => {
  Users.findByIdAndUpdate(req.params._id, { name: req.body.name, about: req.body.about })
    .then((user) => res.send({ data: user }))
    .catch(determineError(err, req.params._id));
};

module.exports.updateUserAvatar = (req, res, err) => {
  Users.findByIdAndUpdate(req.params._id, { avatar: req.body.avatar })
    .then((user) => res.send({ data: user }))
    .catch(determineError(err, req.params._id));
};