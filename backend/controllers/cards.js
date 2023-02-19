const mongoose = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/404-NotFoundError');
const BadRequest = require('../errors/400-BadRequestError');
const ServerError = require('../errors/500-ServerError');
const ForbiddenError = require('../errors/403-ForbiddenError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const currentUser = req.user._id;
  Card.findById(
    { _id: cardId },
  ).orFail(new Error('Not Found'))
    .then((card) => {
      if (currentUser === card.owner.toString()) {
        Card.deleteOne({ _id: cardId })
          .then(() => {
            res.send(card);
          });
      } else {
        next(new ForbiddenError('В доступе отказано'));
      }
    })
    .catch((err) => {
      if (err.message === 'Not Found') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).orFail(new Error('Not Found'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные'));
      } else if (err.message === 'Not Found') {
        next(new NotFoundError('Карточка с указанным _id не найдена'));
      } else {
        next(new ServerError('На сервере произошла ошибка'));
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).orFail(() => {
    throw new NotFoundError('Карточка с указанным _id не найдена');
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequest('Не корректный _id'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
