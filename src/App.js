import { useState, useEffect } from 'react'
import socket from './business/socket'
import Board from './components/Game/Board'
import Chat from './components/Chat/Chat'
import Register from './components/Register'
import UserContext from './context/UserContext'

const connection = socket()

const App = () => {
  let [userData, setUserData] = useState({name: '', isOnline: false})
  let [userList, setUserList] = useState([])

  useEffect(() => {
    connection.handleUserListUpdate(setUserList)
    connection.handleConnection(type => {
      setUserData(prev => ({...prev, isOnline: type === 'connected'}))
    })
  }, [])

  return (
    <UserContext.Provider value={{userData, setUserData, userList, setUserList}}>
      { !userData.isOnline ? 'Disconnected!' : '' }
      { !userData.userName ?
        <Register join={connection.join} />
      : '' }
      { !!userData.userName ?
        <>
          <Board socket={connection} userList={userList}></Board>
          <Chat socket={connection} />
        </>
      : '' }
    </UserContext.Provider>
  );
}

export default App
