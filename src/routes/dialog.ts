import express from 'express'
import controller from '../controllers/DialogController'

const router = express.Router()
const DialogController = new controller()

router.get('/', DialogController.index)
router.post('/create', DialogController.create)
router.delete('/:id', DialogController.delete)

export default router
