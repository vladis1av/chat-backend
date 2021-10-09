import { body } from 'express-validator';

export const createRoomValidations = [
  body('title', 'Введите название команты')
    .isString()
    .isLength({
      min: 3,
      max: 20,
    })
    .withMessage('Допустимое кол-во символов в названии комнаты от 3 до 20'),
];
