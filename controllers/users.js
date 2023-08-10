const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

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
      if (user) {
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
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => Users.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
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

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(() => {
      res.status(401).send({ message: 'Неправильные почта и пароль' });
    });
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Нет такого пользователя - ${req.params.userId}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BadRequesError).send({ message: 'Некорректный id' });
      }
      return res.status(ServerError).send({ message: 'Произошла ошибка' });
    });
};
