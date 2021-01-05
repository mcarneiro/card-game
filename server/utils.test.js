const {
  generateID,
  compose,
  noop,
  idx,
  idxl
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

test('test elements from an object without breaking', () => {
  let obj = {teste:{a:[{deep:{a: 1}}]}}

  expect(idx()).toBe(null)
  expect(idx(['teste','a',0,'deep','a'], null)).toBe(null)
  expect(idx(['teste','a',0,'deep','a'], null, 1)).toBe(1)
  expect(idx(['teste','a',0,'deep','a'], obj)).toBe(1)
  expect(idxl('teste.a.0.deep.a', obj)).toBe(1)
  expect(idx(['teste','a','1','deep','a'], obj)).toBeNull()
  expect(idx(['teste','a',1,'deep','a'], obj, [])).toStrictEqual([])
})
