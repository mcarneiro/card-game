import {
  generateID,
  clone,
  idx,
  idxl
} from './utils'

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

test('object is cloned', () => {
  let str = 'teste'
  let arr = [1,2,3]
  let obj = {a:{b:{c:[1,2,3]}}}
  let num = 1

  let duplicateStr = clone(str)
  duplicateStr = 'teste2'
  expect(str).not.toBe(duplicateStr)

  let duplicateArr = clone(arr)
  duplicateArr.push(4)
  expect(arr.length).not.toBe(duplicateArr.length)

  let duplicateObj = clone(obj)

  duplicateObj.a.b.teste = 1
  duplicateObj.a.b.c[0] = 'a'
  expect(obj.a.b.teste).toBeUndefined()
  expect(obj.a.b.c[0]).toBe(1)

  let duplicateNum = clone(num)
  duplicateNum = 'teste2'
  expect(num).not.toBe(duplicateNum)
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
