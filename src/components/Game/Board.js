import { useEffect, useContext } from 'react'
import './Board.css'
import GameContext from '../../context/GameContext'
import CharacterDeck from './CharacterDeck'
import EnemyDeck from './EnemyDeck'

const Board = ({socket}) => {
  let {gameState, gameDispatcher, userData, userList} = useContext(GameContext)

  const handleClick = () => {
    gameDispatcher({
      type: 'READY'
    })
    socket.sendReadyForNextRound(gameState.roundData)
  }

  useEffect(() => {
    const clear = [
      socket.handleNewRound(res => {
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
  }, [socket, userData, gameDispatcher])

  useEffect(() => {
    if (gameState.readyForNextRound) {
      return
    }

    console.log('update round data', gameState.roundData)
    socket.updateRoundData(gameState.roundData)
  }, [socket, gameState])

  return (
    <div className="board">
      <CharacterDeck />
      <EnemyDeck />
      <p>
        Online users: {userList.map(val => val.userName).join(',')}
      </p>

      { gameState.readyForNextRound ?
      <div className="button-next-round">
        waiting for others...
      </div>
      :
      <button className="button-next-round" onClick={handleClick}>
        {gameState.round > 0 ? 'Ready for the next round' : 'Start game'}
      </button>
      }
    </div>
  )
}

export default Board
