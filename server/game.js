const data = require('./data/core')
const { generateID } = require('./utils')
const shuffle = arr => arr.sort((a,b) => Math.random() >= 0.5 ? 1 : -1)

const getCharactersBy = list => (len) => {
  let characterList = list.concat()
  let leader = [characterList.shift()]
  return shuffle(leader.concat(shuffle(characterList).slice(0, len - 1)))
}

const applyMultiplierBy = multiplierList => {
  let shuffledMultiplierList = shuffle(multiplierList)

  return (data) => {
    if (shuffledMultiplierList.length === 0) {
      shuffledMultiplierList = shuffle(multiplierList)
    }
    if (data.amount === -1) {
      return {
        ...data,
        amount: shuffledMultiplierList.shift()
      }
    }
    return data
  }
}

const gameSetup = (userList) => {
  const {characterList, enemyList, eventList, iconList, multiplierList} = data
  const len = userList.length
  let getCharacters = getCharactersBy(characterList)
  let applyMultiplier = applyMultiplierBy(multiplierList)
  let newEnemyList = shuffle(enemyList).slice(0, Math.ceil(len * 0.5))
  let newCharacterList = getCharacters(len).map((val, i) => {
    val.name = userList[i].userName
    val.characterID = generateID()
    return val
  })

  newEnemyList = newEnemyList.map((enemy, i) => {
    return {
      ...enemy,
      resistance: applyMultiplier(enemy.resistance)
    }
  })

  return {
    characterList: newCharacterList,
    enemyList: newEnemyList,
    eventList: shuffle(eventList),
    iconList
  }
}

const newRound = (userList, gameData) => {

  // get assigns
  // remove resistances
  // shuffle event
  // remove time (enemy, blocks, ignition)

  // check resistances x time (destroy enemy, get time bonus)
  // check time
  return gameData
}

module.exports = {
  gameSetup,
  newRound
}
