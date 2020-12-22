import { useEffect, useState } from 'react'
import gameSetup from '../../business/game-setup'
import './Board.css'

const Board = ({userList}) => {
  let [core, setCore] = useState({})

  useEffect(() => {
    gameSetup().then(setCore)
  }, [])

  return (
    <div>
      Online users: {userList.map(val => val.userName).join(',')}
    </div>
  )
}

export default Board
