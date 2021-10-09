import { body } from 'express-validator';

export const registerValidations = [
  body('username', 'Введите Имя Пользователя')
    .isString()
    .isLength({
      min: 2,
      max: 12,
    })
    .withMessage('Допустимое кол-во символов в Имени пользователя от 2 до 40'),
  body('fullName', 'Укажите Имя и Фамилию')
    .isString()
    .isLength({
      min: 2,
      max: 40,
    })
    .withMessage('Допустимое кол-во символов в полном имени от 2 до 40'),
  body('password', 'Укажите пароль')
    .isString()
    .isLength({
      min: 6,
    })
    .withMessage('Минимальная длина пароля 6 символов')
    .custom((value, { req }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error('Пароли не совпадают');
      } else {
        return value;
      }
    }),
];
