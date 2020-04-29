import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { updateLastSeen, checkAuth } from './middlewares'
import { messageRoures, dialogRoutes, userRoutes } from './routes'

dotenv.config()

const app: express.Application = express()
app.use(bodyParser.json())
app.use(checkAuth)
app.use(updateLastSeen)

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
})

app.use('/user', userRoutes)
app.use('/dialog', dialogRoutes)
app.use('/message', messageRoures)

const PORT = process.env.PORT || 4000
app.listen(PORT, function () {
  console.log(`${PORT} port started`)
})
