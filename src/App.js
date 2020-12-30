import { useState, useEffect } from 'react'
import socket from './business/socket'
import Board from './components/Game/Board'
import Chat from './components/Chat/Chat'
import Register from './components/Register'
import GameContext from './context/GameContext'
import './App.css'

const connection = socket('ws://localhost:3001')

const App = () => {
  let [gameData, setGameData] = useState({
    round: 0,
    characterList: [],
    enemyList: [],
    eventList: [],
    iconList: [],
    roundData: {}
  })
  let [userData, setUserData] = useState({
    userName: '',
    isOnline: false
  })
  let [userList, setUserList] = useState([])

  useEffect(() => {
    const clear = [
      connection.handleUserListUpdate(setUserList),

      connection.handleHistory((data) => {
        const activity = data.filter(val => val.type === 'game')
        const rounds = activity.length
        if (activity.length > 0) {
          setGameData(prev => ({...prev, ...activity.pop().data, round: rounds}))
        }
      }),

      connection.handleConnection((type) => {
        setUserData(prev => ({...prev, isOnline: type === 'connected'}))
      })
    ]

    return () => clear.map(fn => fn())
  }, [setUserList, setGameData, setUserData])

  return (
    <GameContext.Provider value={{userList, userData, setUserData, gameData, setGameData}}>
      { !userData.isOnline ? 'Disconnected!' : '' }
      { !userData.userName ?
        <Register join={connection.join} />
      : '' }
      { !!userData.userName ?
        <>
          <Board socket={connection}></Board>
          <Chat socket={connection} />
        </>
      : '' }
    </GameContext.Provider>
  );
}

export default App
