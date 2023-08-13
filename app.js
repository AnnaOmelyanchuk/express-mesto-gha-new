const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { errors } = require('celebrate');
const router = require('express').Router();
const {
  auth,
} = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();
app.listen(PORT);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

router.use(auth);
app.use('/', auth);
app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use(errors());

app.use((err, req, res, next) => {
  res.send({ message: err.message });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'НЕ туда :((',
  });
});
