const {generateID} = require('./utils')
let userList = {}

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

const getUserBy = userID => (...args) => {
  if (!userID) {
    return null
  }
  if (args.length === 1) {
    userList[userID] = args[0]
  }
  if (args.length === 2) {
    userList[userID][args[1]] = args[0]
  }
  return userList[userID] && JSON.parse(JSON.stringify(userList[userID]))
}

const readyBy = (getRoom, user) => () => {
  let ready = false
  const {readyList, userList} = getRoom()
  let newReadyList = readyList.concat()

  if (readyList.indexOf(user.userName) < 0) {
    newReadyList = readyList.concat(user.userName)
  }

  if (newReadyList.length === userList.length) {
    ready = true
  }

  return {
    ready,
    readyList: newReadyList
  }
}

const getUserList = () => JSON.parse(JSON.stringify(userList))

module.exports = {
  getUserBy,
  checkIfUserExists,
  createUser,
  addUserToList,
  removeUserFromList,
  userActivityBy,
  readyBy
}
