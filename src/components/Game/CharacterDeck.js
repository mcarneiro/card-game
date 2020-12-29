import { useContext } from 'react'
import './CharacterDeck.css'
import gameContext, {getIconAssets} from '../../context/GameContext'
import CharacterCard from './CharacterCard'

const CharacterDeck = () => {
  let {userData, gameData} = useContext(gameContext)

  if (gameData.characterList.length === 0) {
    return null
  }

  let characterList = gameData.characterList.sort((a,b) => (a.name === userData.userName) ? -1 : 1)
  let cardList = characterList.map(val => {
    const skillList = getIconAssets(val.skill, gameData.iconList)

    return (
      <CharacterCard key={val.characterID} name={val.name} skillList={skillList} />
    )
  })

  return (
    <div className="character-deck">
      {cardList}
    </div>
  )
}

export default CharacterDeck
