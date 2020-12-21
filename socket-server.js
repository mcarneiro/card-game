const express = require('express')
const app = express()
const http = require('http').createServer(app)
const process = require('process')
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

app.get('/', (req, res) => {
  res.send({success: true})
})
// app.use(express.static('build'))

let roomList = {}
io.on('connection', socket => {
  let userID
  let roomID
  console.log('a user connected')

  const updateUserList = (userList = roomList[roomID].userList) =>  {
    console.log(JSON.stringify(userList))
    roomList[roomID].userList = userList
    io.to(roomID).emit('user-list', userList)
  }

  socket.on('disconnect', () => {
    console.log('user disconnected')
    if (roomID) {
      updateUserList(roomList[roomID].userList.filter(data => data.id !== userID))
    }
  })

  socket.on('join', data => {
    ({userID, roomID} = data)
    roomList[roomID] = roomList[roomID] || {userList: []}
    socket.join(roomID)
    socket.join(userID)
    updateUserList(roomList[roomID].userList.concat({id: userID, name: '', timestamp: Date.now()}))
    io.to(roomID).emit('ask-history', userID)
  })

  socket.on('send-history', (newUserID, history, chunk) => {
    io.to(newUserID).emit('receive-history', history, chunk)
  })

  socket.on('chat-message', ({msg}) => {
    let now = Date.now()
    let id = (now * Math.round(Math.random() * 1000)).toString(36)
    io.to(roomID).emit('chat-message', {msg, id, userID, timestamp: now})
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('SIGINT', () => {
  console.info("\nInterruped...")
  process.exit(0)
})
