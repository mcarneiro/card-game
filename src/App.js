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
    eventList: []
  })
  let [userData, setUserData] = useState({
    userName: '',
    isOnline: false
  })
  let [userList, setUserList] = useState([])

  useEffect(() => {
    const clear = []
    const handleHistory = (data) => {
      const activity = data.filter(val => val.type === 'game')
      const rounds = activity.length
      if (activity.length > 0) {
        setGameData({...activity.pop().data, round: rounds})
      }
    }
    clear.push(connection.handleUserListUpdate(setUserList))
    clear.push(connection.handleHistory(handleHistory))
    clear.push(connection.handleConnection((type) => {
      setUserData(prev => ({...prev, isOnline: type === 'connected'}))
    }))

    return () => clear.forEach(fn => fn())
  }, [setUserList])

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
