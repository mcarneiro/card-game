import { useState, useEffect, useContext } from 'react'
import './Board.css'
import GameContext from '../../context/GameContext'
import CardBox from './CardBox'

const Board = ({socket}) => {
  let [roundStarted, setRoundStarted] = useState(true)
  let {gameData, setGameData, userList} = useContext(GameContext)

  const handleClick = () => {
    setRoundStarted(false)
    socket.sendReadyForNextRound()
  }

  useEffect(() => {
    const clearHandleNewRound = socket.handleNewRound(res => {
      setRoundStarted(true)
      console.log('setGameData', res)
      setGameData(res.data)
    })

    return clearHandleNewRound
  }, [socket, setRoundStarted, setGameData])

  return (
    <div>
      <CardBox />
      <p>
        Online users: {userList.map(val => val.userName).join(',')}
      </p>
      <p>
        Round: {JSON.stringify(gameData)}
      </p>
      { roundStarted &&
      <button onClick={handleClick}>
        {gameData.round > 0 ? 'Ready for the next round' : 'Start game'}
      </button>
      }
    </div>
  )
}

export default Board
