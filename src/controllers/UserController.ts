import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import { Server } from 'socket.io'

import { UserModel } from '../models'
import JWT from '../libs/jsonWebToken'
import errorHandler from '../libs/errorHandler'
import HashPassword from '../libs/hashPassword'

class UserController {
  io: Server
  constructor(io: Server) {
    this.io = io
  }
  get(req: Request, res: Response) {
    const id: string = req.params.id
    UserModel.findById(id)
      .exec()
      .then((user) => res.json({ status: 'success', user }))
      .catch((err) =>
        res
          .status(404)
          .json({ status: 'error', message: 'Пользователь не найден' })
      )
  }
  getMe(req: any, res: Response) {
    const id: string = req.user.id
    console.info(id)
    UserModel.findById(id)
      .exec()
      .then((user) => res.json({ status: 'success', user }))
      .catch((err) =>
        res
          .status(404)
          .json({ status: 'error', message: 'Пользователь не найден' })
      )
  }
  async create(req: Request, res: Response) {
    const { email, fullname, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array() })
    } else {
      // валидация прошла
      try {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
          res
            .status(409)
            .json({ status: 'error', message: 'Такой адрес уже существует' })
        } else {
          const user = new UserModel({
            email,
            fullname,
            password,
          })
          try {
            await user.save()
            res.status(201).json({
              status: 'success',
              message: 'новый пользователь создан',
              user,
            })
          } catch (error) {
            errorHandler(res, error)
          }
        }
      } catch (error) {
        errorHandler(res, error)
      }
    }
  }
  delete(req: Request, res: Response) {
    const id: string = req.params.id
    UserModel.findByIdAndRemove(id)
      .exec()
      .then((user) => res.json({ status: 'success' }))
      .catch((err) => res.json({ status: 'error', message: err.message }))
  }
  async login(req: Request, res: Response) {
    const { password, email } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array() })
    }
    // валидация прошла
    try {
      const candidat = await UserModel.findOne({ email })
      if (candidat) {
        const passwordResult = HashPassword.compare(password, candidat.password)
        if (passwordResult) {
          // пароли совпали
          const token = JWT.create({ email: candidat.email, id: candidat._id })
          res.status(200).json({ status: 'success', token })
        } else {
          // пароли не совпали
          res
            // .status(401)
            .json({
              status: 'error',
              message: 'Пароли не совпадают, попробуйте снова',
            })
        }
      } else {
        // пользователь не найден
        res
          // .status(404)
          .json({
            status: 'error',
            message: 'Пользователь с таким email не найден',
          })
      }
    } catch (error) {
      errorHandler(res, error)
    }
  }
}

export default UserController
