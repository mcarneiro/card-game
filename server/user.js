const {generateID} = require('./utils')
const {gameSetup, newRound} = require('./game')

const checkIfUserExists = (userList, userName) => userList.findIndex(data => data.userName === userName) >= 0
const createUser = (userID, userName) => ({
  userID,
  userName
})
const addUserToList = (userList, user) => {
  if (!checkIfUserExists(userList, user.userName)) {
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

const readyBy = (room, user) => (roundData) => {
  let ready = false
  const {readyList, userList} = room()
  let newReadyList = readyList.concat()

  if (readyList.indexOf(user.userName) < 0) {
    newReadyList = readyList.concat(user.userName)
  }

  if (newReadyList.length === userList.length) {
    ready = true
  }

  if (roundData && Object.keys(roundData).length > 0) {
    let {gameData} = room()
    gameData.roundData = {...gameData.roundData, ...roundData}
    room(gameData, 'gameData')
  }

  room(newReadyList, 'readyList')

  if (ready) {
    room([], 'readyList')

    let {userList, gameData} = room()
    if (Object.keys(gameData).length === 0) {
      room(gameSetup(userList), 'gameData')
    } else {
      room(newRound(gameData), 'gameData')
    }
  }

  return {
    roundData,
    ready,
    readyList: newReadyList
  }
}

module.exports = {
  checkIfUserExists,
  createUser,
  addUserToList,
  removeUserFromList,
  userActivityBy,
  readyBy
}
