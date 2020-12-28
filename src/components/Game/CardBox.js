import { useContext } from 'react'
import './CardBox.css'
import gameContext from '../../context/GameContext'

const CardBox = () => {
  let {userList, gameData} = useContext(gameContext)

  const printCards = () => {
    if (!gameData.characterList) {
      return null
    }

    return gameData.characterList.map((val, i) => (
      <div key={val.characterID} className="card-box">
        <pre>{JSON.stringify(gameData.characterList[i])}</pre>
      </div>
    ))
  }

  return (
    printCards()
  )
}

export default CardBox
