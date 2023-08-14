const { default: mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/users');

const { NODE_ENV, JWT_SECRET } = process.env;

const BadRequesError = require('../error/bad_request_error_400');
const NotFoundError = require('../error/not_found_error_404');
const ConflictError = require('../error/conflict_error-409');

module.exports.getUsers = (req, res, next) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users
    .findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Нет пользователя с таким id');
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequesError('Пароль не введен');
  } else {
    bcrypt.hash(req.body.password, 10)
      .then((hash) => Users.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      }))
      .then((user) => {
        res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === 'MongoError' || err.code === 11000) {
          next(new ConflictError('Указанный email уже занят'));
        }
        if (err instanceof mongoose.Error.ValidationError) {
          next(new BadRequesError('Ошибка в данных'));
        }
        next(err);
      });
  }
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequesError('Ошибка в данных'));
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequesError('Ошибка в данных'));
      }
      next(err);
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

module.exports.getUser = (req, res, next) => {
  Users.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new BadRequesError('Нет такого пользователя');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequesError('Некорректный id'));
      }
      next(err);
    });
};
