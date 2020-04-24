import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import { UserCtr, DialogCtr, MessageCtr } from './controllers'

const UserController = new UserCtr()
const DialogController = new DialogCtr()
const MessageController = new MessageCtr()

const app: express.Application = express()
app.use(cors())
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

app.get('/user/:id', UserController.get)
app.post('/user/registration', UserController.create)
app.delete('/user/:id', UserController.delete)

app.get('/dialog', DialogController.index)
app.post('/dialog/create', DialogController.create)
app.delete('/dialog/:id', DialogController.delete)

app.post('/message/create', MessageController.create)
app.get('/message/:dialog_id', MessageController.index)
app.delete('/message/:id', MessageController.delete)

app.listen(4000, function () {
  console.log('4000 port started')
})
