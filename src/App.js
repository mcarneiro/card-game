import { useState, useEffect, useReducer } from 'react'
import socket from './business/socket'
import Board from './components/Game/Board'
import Chat from './components/Chat/Chat'
import Register from './components/Register'
import GameContext from './context/GameContext'
import gameReducer, {gameInitialState} from './reducers/gameReducer'
import './App.css'

const connection = socket('ws://localhost:3001')

const App = () => {
  let [gameState, gameDispatcher] = useReducer(gameReducer, gameInitialState)
  let [userData, setUserData] = useState({
    userName: '',
    isOnline: false
  })
  let [userList, setUserList] = useState([])

  useEffect(() => {
    const clear = [
      connection.handleUserListUpdate(setUserList),

      connection.handleHistory((data) => {
        gameDispatcher({
          type: 'FROM_HISTORY',
          payload: data
        })
      }),

      connection.handleConnection((type) => {
        setUserData(prev => ({...prev, isOnline: type === 'connected'}))
      })
    ]

    return () => clear.map(fn => fn())
  }, [setUserList, setUserData])

  return (
    <GameContext.Provider value={{userList, userData, setUserData, gameState, gameDispatcher}}>
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
