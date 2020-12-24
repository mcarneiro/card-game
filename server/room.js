const {
  checkIfUserExists,
  createUser
} = require('./user')

let roomList = {}

const roomBy = roomID => (...args) => {
  if (!roomID) {
    return null
  }
  if (args.length === 1) {
    roomList[roomID] = args[0]
  }
  if (args.length === 2) {
    roomList[roomID][args[1]] = args[0]
  }
  return roomList[roomID] && JSON.parse(JSON.stringify(roomList[roomID]))
}

const joinBy = (data, callback) => {
  let {userID, userName, roomID} = data
  let user = createUser(userID, userName)

  const room = roomBy(roomID)()
  if (room && checkIfUserExists(room.userList, userName)) {
    callback({'type': 'error', 'msg': 'user-exists'})
    return {error: `user "${userName}" already exists, sending error signal`}
  }

  callback({'type': 'success'})

  return {
    user,
    roomID
  }
}

module.exports = {
  roomBy,
  joinBy
}
