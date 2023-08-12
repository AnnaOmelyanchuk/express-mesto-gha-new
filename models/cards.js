const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательное поле'],
    minlength: [2, 'минимальное количество символов - 2'],
    maxlength: [30, 'максимальное количество символов - 30'],
  },
  link: {
    type: String,
    required: [true, 'Обязательное поле'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Обязательное поле'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('cards', cardSchema);
