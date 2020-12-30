import {
  activityList,
  chunksBy,
  userListWithout,
  syncGameData
} from './socket'

test('add new activity to activityList', () => {
  activityList.add([
    {id: '1', type: 'user', timestamp: 100}
  ])
  activityList.add([
    {id: '3', type: 'game', data: {}, timestamp: 500},
    {id: '2', type: 'user', timestamp: 50},
    {id: '2', type: 'user', timestamp: 100},
    {id: '1', type: 'user', timestamp: 100},
    {id: '1', type: 'user', timestamp: 100},
    {id: '1', type: 'user', timestamp: 100}
  ])

  expect(activityList.get().length).toBe(3)
  expect(activityList.get()[0].timestamp).toBe(50)
  expect(activityList.get('game').length).toBe(1)
})

test('get game data from activity for syncing', () => {
  const gameData = activityList.get('game')
  const userList = [{userID: 1}, {userID: 2}]
  expect(syncGameData(gameData, 1, userList)).not.toBeNull()
  expect(syncGameData(gameData, 2, userList)).toBeNull()
})

test('remove activity from activityList', () => {
  activityList.remove('2')

  expect(activityList.get().length).toBe(2)
  expect(activityList.get()[0].id).toBe('1')
})

test('remove user from userList', () => {
  let userList = userListWithout([
    {userID: 'abc'},
    {userID: 'cde'}
  ], 'abc')

  expect(userList.length).toBe(1)
  expect(userList[0].userID).toBe('cde')
})

test('generate chunks', () => {
  let userList = ['1', '2', '3']
  let activityList = [1,2,3,4,5,6,7]

  expect(chunksBy('1').generate(userList, activityList).chunkSize).toBe(1/3)
  expect(chunksBy('1').generate(userList, activityList).chunk).toStrictEqual([1,2])
  expect(chunksBy('2').generate(userList, activityList).chunk).toStrictEqual([3,4])
  expect(chunksBy('3').generate(userList, activityList).chunk).toStrictEqual([5,6,7])

  userList = ['1', '2']
  activityList = [1,2,3,4]

  expect(chunksBy('1').generate(userList, activityList).chunkSize).toBe(1/2)
  expect(chunksBy('1').generate(userList, activityList).chunk).toStrictEqual([1,2])
  expect(chunksBy('2').generate(userList, activityList).chunk).toStrictEqual([3,4])
})

test('increment chunks', () => {
  let thisCantRun = false
  let ready = false
  const chunks = chunksBy('1')
  chunks.increment(1/3)
  chunks.increment(1/3)
  chunks.whenReady(() => {
    thisCantRun = true
  })
  chunks.increment(1/3)
  chunks.whenReady(() => {
    ready = true
  })
  expect(thisCantRun).toBe(false)
  expect(ready).toBe(true)
})
