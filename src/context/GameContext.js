import {createContext} from 'react'
import {gameInitialState} from '../reducers/gameReducer'


const GameContext = createContext({
  userData: {
    userName: '',
    isOnline: false
  },
  gameState: gameInitialState,
  userList: []
})

const getIconAssetBy = (iconList = []) => (label) => {
  const index = iconList.findIndex(elm => elm.label === label)
  if (index >= 0) {
    return iconList[index]
  }
  return label
}

export {getIconAssetBy}
export default GameContext
