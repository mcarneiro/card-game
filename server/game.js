const data = require('./data/core')
const shuffle = arr => arr.sort((a,b) => Math.random() >= 0.5 ? 1 : -1)

const getCharactersBy = list => (len) => {
  let characterList = list.concat()
  let leader = [characterList.shift()]
  return shuffle(leader.concat(shuffle(characterList).slice(0, len)))
}

const gameSetup = (userList) => {
  const {characterList, enemyList, eventList, skillList, multiplierList} = data
  const len = userList.length
  let getCharacters = getCharactersBy(characterList)

  // get Characters
  // shuffle and get enemies + time
  // shuffle and get resistances
  return {
    characters: getCharacters(len),
    enemyList: shuffle(enemyList).slice(0, Math.ceil(len * 0.5))
  }
}

const newRound = () => {

  // get assigns
  // remove resistances
  // shuffle event
  // remove time (enemy, blocks, ignition)

  // check resistances x time (destroy enemy, get time bonus)
  // check time
  return {}
}

module.exports = {
  gameSetup,
  newRound
}
