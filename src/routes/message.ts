import { Router } from 'express'
import controller from '../controllers/MessageController'

const router = Router()
const MessageController = new controller()

router.post('/create', MessageController.create)
router.get('/:dialog_id', MessageController.index)
router.delete('/:id', MessageController.delete)

export default router
