import { Response } from 'express'
import { validationResult } from 'express-validator'
import { UserModel } from '../models'
import JWT from '../libs/jsonWebToken'
import errorHandler from '../libs/errorHandler'
import HashPassword from '../libs/hashPassword'

class UserController {
  get(req: any, res: Response) {
    const id: string = req.params.id
    UserModel.findById(id)
      .exec()
      .then((user) => res.json(user))
      .catch((err) => res.sendStatus(404).end())
  }
  async create(req: any, res: Response) {
    const { email, fullname, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    // валидация прошла
    try {
      const candidate = await UserModel.findOne({ email })
      if (candidate) {
        res.status(409).json({ message: 'Такой адрес уже существует' })
      } else {
        const user = new UserModel({
          email,
          fullname,
          password,
        })
        try {
          await user.save()
          res.status(201).json({ message: 'новый пользователь создан', user })
        } catch (error) {
          errorHandler(res, error)
        }
      }
    } catch (error) {
      errorHandler(res, error)
    }
  }
  delete(req: any, res: Response) {
    const id: string = req.params.id
    UserModel.findByIdAndRemove(id)
      .exec()
      .then((user) => res.send(`${user?.fullname} deleted`))
      .catch((err) => res.send(err.message))
  }
  async login(req: any, res: Response) {
    const { password, email } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    // валидация прошла
    try {
      const candidat = await UserModel.findOne({ email })
      if (candidat) {
        const passwordResult = HashPassword.compare(password, candidat.password)
        if (passwordResult) {
          // пароли совпали
          const token = JWT.create({ email: candidat.email, id: candidat._id })
          res.status(200).json({ success: true, token })
        } else {
          // пароли не совпали
          res
            .status(401)
            .json({ message: 'Пароли не совпадают, попробуйте снова' })
        }
      } else {
        // пользователь не найден
        res
          .status(404)
          .json({ message: 'Пользователь с таким email не найден' })
      }
    } catch (error) {
      errorHandler(res, error)
    }
  }
}

export default UserController
