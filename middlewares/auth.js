const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(200)
      .send({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    res.clearCookie('jwt');
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }

  req.user = payload;
  next();
};
