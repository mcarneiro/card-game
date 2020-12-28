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
    eventList: []
  },
  userList: []
})

export default GameContext
