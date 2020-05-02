import express from 'express'
import { Server } from 'socket.io'
import controller from '../controllers/UserController'
import { lovinValidate, registrationValidate } from '../libs/validation'

const userRoutes = (io: Server) => {
  const router = express.Router()
  const UserController = new controller(io)

  router.get('/me', UserController.getMe)
  router.get('/:id', UserController.get)
  router.post('/signup', registrationValidate, UserController.create)
  router.post('/signin', lovinValidate, UserController.login)
  router.delete('/:id', UserController.delete)

  return router
}

export default userRoutes
