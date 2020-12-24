const {roomBy, joinBy} = require('./room')

test('join to a room', () => {
  const room = roomBy('r')
  room({
    userList: [
      {userID: '1', userName: 'test'}
    ],
    readyList: []
  })

  let joinData = joinBy({
    userID: '1',
    userName: 'test',
    roomID: 'r'
  }, (val) => expect(val.type).toBe('error'))

  expect(joinData.error).not.toBeFalsy()

  joinData = joinBy({
    userID: '2',
    userName: 'test2',
    roomID: 'r'
  }, (val) => expect(val.type).toBe('success'))

  expect(joinData.user.userID).toBe('2')
  expect(joinData.user.userName).toBe('test2')
  expect(joinData.roomID).toBe('r')

  joinData = joinBy({
    userID: '1',
    userName: 'test',
    roomID: 'r2'
  }, (val) => expect(val.type).toBe('success'))

  expect(joinData.user.userID).toBe('1')
  expect(joinData.user.userName).toBe('test')
  expect(joinData.roomID).toBe('r2')

})
