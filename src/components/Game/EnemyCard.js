import {useContext} from 'react'
import {generateID} from '../../utils'
import './EnemyCard.css'
import GameContext from '../../context/GameContext'

const EnemyCard = ({data}) => {
  let {userData, gameData, setGameData} = useContext(GameContext)

  const handleResistanceClick = ({resistanceID}) => e => {
    setGameData(prev => {
      let newGameData = {...prev}
      if (!newGameData.roundData[userData.userName]) {
        newGameData.roundData[userData.userName] = {}
      }
      newGameData.roundData[userData.userName].resistanceID = resistanceID
      return newGameData
    })
  }

  let resistanceList = data.resistance.map(val => {
    const itemClassName = (gameData.roundData[userData.userName] ||{}).resistanceID === val.resistanceID ? '-active' : ''
    return (
      <li key={val.resistanceID} className={itemClassName} onClick={handleResistanceClick(val)}>
        <img src={val.url} />
        <strong>{val.amount}</strong>
      </li>
    )
  })

  return (
    <div className="enemy-card">
      <p className="name">
        {data.label}
      </p>
      <p className="description">
        {data.description}
      </p>
      <ul className="resistance">
        {resistanceList}
        <li key={data.rounds.roundsID} className="rounds">
          <img src={data.rounds.url} />
          <strong>{data.rounds.amount}</strong>
        </li>
      </ul>
    </div>
  )
}

export default EnemyCard
