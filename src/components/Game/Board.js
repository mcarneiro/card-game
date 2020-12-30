import { useState, useEffect, useContext } from 'react'
import './Board.css'
import GameContext from '../../context/GameContext'
import CharacterDeck from './CharacterDeck'
import EnemyDeck from './EnemyDeck'

const Board = ({socket}) => {
  let [roundStarted, setRoundStarted] = useState(true)
  let {gameData, setGameData, userList} = useContext(GameContext)

  const handleClick = () => {
    setRoundStarted(false)
    socket.sendReadyForNextRound(gameData.roundData)
  }

  useEffect(() => {
    const clear = [
      socket.handleNewRound(res => {
        setRoundStarted(true)
        setGameData(prev => {
          return {...prev, ...res.data, round: prev.round + 1}
        })
      })
    ]

    return () => clear.map(fn => fn)
  }, [socket, setRoundStarted, setGameData])

  return (
    <div className="board">
      <CharacterDeck />
      <EnemyDeck />
      <p>
        Online users: {userList.map(val => val.userName).join(',')}
      </p>

      { roundStarted ?
      <button className="button-next-round" onClick={handleClick}>
        {gameData.round > 0 ? 'Ready for the next round' : 'Start game'}
      </button>
      :
      <div className="button-next-round">
        waiting for others...
      </div>

      }
    </div>
  )
}

export default Board
