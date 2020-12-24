const {compose, noop} = require('./utils')
const {createUser, addUserToList, removeUserFromList, userActivityBy, readyBy} = require('./user')
const {roomBy, joinBy} = require('./room')
const {gameSetup, newRound} = require('./game')
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

io.on('connection', socket => {
  let user = {}
  let userActivity = noop
  const systemActivity = userActivityBy(createUser('0', 'system'))
  let room = noop

  const updateUserList = userList => {
    let {roomID} = room(userList, 'userList')
    io.to(roomID).emit('user-list', userList)
  }

  const join = () => new Promise((resolve, reject) => {
    const initialize = (data) => {
      if (data.error) {
        reject(data.error)
        return
      }

      room = roomBy(data.roomID)

      if (!room()) {
        room({
          roomID: data.roomID,
          userList: [],
          readyList: [],
          cardData: {}
        })
      }

      user = data.user

      socket.join(data.roomID)
      socket.join(user.userID)

      userActivity = userActivityBy(user)
      updateUserList(addUserToList(room().userList, user))
    }

    socket.on('join', compose(resolve, initialize, joinBy))
  })

  console.log('a user connected')

  join()
  .then(() => {
    console.log(`user "${user.userName}" joined to "${room().roomID}"`)
  })
  .then(() => {
    let {roomID} = room()
    socket.on('send-history', (newUserID, history, chunk) => {
      io.to(newUserID).emit('receive-history', history, chunk)
    })

    socket.on('chat-message', ({message}) => {
      io.to(roomID).emit('user-activity', userActivity({
        type: 'message',
        message
      }))
    })

    socket.on('disconnect', () => {
      console.log(`user "${user.userName}" disconnected from "${roomID}"`)
      if (roomID) {
        updateUserList(removeUserFromList(room().userList, user))
      }

      io.to(roomID).emit('user-activity', userActivity({
        type: 'user',
        message: 'disconnected'
      }))
    })
  })
  .then(() => {
    let {roomID} = room()
    io.to(roomID).emit('user-activity', userActivity({
      type: 'user',
      message: 'connected'
    }))
    io.to(roomID).emit('ask-history', user.userID)
  })
  .then(() => {
    let {roomID} = room()
    const onReady = ({ready, readyList}) => {
      room(readyList, 'readyList')

      if (ready) {
        room([], 'readyList')

        let {userList, cardData} = room()
        if (!cardData) {
          room(gameSetup(userList), 'cardData')
        } else {
          room(newRound(userList, cardData), 'cardData')
        }

        io.to(roomID).emit('new-round', systemActivity({
          message: 'new round',
          data: room().cardData
        }))
      }
    }
    socket.on('ready-for-next-round', compose(onReady, readyBy(room, user)))
  })
  .catch(console.log)
})

server.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('SIGINT', () => {
  console.info("\nInterruped...")
  process.exit(0)
})
