import { useState, useEffect, useContext } from 'react'
import './Board.css'
import GameContext from '../../context/GameContext'
import CharacterDeck from './CharacterDeck'

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
      setGameData(prev => {
        return {...res.data, round: prev.round + 1}
      })
    })

    return clearHandleNewRound
  }, [socket, setRoundStarted, setGameData])

  return (
    <div>
      <CharacterDeck />
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
