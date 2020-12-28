import { useState, useEffect } from 'react'
import socket from './business/socket'
import Board from './components/Game/Board'
import Chat from './components/Chat/Chat'
import Register from './components/Register'
import GameContext from './context/GameContext'

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
    clear.push(connection.handleUserListUpdate(setUserList))
    clear.push(connection.handleCurrentState((res) => {
      setGameData(prev => ({...prev, ...res.data.gameData}))
    }))
    clear.push(connection.handleConnection((type, res) => {
      setUserData(prev => ({...prev, isOnline: type === 'connected'}))
      if (type === 'connected') {
        connection.askCurrentState()
      }
    }))

    return () => clear.forEach(fn => fn())
  }, [])

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
