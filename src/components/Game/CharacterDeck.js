import { useContext } from 'react'
import './CharacterDeck.css'
import gameContext, {getIconAssetBy} from '../../context/GameContext'
import CharacterCard from './CharacterCard'

const CharacterDeck = () => {
  let {userData, gameState} = useContext(gameContext)

  if (gameState.characterList.length === 0) {
    return null
  }

  let characterList = gameState.characterList.sort((a,b) => (a.name === userData.userName) ? -1 : 1)
  let cardList = characterList.map(val => {
    const skillList = val.skill.map(getIconAssetBy(gameState.iconList))

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
