import io from 'socket.io/client-dist/socket.io'

const chunksBy = (userID) => {
  let totalChunks = 0

  const generate = (userList, activityList) => {
    // define how many activity nodes each connected client should send,
    // if there are more users then history, each one sends 1
    let index = userList.indexOf(userID)
    let userLen = userList.length
    let activityLen = activityList.length
    let start = Math.floor(activityLen / Math.min(activityLen, userLen))
    let quant = start

    // last one will get the remainders
    if (index === userLen-1) {
      quant = start + (activityLen % Math.min(activityLen, userLen))
    }

    return {
      chunk: activityList.slice(index * start, index * start + quant),
      chunkSize: Math.min(1/userLen, 1)
    }
  }

  const increment = val => totalChunks += val
  const whenReady = callback => totalChunks === 1 ? callback() : undefined
  const reset = () => totalChunks = 0

  return {
    generate,
    increment,
    whenReady,
    reset
  }
}

const activityList = (() => {
  let activityData = []

  const remove = id => activityData.filter(item => item.id !== id)
  const unique = data => data.filter((item, i, arr) => arr.findIndex(({id}) => id === item.id) === i)
  const order = (data) => data.sort((a,b) => a.timestamp < b.timestamp ? -1 : 1)

  return {
    get: () => activityData.concat(),
    add: data => activityData = order(unique(activityData.concat(data))),
    remove: id => activityData = remove(id)
  }
})()

const userListWithout = (userList, userID) => userList.filter(data => data.userID !== userID)
const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000) + i++).toString(36)
})()
const noop = () => undefined

/* istanbul ignore next */
const socket = (url) => {
  const socket = io(url, {
    transports: ['websocket'],
    upgrade: false
  })
  const roomID = document.location.pathname.slice(1)
  const userID = generateID()
  let userList = []
  const chunkControl = chunksBy(userID)

  if (!roomID) {
    return { socket }
  }

  socket.on('disconnect', () => {
    chunkControl.reset()
  })

  socket.on('user-list', list => {
    userList = list
  })

  socket.on('ask-history', (newUserID) => {
    let userListWithoutAsker = userListWithout(userList, newUserID).map(({userID}) => userID)

    if (userID === newUserID) {
      return
    }

    let {chunk, chunkSize} = chunkControl.generate(userListWithoutAsker, activityList.get())
    socket.emit('send-history', newUserID, chunk, chunkSize)
  })

  socket.on('receive-history', (data, chunkSize) => {
    activityList.add(data)
    chunkControl.increment(chunkSize)
  })

  socket.on('user-activity', data => {
    activityList.add([data])
  })

  const sendMessage = message => {
    socket.emit('chat-message', {message})
  }

  const join = (userName, callback) => {
    if (socket.connected) {
      socket.emit('join', {roomID, userID, userName}, callback)
    }
    socket.on('connect', () => {
      socket.emit('join', {roomID, userID, userName}, callback)
    })
  }

  const handleUserListUpdate = callback => {
    socket.on('user-list', callback)
    return () => socket.off('user-list', callback)
  }

  const handleConnection = (callback) => {
    let onConnect = () => callback('connected')
    let onDisconnect = () => callback('disconnected')

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
    }
  }

  const askCurrentState = () => {
    socket.emit('get-current-state')
  }

  const handleCurrentState = (callback) => {
    socket.on('current-state', callback)

    return () => socket.off('current-state', callback)
  }

  const handleHistory = (callback = noop) => {
    const evt = () => {
      chunkControl.whenReady(() => callback(activityList.get()))
    }

    evt()
    socket.on('receive-history', evt)

    return () => {
      socket.off('receive-history', evt)
    }
  }

  const handleUserActivity = (callback = noop) => {
    const evt = () => callback(activityList.get())

    evt()
    socket.on('user-activity', evt)

    return () => socket.off('user-activity', evt)
  }

  const sendReadyForNextRound = () => {
    socket.emit('ready-for-next-round')
  }

  const handleNewRound = (callback) => {
    socket.on('new-round', callback)

    return () => socket.off('new-round', callback)
  }

  return {
    join,
    handleConnection,
    handleUserListUpdate,
    handleHistory,
    handleUserActivity,
    sendMessage,
    sendReadyForNextRound,
    handleNewRound,
    askCurrentState,
    handleCurrentState
  }
}

export {chunksBy, activityList, generateID, userListWithout}
export default socket
