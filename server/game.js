const data = require('./data/core')
const { generateID, clone } = require('./utils')
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
    .slice(0, Math.ceil(len * 0.5) + 3)
    .map((val) => ({
        ...val,
        enemyID: generateID(),
        resistance: val.resistance.map(applyMultiplier).map(val => ({...val, resistanceID: generateID()})),
        rounds: {...val.rounds, roundsID: generateID()},
        destroyed: false,
        characterList: [],
        blocked: false,
        blockedRounds: 0
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
    event: false,
    iconList,
    roundData: {},
    timeBonus: 0,
    status: 'active',
    statusMessage: 'game running',
    hasToken: true,
    useToken: false,
    round: 1
  }
}
const gameSetup = gameSetupBy(data)

const newRound = (gameData) => {

  if (gameData.event) {
    if (gameData.event.cancelable && gameData.useToken && gameData.hasToken) {
      let newGameData = clone(gameData)
      newGameData.hasToken = false
      newGameData.useToken = false
      newGameData.event = null
      return newGameData
    }

    if (!gameData.event.cancelable || !gameData.hasToken) {
      gameData.event = null
    }

    // apply changes
  }

  let newGameData = Object.keys(gameData.roundData)
    .reduce((gameData, label) => {
      let roundData = gameData.roundData[label]

      gameData.enemyList = gameData.enemyList.map(enemy => {
        let resistance = enemy.resistance.map(resistance => {
          let toKill = roundData.resistanceID.join('').split(resistance.resistanceID).slice(1).length
          let amount = Math.max(resistance.amount - toKill, 0)

          return {
            ...resistance,
            amount,
            destroyed: amount === 0
          }
        })

        let destroyed = resistance.filter(resistance => !resistance.destroyed).length === 0

        if (roundData.enemyID.indexOf(enemy.enemyID) >= 0 && enemy.characterList.indexOf(label) < 0) {
          enemy.characterList.push(label)
        }

        return {
          ...enemy,
          resistance,
          destroyed
        }
      })

      return gameData
    }, clone(gameData))

  newGameData.enemyList = newGameData.enemyList.map(enemy => {
    return {
      ...enemy,
      rounds: {
        ...enemy.rounds,
        amount: enemy.rounds.amount - (enemy.destroyed ? 0 : 1)
      }
    }
  })

  let timeIsUp = newGameData.enemyList.map(enemy => enemy.rounds.amount === 0).indexOf(true) >= 0
  let allEnemiesDestroyed = newGameData.enemyList.map(enemy => enemy.destroyed).indexOf(false) < 0

  if (timeIsUp) {
    newGameData.status = 'end'
    newGameData.statusMessage = 'time is up'
  }

  if (allEnemiesDestroyed) {
    newGameData.status = 'end'
    newGameData.statusMessage = 'win'
  }

  newGameData.timeBonus = newGameData.enemyList.reduce((acc, curr) => acc + (curr.destroyed ? curr.rounds.amount : 0), 0)

  newGameData.event = newGameData.eventList.pop()

  if (!newGameData.event.cancelable || !newGameData.hasToken) {
    // apply changes
  }

  newGameData.roundData = {}
  newGameData.round += 1
  return newGameData
}

module.exports = {
  gameSetupBy,
  gameSetup,
  newRound
}
