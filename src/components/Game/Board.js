import { useState, useEffect } from 'react'
import './Board.css'

const Board = ({socket, userList}) => {
  let [round, setRound] = useState({})
  let [roundStarted, setRoundStarted] = useState(true)
  const handleClick = (e) => {
    setRoundStarted(false)
    socket.sendReadyForNextRound()
  }

  useEffect(() => {
    const clearHandleNewRound = socket.handleNewRound(data => {
      setRoundStarted(true)
      setRound(data)
    })

    return clearHandleNewRound
  })

  return (
    <div>
      <p>
        Online users: {userList.map(val => val.userName).join(',')}
      </p>
      <p>
        Round: {JSON.stringify(round)}
      </p>
      { roundStarted &&
      <button onClick={handleClick}>Ready for the next round</button>
      }
    </div>
  )
}

export default Board
