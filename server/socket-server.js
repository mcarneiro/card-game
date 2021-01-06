const {compose, noop, idx} = require('./utils')
const {createUser, addUserToList, removeUserFromList, userActivityBy, readyBy} = require('./user')
const {joinBy} = require('./room')
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
    if (userList.length === 0) {
      console.log(`no more users connected, reseting game data for "${roomID}"`)
      room('reset')
      return;
    }
    io.to(roomID).emit('user-list', userList)
  }

  const join = () => new Promise((resolve, reject) => {
    const initialize = (data) => {
      if (data.error) {
        reject(data.error)
        return
      }

      user = data.user
      userActivity = data.userActivity
      room = data.room

      socket.join(room().roomID)
      socket.join(data.user.userID)

      updateUserList(addUserToList(room().userList, user))
    }

    socket.on('join', compose(resolve, initialize, joinBy))
  })

  console.log('a user connected')

  join()
  .then(() => {
    let {roomID} = room()

    console.log(`user "${user.userName}" joined "${roomID}"`)

    io.to(roomID).emit('user-activity', userActivity({
      type: 'user',
      message: 'connected'
    }))
    io.to(roomID).emit('ask-history', user.userID)
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

    socket.on('sync-game-data', gameData => {
      console.log(`received game data from client at "${roomID}"`)
      room(gameData, 'gameData')
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
    socket.on('update-round-data', (roundData) => {

      // TODO: REFACTORY
      let isEqual = Object.keys(roundData).reduce((acc, val) => {
        let resistanceList = idx(['roundData', val, 'resistanceID'], room().gameData, [])
        let newResistanceList = idx([val, 'resistanceID'], roundData, [])
        let enemyList = idx(['roundData', val, 'enemyID'], room().gameData, [])
        let newEnemyList = idx([val, 'enemyID'], roundData, [])

        if (resistanceList.length !== newResistanceList.length) {
          return 1
        }

        if (enemyList.length !== newEnemyList.length) {
          return 1
        }

        let resistanceHasChanged = newResistanceList.filter((v, i) => resistanceList[i] !== v).length === 0
        let enemyHasChanged = newEnemyList.filter((v, i) => enemyList[i] !== v).length === 0

        return acc + (resistanceHasChanged ? 0 : 1) + (enemyHasChanged ? 0 : 1)
      }, 0) === 0

      if (isEqual) {
        return
      }

      let {gameData} = room()
      room({...gameData, roundData: {...gameData.roundData, ...roundData}}, 'gameData')

      io.to(roomID).emit('user-activity', userActivity({
        type: 'game',
        message: 'round data',
        data: roundData
      }))
    })
  })

  .then(() => {
    let {roomID} = room()
    const onReady = ({ready, roundData}) => {
      io.to(roomID).emit('user-activity', userActivity({
        type: 'user',
        message: 'ready for next round',
        data: roundData
      }))

      if (ready) {
        io.to(roomID).emit('user-activity', systemActivity({
          type: 'game',
          message: 'new round',
          data: room().gameData
        }))
      }
    }
    socket.on('ready-for-next-round', compose(onReady, readyBy(room, user)))
  })

  .catch(console.error)
})

server.listen(3001, () => {
  console.log('listening on *:3001')
})

process.on('SIGINT', () => {
  console.info("\nInterruped...")
  process.exit(0)
})
