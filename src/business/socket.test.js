import {generateID, activityList, chunksBy, userListWithout} from './socket'

test('generate IDs that are not equal', () => {
  let arr = []
  for(let i = 0; i < 100; i++) {
    arr[i] = generateID()
  }
  let arr2 = arr.filter((val, i, arr) => arr.indexOf(val) === i)

  expect(arr2.length).toBe(arr.length)
});

test('add new activity to activityList', () => {
  activityList.add([
    {id: '1', timestamp: 100}
  ])
  activityList.add([
    {id: '2', timestamp: 50},
    {id: '2', timestamp: 100},
    {id: '1', timestamp: 100},
    {id: '1', timestamp: 100},
    {id: '1', timestamp: 100}
  ])

  expect(activityList.get().length).toBe(2)
  expect(activityList.get()[0].timestamp).toBe(50)
})

test('remove activity from activityList', () => {
  activityList.remove('2')

  expect(activityList.get().length).toBe(1)
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
