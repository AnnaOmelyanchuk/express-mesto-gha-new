const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./error/not_found_error_404');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth);
app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use((req, res, next) => {
  next(new NotFoundError('Не туда:('));
});

app.use(errorHandler);

app.listen(PORT);
