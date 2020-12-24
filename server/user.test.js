const {
  addUserToList,
  removeUserFromList,
  userActivityBy,
  readyBy
} = require('./user')

const {roomBy} = require('./room')

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

test('user is ready for next round', () => {
  const room = roomBy('r')
  room({
    userList: [
      {userID: '1', userName: 'test'},
      {userID: '2', userName: 'test2'}
    ],
    readyList: ['test']
  })
  let userData1 = {userID: '1', userName: 'test'}
  let userData2 = {userID: '2', userName: 'test2'}
  let ret = readyBy(room, userData1)()

  expect(ret.ready).toBe(false)
  expect(ret.readyList).toStrictEqual(['test'])

  ret = readyBy(room, userData2)()
  expect(ret.ready).toBe(true)
  expect(ret.readyList).toStrictEqual(['test', 'test2'])
})
