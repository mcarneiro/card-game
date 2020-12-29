import { useContext } from 'react'
import './CardBox.css'
import gameContext from '../../context/GameContext'

const CardBox = () => {
  let {userData, gameData} = useContext(gameContext)

  const printCards = () => {
    if (!gameData.characterList) {
      return null
    }

    let characterList = gameData.characterList.sort((a,b) => (a.name === userData.userName) ? -1 : 1)

    return characterList.map((val, i) => (
      <div key={val.characterID} className="card-box">
        <p>{val.name}</p>
        <p>{val.skill.join(', ')}</p>
      </div>
    ))
  }

  return (
    printCards()
  )
}

export default CardBox
