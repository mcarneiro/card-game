import './CharacterCard.css'

const CharacterCard = ({name, skillList}) => {
  if (!skillList) {
    return null
  }

  let skills = skillList.map((val, i) => {
    return (
      <li key={i}>
        <img src={val.url} />
      </li>
    )
  })
  let skillsClassName = `skills -quant-${skillList.length}`

  return (
    <div className="character-card">
      <p className="name">{name}</p>
      <ul className={skillsClassName}>
        {skills}
      </ul>
    </div>
  )
}

export default CharacterCard
