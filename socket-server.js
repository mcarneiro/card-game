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
  let userName
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
      updateUserList(roomList[roomID].userList.filter(data => data.userID !== userID))
    }

    let timestamp = Date.now()
    io.to(roomID).emit('activity', {
      type: 'user',
      userName,
      userID,
      message: 'disconnected',
      id: (timestamp * Math.round(Math.random() * 1000)).toString(36),
      timestamp
    })
  })

  socket.on('join', (data, callback) => {
    ({userID, userName, roomID} = data)
    roomList[roomID] = roomList[roomID] || {userList: []}

    if (roomList[roomID].userList.findIndex(data => data.name === userName) >= 0) {
      callback({'type': 'error', 'msg': 'user-exists'})
      return
    }
    callback({'type': 'success'})

    let timestamp = Date.now()
    socket.join(roomID)
    socket.join(userID)

    updateUserList(roomList[roomID].userList.concat({
      userID,
      userName,
      timestamp
    }))

    io.to(roomID).emit('ask-history', userID)
    io.to(roomID).emit('activity', {
      type: 'user',
      userName,
      userID,
      message: 'connected',
      id: (timestamp * Math.round(Math.random() * 1000)).toString(36),
      timestamp
    })
  })

  socket.on('send-history', (newUserID, history, chunk) => {
    io.to(newUserID).emit('receive-history', history, chunk)
  })

  socket.on('chat-message', ({message}) => {
    let timestamp = Date.now()

    io.to(roomID).emit('activity', {
      type: 'message',
      userName,
      userID,
      id: (timestamp * Math.round(Math.random() * 1000)).toString(36),
      message,
      timestamp
    })
  })
})

http.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('SIGINT', () => {
  console.info("\nInterruped...")
  process.exit(0)
})
