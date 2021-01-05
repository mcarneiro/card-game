const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000)).toString(36) + (i++).toString(36)
})()

const clone = (obj) => JSON.parse(JSON.stringify(obj))

const idx = (arr = [], obj, fallback = null) => (arr.reduce((acc, val) => {
  let newVal = isNaN(val) ? val : Number(val)
  if (acc && acc[newVal]) {
    return acc[newVal]
  }
  return null
}, obj) || fallback)

const idxl = (str, ...args) => idx(str.split('.'), ...args)

export {generateID, clone, idx, idxl}
