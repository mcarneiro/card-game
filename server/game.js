const data = require('./data/core')
const { generateID } = require('./utils')
const shuffle = arr => arr.concat().sort((a,b) => Math.random() >= 0.5 ? 1 : -1)

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

const gameSetupBy = data => (userList) => {
  const {characterList, enemyList, eventList, iconList, multiplierList} = data
  const len = userList.length
  let getCharacters = getCharactersBy(characterList)
  let applyMultiplier = applyMultiplierBy(multiplierList)

  let newEnemyList = shuffle(enemyList)
    .slice(0, Math.ceil(len * 0.5))
    .map((val) => ({
        ...val,
        enemyID: generateID(),
        resistance: val.resistance.map(applyMultiplier).map(val => ({...val, resistanceID: generateID()})),
        rounds: {...val.rounds, roundsID: generateID()}
    }))

  let newCharacterList = getCharacters(len)
    .map((val, i) => ({
      ...val,
      name: userList[i].userName,
      characterID: generateID()
    }))

  let newEventList = shuffle(eventList).map((val) => ({
    ...val,
    eventId: generateID()
  }))

  return {
    characterList: newCharacterList,
    enemyList: newEnemyList,
    eventList: newEventList,
    iconList,
    roundData: {}
  }
}
const gameSetup = gameSetupBy(data)

const newRound = (gameData) => {
  let newGameData = Object.keys(gameData.roundData)
    .reduce((gameData, label) => {
      let newGameData = JSON.parse(JSON.stringify(gameData))
      let roundData = gameData.roundData[label]

      newGameData.enemyList = gameData.enemyList.map(enemy => {
        let resistance = enemy.resistance.map(resistance => {
          let toKill = roundData.resistanceID.join('').split(resistance.resistanceID).slice(1).length

          return {
            ...resistance,
            amount: resistance.amount - toKill
          }
        })

        return {...enemy, resistance}
      })

      return newGameData
    }, gameData)

  newGameData.enemyList = newGameData.enemyList.map(enemy => {
    return {
      ...enemy,
      rounds: {
        ...enemy.rounds,
        amount: enemy.rounds.amount - 1
      }
    }
  })

  // shuffle event

  // check resistances x time (destroy enemy, get time bonus)
  // check time

  newGameData.roundData = {}
  return newGameData
}

module.exports = {
  gameSetupBy,
  gameSetup,
  newRound
}
