import { useEffect, useState } from 'react'
import gameSetup from './business/game-setup'
import socket from './business/socket'
import Board from './components/Board'
import Chat from './components/Chat/Chat'
import Register from './components/Register'
import UserContext from './context/UserContext'

const connection = socket()

const App = () => {
  let [userData, setUserData] = useState({name: '', isOnline: false})
  // let [core, setCore] = useState({})

  // useEffect(() => {
  //   gameSetup()
  //     .then(setCore)
  //     .then(() => setLoadingClass(''))
  // }, [])

  return (
    <UserContext.Provider value={{userData, setUserData}}>
    { !userData.isOnline ?
      <Register socket={connection} />
    : '' }
    { userData.isOnline ?
      <>
        <Board></Board>
        <Chat socket={connection} />
      </>
    : '' }
    </UserContext.Provider>
  );
}

export default App
