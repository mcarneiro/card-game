const {roomBy, joinBy} = require('./room')

test('room needs an id', () => {
  const fn = id => () => roomBy(id)
  expect(fn()).toThrow()
  expect(fn(0)).toThrow()
  expect(fn("")).toThrow()
})

test('join to a room', () => {
  const room = roomBy('r')
  room({
    roomID: 'r',
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
  expect(joinData.room().roomID).toBe('r')

  joinData = joinBy({
    userID: '1',
    userName: 'test',
    roomID: 'r2'
  }, (val) => expect(val.type).toBe('success'))

  expect(joinData.user.userID).toBe('1')
  expect(joinData.user.userName).toBe('test')
  expect(joinData.room().roomID).toBe('r2')

})

test('reset room', () => {
  const room = roomBy('r')
  room({
    roomID: 'r',
    userList: [
      {userID: '1', userName: 'test'}
    ],
    readyList: []
  })

  expect(room('reset').userList.length).toBe(0)
  expect(room('reset').roomID).toBe('r')
})
