import express from 'express'
import controller from '../controllers/UserController'
import { lovinValidate, registrationValidate } from '../libs/validation'

const router = express.Router()
const UserController = new controller()

router.get('/:id', UserController.get)
router.post('/signup', registrationValidate, UserController.create)
router.post('/signin', lovinValidate, UserController.login)
router.delete('/:id', UserController.delete)

export default router
