const compose = (...fns) => fns.reduceRight((prevFn, nextFn) => (...args) => nextFn(prevFn(...args)));
const noop = () => undefined
const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000) + (i++ + '')).toString(36)
})()

module.exports = {
  compose,
  noop,
  generateID
}
