import express from 'express'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import http from 'http'
import './core/db'
import createSocket from './core/sockets'
import { updateLastSeen, checkAuth } from './middlewares'
import { messageRoures, dialogRoutes, userRoutes } from './routes'

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = createSocket(server)

app.use(bodyParser.json())
app.use(cors())
app.use(morgan('dev'))
app.use(checkAuth)
app.use(updateLastSeen)
app.use('/user', userRoutes(io))
app.use('/dialog', dialogRoutes(io))
app.use('/message', messageRoures(io))

const PORT = process.env.PORT || 4000
server.listen(PORT, function () {
  console.log(`${PORT} port started`)
})
