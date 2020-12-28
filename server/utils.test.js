const {
  generateID,
  compose,
  noop,
} = require('./utils')

test('compose', () => {
  const fn1 = () => 1;
  const fn2 = val => val + 1
  expect(compose(fn2, fn1)()).toBe(2)
})

test('noop', () => {
  expect(noop()).toBe(undefined)
})

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
