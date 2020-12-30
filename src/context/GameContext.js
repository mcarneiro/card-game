import React from 'react'

const GameContext = React.createContext({
  userData: {
    userName: '',
    isOnline: false
  },
  gameData: {
    round: 0,
    characterList: [],
    enemyList: [],
    eventList: [],
    iconList: [],
    roundData: {}
  },
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
