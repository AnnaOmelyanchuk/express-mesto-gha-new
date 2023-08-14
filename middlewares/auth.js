const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const BadRequesError = require('../error/bad_request_error_400');
const NotFoundError = require('../error/not_found_error_404');
const UnauthorizedError = require('../error/unauthorized_error_401');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res.clearCookie('jwt');
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
