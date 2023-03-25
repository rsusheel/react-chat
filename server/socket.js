const io = require('socket.io')(3002, {
    cors: {
        origin: ['http://localhost:3000'],
    },
})

io.on('connection', socket =>{
    connsole.log(socket.id)
})