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
    iconList: []
  },
  userList: []
})

const getIconAssets = (list, iconList) => {
  const retList = Array.isArray(list) ? list : [list]
  if (!iconList) {
    return list
  }
  return retList.map(val => {
    const index = iconList.findIndex(elm => elm.label === val)
    if (index >= 0) {
      return iconList[index]
    }
    return val
  })
}

export {getIconAssets}
export default GameContext
