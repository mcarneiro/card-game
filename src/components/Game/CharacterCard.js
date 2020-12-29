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

  return (
    <div className="card -character">
      <p className="name">{name}</p>
      <ul className="skills">
        {skills}
      </ul>
    </div>
  )
}

export default CharacterCard
