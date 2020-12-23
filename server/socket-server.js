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

const noop = () => undefined
const generateID = (timestamp) => (timestamp * Math.round(Math.random() * 1000)).toString(36)
const createRoomAt = (roomID, destination = {}) => {
  if (!destination[roomID]) {
    console.log(`room "${roomID}" created`)
    return {userList: [], readyList: []}
  }
  return {...destination[roomID]}
}
const checkUserExists = (userList, userName) => userList.findIndex(data => data.userName === userName) >= 0
const createUser = (userID, userName) => ({
  userID,
  userName
})
const addUserToList = (userList, user) => {
  if (!checkUserExists(userList, user.userName)) {
    return userList.concat(user)
  }
  return userList
}
const removeUserFromList = (userList, user) => userList.filter(data => data.userID !== user.userID)
const userActivityBy = user => (data) => {
  let timestamp = Date.now()
  return {
    ...user,
    ...data,
    id: generateID(timestamp),
    timestamp
  }
}

io.on('connection', socket => {
  let user = {}
  let roomID
  let userActivity = noop
  let updateUserList = userList => {
    roomList[roomID].userList = userList
    io.to(roomID).emit('user-list', userList)
  }
  console.log('a user connected')

  // mandatory first step
  socket.on('join', (data, callback) => {
    let {userID, userName} = data
    roomID = data.roomID

    roomList[roomID] = createRoomAt(roomID, roomList)

    const {[roomID]: room} = roomList

    if (checkUserExists(room.userList, userName)) {
      console.log(`user "${userName}" already exists, sending error signal`)
      callback({'type': 'error', 'msg': 'user-exists'})
      return
    }

    user = createUser(userID, userName)
    socket.join(roomID)
    socket.join(user.userID)

    userActivity = userActivityBy(user)

    updateUserList(addUserToList(room.userList, user))

    callback({'type': 'success'})
    console.log(`user "${user.userName}" joined to "${roomID}"`)

    io.to(roomID).emit('user-activity', userActivity({
      type: 'user',
      message: 'connected'
    }))
    io.to(roomID).emit('ask-history', user.userID)
  })

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
