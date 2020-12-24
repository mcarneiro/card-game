const {
  compose,
  noop,
  generateID,
  createRoomAt,
  checkIfUserExists,
  createUser,
  addUserToList,
  removeUserFromList,
  userActivityBy,
  joinBy
} = require('./socket-utils')
const server = require('http').createServer()
const process = require('process')
const io = require('socket.io')(server, {
  path: '/',
  serveClient: false,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

let roomList = {}

io.on('connection', socket => {
  let user = {}
  let roomID
  let userActivity = noop

  const updateUserList = userList => {
    roomList[roomID].userList = userList
    io.to(roomID).emit('user-list', userList)
  }

  const onJoin = (data) => {
    if (!data.roomID) {
      return
    }
    roomID = data.roomID
    roomList[roomID] = data.room
    user = data.user

    socket.join(roomID)
    socket.join(user.userID)

    userActivity = userActivityBy(user)
    updateUserList(addUserToList(data.room.userList, user))

    io.to(roomID).emit('user-activity', userActivity({
      type: 'user',
      message: 'connected'
    }))
    io.to(roomID).emit('ask-history', user.userID)
  }

  console.log('a user connected')

  // mandatory first step
  socket.on('join', compose(onJoin, joinBy(roomList)))

  socket.on('send-history', (newUserID, history, chunk) => {
    io.to(newUserID).emit('receive-history', history, chunk)
  })

  socket.on('chat-message', ({message}) => {
    io.to(roomID).emit('user-activity', userActivity({
      type: 'message',
      message
    }))
  })

  socket.on('ready-for-next-round', () => {
    const {readyList, userList} = roomList[roomID]
    if (readyList.indexOf(user.userID) < 0) {
      readyList.push(user.userID)
    }

    if (readyList.length === userList.length) {
      readyList = []
      // socket.emit('user-activity', {
      //   type: 'round',
      //   name: 'system',
      //   userID: 0,
      //   message: 'next round',
      //   data: {},
      //   id: (timestamp * Math.round(Math.random() * 1000)).toString(36),
      //   timestamp
      // })
    }
  })

  socket.on('disconnect', () => {
    console.log(`user "${user.userName}" disconnected from "${roomID}"`)
    if (roomID) {
      updateUserList(removeUserFromList(roomList[roomID].userList, user))
    }

    io.to(roomID).emit('user-activity', userActivity({
      type: 'user',
      message: 'disconnected'
    }))
  })
})

server.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('SIGINT', () => {
  console.info("\nInterruped...")
  process.exit(0)
})
