import {useContext} from 'react'
import './EnemyCard.css'
import GameContext from '../../context/GameContext'

const EnemyCard = ({data}) => {
  let {userData, gameData, setGameData} = useContext(GameContext)

  const handleResistanceClick = ({resistanceID, label}) => e => {
    const [character] = gameData.characterList.filter((character) => character.name === userData.userName)
    if (character.skill.indexOf(label) < 0) {
      return
    }
    setGameData(prev => {
      let newGameData = {...prev}
      if (!newGameData.roundData[userData.userName]) {
        newGameData.roundData[userData.userName] = {resistanceID: []}
      }
      if (newGameData.roundData[userData.userName].resistanceID.length < character.canDestroy) {
        newGameData.roundData[userData.userName].resistanceID.push(resistanceID)
      }
      return newGameData
    })
  }

  let resistanceList = data.resistance.map(val => {
    let itemClassName = ''
    let roundData = gameData.roundData[userData.userName]
    if (roundData && roundData.resistanceID.indexOf(val.resistanceID) >= 0) {
      itemClassName = '-active'
    }
    return (
      <li key={val.resistanceID} className={itemClassName} onClick={handleResistanceClick(val)}>
        <img alt={val.label} src={val.url} />
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
          <img alt={data.rounds.label} src={data.rounds.url} />
          <strong>{data.rounds.amount}</strong>
        </li>
      </ul>
    </div>
  )
}

export default EnemyCard
