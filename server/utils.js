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

module.exports = {
  compose,
  noop,
  generateID,
  idx,
  idxl
}
