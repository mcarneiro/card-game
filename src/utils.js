const generateID = (() => {
  let i = 0
  return (timestamp) => ((timestamp || Date.now()) * Math.round(Math.random() * 10000)).toString(36) + (i++).toString(36)
})()


export {generateID}
