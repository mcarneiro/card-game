const data = require('./data/core')
const { generateID, clone, shuffle, circleArray } = require('./utils')

const createResistance = obj => ({
  label: '',
  amount: 0,
  resistanceID: generateID(),
  destroyed: false,
  ...obj
})

const createEnemy = obj => ({
  characterList: [],
  resistance: [],
  enemyID: generateID(),
  rounds: {
    ...obj.rounds,
    roundsID: generateID()
  },
  destroyed: false,
  blocked: false,
  blockedRounds: 0,
  ...obj
})

const createCharacter = obj => ({
  name: '',
  characterID: generateID(),
  ...obj
})

const createEvent = obj => ({
  eventID: generateID(),
  ...obj
})

const getCharactersBy = list => (len) => {
  let max = Math.min(list.length, len)
  let characterList = list.concat()
  let leader = [characterList.shift()]
  return shuffle(leader.concat(shuffle(characterList).slice(0, max - 1)))
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
    .map((val) => createEnemy({
        ...val,
        resistance: val.resistance.map(applyMultiplier).map(createResistance)
    }))

  let newCharacterList = getCharacters(len)
    .map((val, i) => createCharacter({
      ...val,
      name: userList[i].userName
    }))

  let newEventList = shuffle(eventList).map(createEvent)

  return {
    characterList: newCharacterList,
    enemyList: newEnemyList,
    eventList: newEventList,
    eventIndex: 0,
    event: null,
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

const roundToEnemy = (roundData, enemyList) => {

  let resistanceIDList = Object.keys(roundData).reduce((arr, key) => arr.concat(roundData[key].resistanceID), [])

  return enemyList.map(enemy => {

    let resistance = enemy.resistance.map(resistance => {
      let toKill = resistanceIDList.join('').split(resistance.resistanceID).slice(1).length
      let amount = Math.max(resistance.amount - toKill, 0)

      return {
        ...resistance,
        amount,
        destroyed: amount === 0
      }
    })

    let destroyed = resistance.filter(resistance => !resistance.destroyed).length === 0

    let characterList = Object.keys(roundData).reduce((characterList, label) => {
      let userRoundData = roundData[label]
      if (userRoundData.enemyID.indexOf(enemy.enemyID) >= 0 && enemy.characterList.indexOf(label) < 0) {
        return characterList.concat(label)
      }
      return characterList
    }, enemy.characterList)

    return {
      ...enemy,
      characterList,
      resistance,
      destroyed,
      rounds: {
        ...enemy.rounds,
        amount: enemy.rounds.amount - (destroyed ? 0 : 1)
      }
    }
  })
}

const checkForToken = (roundData, characterList) => {
  return Object.keys(roundData).reduce((tokenCount, label) => {
    let userRoundData = roundData[label]
    let {toToken} = characterList.filter(({name}) => name === label)[0]
    if (userRoundData.getToken) {
      return tokenCount + toToken
    }
    return tokenCount
  }, 0)
}

const getEndGameStatus = (enemyList) => {
  let timeIsUp = enemyList.map(enemy => enemy.rounds.amount === 0).indexOf(true) >= 0
  let allEnemiesDestroyed = enemyList.map(enemy => enemy.destroyed).indexOf(false) < 0
  let returnValue = {}

  if (timeIsUp) {
    return {
      status: 'end',
      statusMessage: 'time is up'
    }
  }

  if (allEnemiesDestroyed) {
    return {
      status: 'end',
      statusMessage: 'win'
    }
  }

  return {}
}

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

  let newGameData = clone(gameData)
  newGameData.enemyList = roundToEnemy(newGameData.roundData, newGameData.enemyList)
  newGameData.hasToken = checkForToken(newGameData.roundData, newGameData.characterList) >= 1
  let [eventIndex, event] = circleArray(newGameData.eventIndex, newGameData.eventList)
  newGameData = {...newGameData, eventIndex, event, ...getEndGameStatus(newGameData.enemyList)}

  newGameData.timeBonus = newGameData.enemyList.reduce((acc, curr) => acc + (curr.destroyed ? curr.rounds.amount : 0), 0)

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

          delete resistanceEffect[resistance.label]

          return {
            ...resistance,
            amount,
            destroyed: amount === 0
          }
        })

        let remainingResistanceEffect = Object.keys(resistanceEffect)
        if (remainingResistanceEffect.length > 0) {
          let newResistances = remainingResistanceEffect.reduce((arr, key) => {
            let amount = resistanceEffect[key]
            if (amount > 0) {
              return arr.concat(createResistance({
                label: key,
                amount
              }))
            }
            return arr
          }, [])
          resistance = resistance.concat(newResistances)
        }

        let destroyed = resistance.filter(({destroyed}) => destroyed === false).length === 0

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
  newRound,
  circleArray
}
