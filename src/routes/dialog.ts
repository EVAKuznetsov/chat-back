import express from 'express'
import { Server } from 'socket.io'
import controller from '../controllers/DialogController'

const dialogRoutes = (io: Server) => {
  const router = express.Router()
  const DialogController = new controller(io)

  router.get('/', DialogController.index)
  router.post('/create', DialogController.create)
  router.delete('/:id', DialogController.delete)

  return router
}

export default dialogRoutes
