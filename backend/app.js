const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const helmet = require('helmet');
const cors = require('cors');
const { auth } = require('./middlewares/auth');
const NotFoundError = require('./error/not_found_error_404');
const errorHandler = require('./middlewares/errorHandler');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(requestLogger);

app.use(cors());

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth);
app.use('/', require('./routes/cards'));
app.use('/', require('./routes/users'));

app.use(errorLogger);

app.use((req, res, next) => {
  next(new NotFoundError('Не туда:('));
});

app.use(errorHandler);

app.listen(PORT);
