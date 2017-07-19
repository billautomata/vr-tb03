var express = require('express')
var app = require('express')()
var server = require('http').Server(app)
var io = require('socket.io')(server)

server.listen(8080)

app.use(express.static('./'))

io.on('connection', function (socket) {
  console.log('new connection', socket.id)
  socket.emit('echo', { v: Date.now() })
  socket.on('echo', function (data) {
    socket.emit('echo', { v: Date.now() })
    console.log(data)
  })
  socket.on('update', function (data) {
    data.from = socket.id
    console.log(socket.id, 'update data', data)
    io.emit('update-element', data)
  })
})
