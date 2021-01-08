const compose = (...fns) => fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)));
const noop = () => undefined
const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000)).toString(36) + (i++).toString(36)
})()

const idx = (arr = [], obj, fallback = null) => (arr.reduce((acc, val) => {
  let newVal = isNaN(val) ? val : Number(val)
  if (acc && acc[newVal]) {
    return acc[newVal]
  }
  return null
}, obj) || fallback)

const idxl = (str, ...args) => idx(str.split('.'), ...args)

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const shuffle = arr => {
  let len = arr.length
  let newArr = clone(arr)

  for (let i=0; i<len; i++) {
    let j = Math.min(Math.floor(Math.random() * ((len) - (i+1))) + (i+1), len-1)
    let oldVal = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = oldVal
  }

  return newArr
}

module.exports = {
  compose,
  noop,
  generateID,
  idx,
  idxl,
  clone,
  shuffle
}
