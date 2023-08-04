const { default: mongoose } = require('mongoose');
const Users = require('../models/users');

const BadRequesError = 400;
const NotFoundError = 404;
const ServerError = 500;

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (user != null) {
        return res.send({ data: user });
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

module.exports.createUser = (req, res) => {
  Users.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BadRequesError).send({ message: 'Ошибка в данных' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BadRequesError).send({ message: 'Ошибка в данных' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BadRequesError).send({ message: 'Ошибка в данных' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};
