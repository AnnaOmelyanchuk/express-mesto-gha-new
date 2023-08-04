const { default: mongoose } = require('mongoose');
const Users = require('../models/users');

module.exports.getUsers = (req, res) => {
  Users.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .then((user) => {
      if (user != null) {
        return res.status(200).send({ data: user });
      }
      return res.status(404).send({ message: 'Нет такого id' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный id' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  Users.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка в данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка в данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  Users.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Ошибка в данных' });
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    });
};
