import { useState, useEffect, useContext } from 'react'
import './Board.css'
import GameContext from '../../context/GameContext'
import CharacterDeck from './CharacterDeck'
import EnemyDeck from './EnemyDeck'
import {idx} from '../../utils'

const Board = ({socket}) => {
  let [roundStarted, setRoundStarted] = useState(true)
  let {gameState, gameDispatcher, userData, userList} = useContext(GameContext)

  const handleClick = () => {
    setRoundStarted(false)
    socket.sendReadyForNextRound(gameState.roundData)
  }

  useEffect(() => {
    const clear = [
      socket.handleNewRound(res => {
        setRoundStarted(true)
        gameDispatcher({
          type: 'NEW_ROUND',
          payload: res.data
        })
      }),

      socket.handleRoundDataUpdate(res => {
        if (userData.userName === res.userName) {
          return;
        }

        gameDispatcher({
          type: 'ROUND_UPDATE',
          payload: res.data
        })
      })
    ]

    return () => clear.map(fn => fn())
  }, [socket, setRoundStarted, gameState, userData])

  useEffect(() => {
    socket.updateRoundData(gameState.roundData)
  }, [gameState])

  return (
    <div className="board">
      <CharacterDeck />
      <EnemyDeck />
      <p>
        Online users: {userList.map(val => val.userName).join(',')}
      </p>

      { roundStarted ?
      <button className="button-next-round" onClick={handleClick}>
        {gameState.round > 0 ? 'Ready for the next round' : 'Start game'}
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
