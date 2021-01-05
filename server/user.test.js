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

const room = roomBy('r')
const userData1 = {userID: '1', userName: 'test'}
const userData2 = {userID: '2', userName: 'test2'}
const userData3 = {userID: '3', userName: 'test3'}

room({
  userList: [
    {userID: '1', userName: 'test'},
    {userID: '2', userName: 'test2'},
    {userID: '3', userName: 'test3'}
  ],
  readyList: ['test'],
  gameData: {roundData:{}}
})

test('user is ready to start the game / for next round', () => {
  let ret = readyBy(room, userData1)()
  expect(ret.ready).toBe(false)
  expect(ret.readyList).toStrictEqual(['test'])

  ret = readyBy(room, userData2)()
  expect(ret.readyList).toStrictEqual(['test', 'test2'])

  ret = readyBy(room, userData3)()
  expect(ret.readyList).toStrictEqual(['test', 'test2', 'test3'])
  expect(ret.ready).toBe(true)
})


test('round data gets merged and cleaned after ready', () => {
  readyBy(room, userData1)({'test': {resistanceID: ['1']}})
  ret = readyBy(room, userData2)({'test2': {resistanceID: ['2']}})
  expect(room().gameData.roundData.test.resistanceID).toStrictEqual(['1'])
  expect(room().gameData.roundData.test2.resistanceID).toStrictEqual(['2'])

  ret = readyBy(room, userData3)({'test3': {resistanceID: ['3']}})
  expect(ret.roundData.test3.resistanceID).toStrictEqual(['3'])
  expect(Object.keys(room().gameData.roundData).length).toBe(0)
  expect(ret.ready).toBe(true)
})
