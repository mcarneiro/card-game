import { useEffect, useState } from 'react'
import gameSetup from './business/game-setup'
import socket from './business/socket'
import Board from './components/Board'
import Chat from './components/Chat/Chat'

const connection = socket()

const App = () => {
  let [loadingClass, setLoadingClass] = useState('-loading')
  let [core, setCore] = useState({})
  console.log('app')

  // useEffect(() => {
  //   gameSetup()
  //     .then(setCore)
  //     .then(() => setLoadingClass(''))
  // }, [])

  return (
    <div className={loadingClass}>
      <Board></Board>
      <Chat socket={connection}></Chat>
    </div>
  );
}

export default App
