const compose = (...fns) => fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)));
const noop = () => undefined
const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000) + (i++ + '')).toString(36)
})()
const createRoomAt = (roomID, destination = {}) => {
  if (!destination[roomID]) {
    // console.log(`room "${roomID}" created`)
    return {userList: [], readyList: []}
  }
  return {...destination[roomID]}
}
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
const joinBy = (roomList) => (data, callback) => {
  let {userID, userName} = data
  let roomID = data.roomID
  let user = createUser(userID, userName)

  const room = createRoomAt(roomID, roomList)

  if (checkIfUserExists(room.userList, userName)) {
    // console.log(`user "${userName}" already exists, sending error signal`)
    callback({'type': 'error', 'msg': 'user-exists'})
    return {}
  }

  callback({'type': 'success'})
  // console.log(`user "${user.userName}" joined to "${roomID}"`)

  return {
    user,
    roomID,
    room
  }
}

module.exports = {
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
}
