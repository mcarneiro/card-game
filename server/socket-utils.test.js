const {
  generateID,
  addUserToList,
  removeUserFromList,
  userActivityBy,
  joinBy,
  createRoomAt
} = require('./socket-utils')

test('generate IDs that are not equal', () => {
  let arr = []
  for(let i = 0; i < 1000; i++) {
    arr[i] = generateID(Date.now())
  }
  let arr2 = arr.filter((val, i, arr) => arr.indexOf(val) === i)

  expect(arr2.length).toBe(arr.length)
  expect(generateID(1)).not.toBe(generateID(1))
  expect(generateID()).not.toBe(generateID())
})

test('join to a room', () => {
  let roomList = {
    'r': {
      userList: [
        {userID: '1', userName: 'test'}
      ],
      readyList: []
    }
  }

  let joinData = joinBy(roomList)({
    userID: '1',
    userName: 'test',
    roomID: 'r'
  }, (val) => expect(val.type).toBe('error'))

  expect(joinData).toStrictEqual({})

  joinData = joinBy(roomList)({
    userID: '2',
    userName: 'test2',
    roomID: 'r'
  }, (val) => expect(val.type).toBe('success'))

  expect(joinData.user.userID).toBe('2')
  expect(joinData.user.userName).toBe('test2')
  expect(joinData.roomID).toBe('r')

  joinData = joinBy(roomList)({
    userID: '1',
    userName: 'test',
    roomID: 'r2'
  }, (val) => expect(val.type).toBe('success'))

  expect(joinData.user.userID).toBe('1')
  expect(joinData.user.userName).toBe('test')
  expect(joinData.roomID).toBe('r2')

})

test('add user to list', () => {
  let userList = [
    {userID: '1', userName: 'test'}
  ]

  expect(addUserToList(userList, {userID: '2', userName: 'test'}).length).toBe(1)
  expect(addUserToList(userList, {userID: '2', userName: 'test2'}).length).toBe(2)
})

test('remove user from list', () => {
  let userList = [
    {userID: '1', userName: 'test'},
    {userID: '2', userName: 'test2'}
  ]

  let newUserList = removeUserFromList(userList, {userID: '1', userName: 'test'})
  expect(newUserList.length).toBe(1)

  newUserList = removeUserFromList(userList, {userID: '3', userName: 'carneiro'})
  expect(newUserList.length).toBe(2)
})

test('create userActivity object', () => {
  let activity = userActivityBy({userID: '1', userName: 'test'})({type: 'a', message: 'b'})

  expect(activity.timestamp).not.toBeFalsy()
  expect(activity.userName).toBe('test')
  expect(activity.userID).toBe('1')
  expect(activity.type).toBe('a')
  expect(activity.message).toBe('b')
})
