import { check } from 'express-validator'
export default [
  check('email').isEmail().withMessage('не корректный email'),
  check('password')
    .isLength({ min: 3 })
    .withMessage('пароль должен содержать не меньше 3 символов'),
]
