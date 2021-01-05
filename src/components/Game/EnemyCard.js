import {useContext} from 'react'
import {idxl, clone} from '../../utils'
import './EnemyCard.css'
import GameContext from '../../context/GameContext'

const EnemyCard = ({data}) => {
  let {userData, gameState, gameDispatcher} = useContext(GameContext)

  const handleResistanceClick = (resistance, amountSelected) => e => {
    gameDispatcher({
      type: 'ASSIGN',
      payload: {
        userName: userData.userName,
        ...resistance,
        amountSelected
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
    let itemClassName = []
    let userActions = Object.keys(gameState.roundData)
      .map(name => {
        let amountSelected = gameState.roundData[name].resistanceID
          .filter((resistanceID) => val.resistanceID === resistanceID).length

        return {
          amount: amountSelected,
          name
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
        itemClassName.push('-active')
      }

      if (val.destroyed) {
        itemClassName.push('-destroyed')
      }

      if (userActions.amount >= val.amount) {
        itemClassName.push('-cant-add')
      }

      let printRemoveButton = userActions.name.indexOf(userData.userName) >= 0 && !gameState.readyForNextRound


    return (
      <li key={val.resistanceID} className={itemClassName.join(' ')} onClick={val.destroyed ? null : handleResistanceClick(val, userActions.amount)}>
        <img alt={val.label} src={val.url} />
        <strong>{val.amount}</strong><br />
        <em>{userActions.amount}</em> <br />
        {printRemoveButton &&
        <button onClick={handleRemoveResistanceClick(val)}>
          remove
        </button>
        }
        <p>{userActions.name.join(', ')}</p>
      </li>
    )
  })

  let enemyClassName = ['enemy-card']

  if (data.destroyed) {
    enemyClassName.push('-destroyed')
  }
  return (
    <div className={enemyClassName.join(' ')}>
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
