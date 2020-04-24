import express from 'express'
import { UserModel } from '../models'

class UserController {
  get(req: express.Request, res: express.Response) {
    const id: string = req.params.id
    UserModel.findById(id)
      .exec()
      .then((user) => res.json(user))
      .catch((err) => res.sendStatus(404).end())
  }
  create(req: express.Request, res: express.Response) {
    const { email, fullname, password } = req.body
    const user = new UserModel({
      email,
      fullname,
      password,
    })
    user
      .save()
      .then((obj) => {
        res.send(`User created at ${obj.createdAt}`)
      })
      .catch((error) => {
        res.send(error)
      })
  }
  delete(req: express.Request, res: express.Response) {
    const id: string = req.params.id
    UserModel.findByIdAndRemove(id)
      .exec()
      .then((user) => res.send(`${user?.fullname} deleted`))
      .catch((err) => res.send(err.message))
  }
}

export default UserController
