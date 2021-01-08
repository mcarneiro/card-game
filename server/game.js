const data = require('./data/core')
const { generateID, clone } = require('./utils')
const shuffle = arr => {
  let len = arr.length
  let newArr = arr.concat()

  for (let i=0; i<len; i++) {
    let j = Math.min(Math.floor(Math.random() * ((len) - (i+1))) + (i+1), len-1)
    let oldVal = newArr[i]
    newArr[i] = newArr[j]
    newArr[j] = oldVal
  }

  return newArr
}

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
    eventIndex: 0,
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

  // one round apply the actions and the other will apply event effects / or will be canceled
  if (gameData.event) {
    let useToken = gameData.hasToken && Object.keys(gameData.roundData)
      .filter(label => !gameData.roundData[label].useToken).length === 0
    let newGameData = clone(gameData)

    newGameData.useToken = useToken

    if (newGameData.event.cancelable && newGameData.useToken && newGameData.hasToken) {
      newGameData.hasToken = false
      newGameData.useToken = false
      newGameData.event = null
      return newGameData
    }

    newGameData.enemyList = applyEvent(newGameData.event.effect, newGameData.enemyList)
    newGameData.event = null

    return newGameData
  }

  let tokenCount = 0
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

      let {toToken} = gameData.characterList.filter(({name}) => name === label)[0]

      if (roundData.getToken) {
        tokenCount += toToken
      }

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

  newGameData.hasToken = tokenCount >= 1

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

  newGameData.event = newGameData.eventList[newGameData.eventIndex]
  newGameData.eventIndex += 1
  if (newGameData.eventIndex >= newGameData.eventList.length) {
    newGameData.eventIndex = 0
  }

  newGameData.roundData = {}
  newGameData.round += 1
  return newGameData
}

const applyEvent = (effect, enemyList) => {
  const shuffle = Math.floor(Math.random() * enemyList.length)
  switch (effect.type) {
    case 'resistance':
      return enemyList.map((enemy, i) => {
        if (i !== shuffle) {
          return enemy
        }

        let resistanceEffect = effect.data.resistance.reduce((acc, val) => {
          acc[val.label] = val.amount
          return acc
        }, {})

        let resistance = enemy.resistance.map(resistance => {
          let amount = Math.max(resistance.amount + (resistanceEffect[resistance.label] || 0), 0)

          return {
            ...resistance,
            amount,
            destroyed: amount === 0
          }
        })

        let destroyed = enemy.resistance.filter(({destroyed}) => destroyed === false).length === 0

        return {
          ...enemy,
          resistance,
          destroyed
        }
      })
    case 'block':
      return enemyList
    case 'enemy':
      return enemyList
    }
  return enemyList
}

module.exports = {
  gameSetupBy,
  gameSetup,
  newRound
}
