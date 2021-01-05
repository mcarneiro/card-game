import { useContext } from 'react'
import './EnemyDeck.css'
import gameContext, {getIconAssetBy} from '../../context/GameContext'
import EnemyCard from './EnemyCard'

const EnemyDeck = () => {
  let {gameState} = useContext(gameContext)

  if (gameState.enemyList.length === 0) {
    return null
  }

  const getIconAsset = getIconAssetBy(gameState.iconList)
  let cardList = gameState.enemyList.map((val, i) => {
    val.resistance = val.resistance.map(res => ({...res, ...getIconAsset(res.label)}))
    val.rounds = {...val.rounds, ...getIconAsset(val.rounds.icon)}

    return (
      <EnemyCard key={val.enemyID} data={val} />
    )
  })

  return (
    <div className="enemy-deck">
      {cardList}
    </div>
  )
}

export default EnemyDeck
