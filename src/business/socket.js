import io from 'socket.io/client-dist/socket.io'

export default () => {
  const socket = io('ws://localhost:3001', {
    transports: ['websocket'],
    upgrade: false
  })
  const roomID = document.location.pathname.slice(1)
  const userID = (Date.now() * Math.round(Math.random() * 1000)).toString(36)
  const noop = () => undefined
  let totalChunks = 0
  const history = (() => {
    let histData = []

    const remove = id => histData.filter(item => item.id !== id)
    const onlyNew = data => data.filter(item => histData.findIndex(val => val.id === item.id) < 0)
    const order = (data, label = 'timestamp') => data.sort((a,b) => a[label] < b[label] ? -1 : 1)

    return {
      get: () => histData.concat(),
      add: data => histData = order(histData.concat(onlyNew(data))),
      remove
    }
  })()
  let userList = []

  if (!roomID) {
    return { socket }
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

  socket.on('disconnect', () => {
    totalChunks = 0
  })

  const handleUserListUpdate = callback => {
    socket.on('user-list', callback)
    return () => socket.off('user-list', callback)
  }

  socket.on('user-list', list => {
    userList = list
  })

  const join = (userName, callback) => {
    if (socket.connected) {
      socket.emit('join', {roomID, userID, userName}, callback)
    }
    socket.on('connect', () => {
      socket.emit('join', {roomID, userID, userName}, callback)
    })
  }

  const sendMessage = message => {
    socket.emit('chat-message', {message})
  }

  const askHistory = (newUserID) => {
    let userHistoryList = userList.filter(data => data.userID !== newUserID).map(data => data.userID)
    let index = userHistoryList.indexOf(userID)
    let userLen = userHistoryList.length
    let historyLen = history.get().length

    if (index < 0) {
      return
    }

    // define how many history nodes each connected client should send, if there are more users then history, each one sends 1
    let quant = Math.floor(historyLen / Math.min(historyLen, userLen)) || 0

    if (index < userLen-1) {
      quant = quant + (historyLen % Math.min(historyLen, userLen) || 0)
    }

    let historyToSend = history.get().slice(index * quant, index * quant + quant)
    socket.emit('send-history', newUserID, historyToSend, Math.min(1/userLen, 1))
  }

  const receiveHistory = callback => (data, chunk) => {
    history.add(data)
    totalChunks += chunk

    if (totalChunks === 1) {
      callback(history.get())
    }
  }

  const handleHistory = (callback = noop) => {
    const onReceiveHistory = receiveHistory(callback)

    socket.on('ask-history', askHistory)
    socket.on('receive-history', onReceiveHistory)

    return () => {
      socket.off('receive-history', onReceiveHistory)
      socket.off('ask-history', askHistory)
    }
  }

  const handleUserActivity = (callback = noop) => {
    const evt = data => {
      history.add([data])
      callback(history.get())
    }

    socket.on('user-activity', evt)

    return () => socket.off('user-activity', evt)
  }

  return {
    join,
    handleConnection,
    handleUserListUpdate,
    handleHistory,
    handleUserActivity,
    sendMessage
  }
}
