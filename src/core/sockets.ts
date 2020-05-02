import http from 'http'
import socket from 'socket.io'

export default (server: http.Server) => {
  const io: socket.Server = socket.listen(server)
  io.on('connection', function (socket: socket.Socket) {
    console.log(`Client connected. Id: ${socket.id}`)

    socket.on('disconnect', () => {
      console.log('Client disconnected')
    })
  })
  return io
}
