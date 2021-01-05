import {useContext} from 'react'
import {idxl, clone} from '../../utils'
import './EnemyCard.css'
import GameContext from '../../context/GameContext'

const EnemyCard = ({data}) => {
  let {userData, gameState, gameDispatcher} = useContext(GameContext)

  const handleResistanceClick = ({resistanceID, label}) => e => {
    gameDispatcher({
      type: 'ASSIGN',
      payload: {
        userName: userData.userName,
        label,
        resistanceID
      }
    })
  }

  const handleRemoveResistanceClick = ({resistanceID}) => e => {
    e.stopPropagation()
    gameDispatcher({
      type: 'UNASSIGN',
      payload: {
        userName: userData.userName,
        resistanceID
      }
    })
  }

  let resistanceList = data.resistance.map(val => {
    let itemClassName = ''
    let removeButton = ''
    let userActions = Object.keys(gameState.roundData)
      .map(key => {
        let amountSelected = gameState.roundData[key].resistanceID
          .filter((resistanceID) => val.resistanceID === resistanceID).length

        return {
          amount: amountSelected,
          name: key
        }
      })
      .filter(obj => obj.amount > 0)
      .reduce((acc, val) => {
        return {
          amount: acc.amount + val.amount,
          name: acc.name.concat(val.name)
        }
      }, {amount: 0, name: []})

      if (userActions.amount > 0) {
        itemClassName = '-active'
      }

      if (userActions.name.indexOf(userData.userName) >= 0) {
        removeButton = (
          <button onClick={handleRemoveResistanceClick(val)}>
            remove
          </button>
        )
      }


    return (
      <li key={val.resistanceID} className={itemClassName} onClick={handleResistanceClick(val)}>
        <img alt={val.label} src={val.url} />
        <strong>{val.amount}</strong><br />
        <em>{userActions.amount}</em> <br />
        {removeButton}
        <p>{userActions.name.join(', ')}</p>
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
