const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequesError = require('../error/bad_request_error_400');
const NotFoundError = require('../error/not_found_error_404');
const ServerError = require('../error/server_error_500');

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
      return res.status(new NotFoundError().statusCode).send({ message: 'Нет такого id' });
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
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    res.status(new BadRequesError().statusCode).send({ message: 'Пароль не введен' });
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        Users.create({
          name,
          about,
          avatar,
          email,
          password: hash,
        });
      })
      .then((user) => { res.send({ data: user }); })
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          res.status(409).send({ message: 'Указанный email уже занят' });
          return;
        }
        if (err instanceof mongoose.Error.ValidationError) {
          res.status(new BadRequesError().statusCode).send({ message: 'Ошибка в данных' });
        }
        res.status(new ServerError().statusCode).send({ message: 'Произошла ошибка' });
      });
  }
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(new BadRequesError().statusCode).send({ message: 'Ошибка в данных' });
      }
      return res.status(new ServerError().statusCode).send({ message: 'Произошла ошибка' });
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
        return res.status(new BadRequesError().statusCode).send({ message: 'Ошибка в данных' });
      }
      return res.status(new ServerError().statusCode).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return Users.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.getUser = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(new NotFoundError().statusCode).send({ message: `Нет такого пользователя - ${req.params.userId}` });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(new BadRequesError().statusCode).send({ message: 'Некорректный id' });
      }
      return res.status(new ServerError().statusCode).send({ message: 'Произошла ошибка' });
    });
};
