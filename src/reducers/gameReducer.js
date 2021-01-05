import {clone, idx} from '../utils'

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
        readyForNextRound: true
      }

    case 'NEW_ROUND':
      return {
        ...clone(state),
        ...payload,
        readyForNextRound: false
      }

    case 'ROUND_UPDATE':
      let isEqual = Object.keys(payload).reduce((acc, val) => {
        let localResistanceList = idx(['roundData', val, 'resistanceID'], state, [])
        let remoteResistanceList = idx([val, 'resistanceID'], payload, [])
        if (localResistanceList.length !== remoteResistanceList.length) {
          return 1
        }
        return acc + remoteResistanceList.filter((v, i) => localResistanceList[i] !== v).length === 0 ? 0 : 1
      }, 0) === 0

      if (!isEqual) {
        let clonedState = clone(state)
        return {
          ...clonedState,
          roundData: {
            ...clonedState.roundData,
            ...payload
          }
        }
      }
      return state

    case 'ASSIGN':
      const [character] = state.characterList.filter((character) => character.name === payload.userName)
      if (character.skill.indexOf(payload.label) < 0 || payload.amountSelected >= payload.amount) {
        return state
      }
      newGameData = clone(state)
      if (!newGameData.roundData[payload.userName]) {
        newGameData.roundData[payload.userName] = {resistanceID: []}
      }
      if (newGameData.roundData[payload.userName].resistanceID.length < character.canDestroy) {
        newGameData.roundData[payload.userName].resistanceID.push(payload.resistanceID)
      }
      return newGameData

    case 'UNASSIGN':
      newGameData = clone(state)

      let roundData = newGameData.roundData[payload.userName]
      let indexOf = roundData.resistanceID.indexOf(payload.resistanceID)

      if (indexOf >= 0) {
        roundData.resistanceID.splice(indexOf, 1)
      }
      return newGameData
    default:
      return state
    // use token
    // avoid block
  }
}

export default gameReducer
