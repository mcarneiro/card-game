import {clone, idx} from '../utils'

const gameInitialState = {
  round: 0,
  characterList: [],
  enemyList: [],
  eventList: [],
  event: false,
  iconList: [],
  roundData: {},
  status: '',
  statusMessage: '',
  timeBonus: 0,
  useToken: false,
  hasToken: false,
  ui: {
    readyForNextRound: false
  }
}

const gameReducer = (state, {type, payload}) => {
  let newGameData;
  switch (type) {
    case 'FROM_HISTORY':
      const lastRound = payload.filter(val => val.type === 'game' && val.message === 'new round').pop()
      const lastRoundData = payload.filter(val => val.type === 'game' && val.message === 'round data' && val.timestamp > lastRound.timestamp).pop()
      if (lastRound) {
        return {
          ...clone(state),
          ...lastRound.data,
          roundData: idx(['data'], lastRoundData, {})
        }
      }
      return state

    case 'READY':
      return {
        ...clone(state),
        ui: {
          readyForNextRound: true
        }
      }

    case 'NEW_ROUND':
      return {
        ...clone(state),
        ...payload,
        ui: {
          readyForNextRound: false
        }
      }

    case 'ROUND_UPDATE':
      let clonedState = clone(state)
      return {
        ...clonedState,
        roundData: {
          ...clonedState.roundData,
          ...payload
        }
      }

    case 'ASSIGN':
      const [character] = state.characterList.filter((character) => character.name === payload.userName)
      if (character.skill.indexOf(payload.label) < 0 || payload.amountSelected >= payload.amount) {
        return state
      }

      newGameData = clone(state)
      let userRoundData = newGameData.roundData[payload.userName]
      if (!userRoundData) {
        userRoundData = {resistanceID: [], enemyID: []}
      }

      const hasKnowledge = state.enemyList.filter(enemy => enemy.enemyID === payload.enemyID && enemy.characterList.indexOf(character.name) >= 0).length > 0

      if (userRoundData.enemyID.length < character.canDestroy && userRoundData.enemyID.indexOf(payload.enemyID) < 0) {
        userRoundData.enemyID.push(payload.enemyID)
      }

      if ((hasKnowledge || state.round === 1) && userRoundData.resistanceID.length < character.canDestroy) {
        userRoundData.resistanceID.push(payload.resistanceID)
      }

      newGameData.roundData[payload.userName] = userRoundData

      return newGameData

    case 'UNASSIGN':
      newGameData = clone(state)

      let roundData = newGameData.roundData[payload.userName]
      let resistanceIndexOf = roundData.resistanceID.indexOf(payload.resistanceID)
      let enemyIndexOf = roundData.enemyID.indexOf(payload.enemyID)

      if (resistanceIndexOf >= 0) {
        roundData.resistanceID.splice(resistanceIndexOf, 1)
      }

      if (enemyIndexOf >= 0) {
        roundData.enemyID.splice(enemyIndexOf, 1)
      }

      return newGameData
    default:
      return state
    // use token
    // avoid block
  }
}

export {gameInitialState}

export default gameReducer
