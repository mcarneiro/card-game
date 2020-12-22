import io from 'socket.io/client-dist/socket.io'

export default () => {
  const socket = io('ws://localhost:3001', {
    transports: ['websocket'],
    upgrade: false
  })
  const roomID = document.location.pathname.slice(1)
  const userID = (Date.now() * Math.round(Math.random() * 1000)).toString(36)
  const noop = () => null
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

  socket.on('disconnect', () => {
    totalChunks = 0
  })

  socket.on('user-list', list => {
    userList = list
  })

  const connect = (userName, callback) => {
    if (socket.connected) {
      socket.emit('join', {roomID, userID, userName}, callback)
    } else {
      socket.on('connect', () => {
        socket.emit('join', {roomID, userID, userName}, callback)
      })
    }
  }

  const sendMessage = msg => {
    socket.emit('chat-message', {msg, userID})
  }

  const askHistory = (newUserID) => {
    let userHistoryList = userList.filter(data => data.id !== newUserID).map(data => data.id)
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

  const handleMessage = (callback = noop) => {
    const evt = data => {
      history.add([data])
      callback(data)
    }

    socket.on('chat-message', evt)

    return () => socket.off('chat-message', evt)
  }

  return {
    connect,
    handleHistory,
    handleMessage,
    sendMessage
  }
}
