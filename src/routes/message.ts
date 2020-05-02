import { Router } from 'express'
import { Server } from 'socket.io'
import controller from '../controllers/MessageController'

const messageRoutes = (io: Server) => {
  const router = Router()
  const MessageController = new controller(io)

  router.post('/create', MessageController.create)
  router.get('/:dialog_id', MessageController.index)
  router.delete('/:id', MessageController.delete)

  return router
}

export default messageRoutes
