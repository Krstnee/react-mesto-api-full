require('dotenv').config();
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/401-UnauthorizedError');

const { NODE_ENV, JWT_SECRET } = process.env;
const JWT_SECRET_DEV = 'a56e4e2f235ea7966935a4c53ae8b99b';
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Нужно авторизоваться');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
  } catch (err) {
    return next(new UnauthorizedError('Ошибка верификации токена'));
  }

  req.user = payload;
  return next();
};
