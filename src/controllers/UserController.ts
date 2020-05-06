import { Request, Response } from 'express'
import { validationResult, Result } from 'express-validator'
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
    const { email, fullName, password } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array() })
    } else {
      // валидация прошла
      try {
        const candidate = await UserModel.findOne({ email })
        if (candidate) {
          res
            // .status(409)
            .json({ status: 'error', message: 'Такой адрес уже существует' })
        } else {
          const user = new UserModel({
            email,
            fullName,
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
    console.log(req.body)
    if (!errors.isEmpty()) {
      return res.status(422).json({ status: 'error', errors: errors.array() })
    }
    // валидация прошла
    try {
      const candidat = await UserModel.findOne({ email })
      if (candidat) {
        if(candidat.confirmed.toString()==='false'){
          return res.json({
          status: 'error',
          message: 'Пользователь не подтверждён',
        })}
        const passwordResult = HashPassword.compare(password, candidat.password)
        if (passwordResult) {
          // пароли совпали
          const token = JWT.create({ email: candidat.email, id: candidat._id })
          res.status(200).json({ status: 'success', token })
        } else {
          // пароли не совпали
          res
            .json({
              status: 'error',
              message: 'Неверный пароль',
            })
            .status(401)
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
  async verify(req: Request, res: Response) {
    const hash:string = <string>req.query.hash
    if (!hash) {
      return res.status(404).json()
    }
    UserModel.findOneAndUpdate({confirm_hash:hash},{confirmed:true}).exec()
    .then((result)=>{
      if(result){
        res.json({status:'success',message:'пользователь подтверждён'})
      }else{
        res.json({status:'error',message:'пользователь не подтверждён'})
      }
    })
    .catch(error=>{
      errorHandler(res, error)
    })
    
  }
}

export default UserController
