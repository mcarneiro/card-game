const {
  checkIfUserExists,
  createUser,
  userActivityBy
} = require('./user')

let roomList = {}

const roomBy = roomID => {
  if (!roomID) {
    throw new Error(`roomID needs to be a truthy value, current: ${roomID}`)
  }

  return (...args) => {
    if (args.length === 1) {
      roomList[roomID] = args[0]
    }
    if (args.length === 2) {
      roomList[roomID][args[1]] = args[0]
    }
    return roomList[roomID] && JSON.parse(JSON.stringify(roomList[roomID]))
  }
}

const joinBy = (data, callback) => {
  let {userID, userName, roomID} = data
  let user = createUser(userID, userName)

  const room = roomBy(roomID)
  if (room() && checkIfUserExists(room().userList, userName)) {
    callback({'type': 'error', 'msg': 'user-exists'})
    return {error: `user "${userName}" already exists, sending error signal`}
  }

  callback({'type': 'success'})

  if (!room()) {
    room({
      roomID,
      userList: [],
      readyList: [],
      gameData: {
        round: 0
      }
    })
  }

  return {
    user,
    room,
    userActivity: userActivityBy(user)
  }
}

module.exports = {
  roomBy,
  joinBy
}
