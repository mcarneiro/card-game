import './EnemyCard.css'

const EnemyCard = ({data}) => {

  let resistanceList = data.resistance.concat(data.rounds).map(val => {
    return (
      <li key={val.resistanceID}>
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
      </ul>
    </div>
  )
}

export default EnemyCard
