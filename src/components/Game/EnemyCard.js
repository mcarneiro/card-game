import {useContext} from 'react'
import './EnemyCard.css'
import GameContext from '../../context/GameContext'

const EnemyCard = ({data}) => {
  let {userData, gameState, gameDispatcher} = useContext(GameContext)
  const [character] = gameState.characterList.filter((character) => character.name === userData.userName)

  const handleResistanceClick = (resistance, amountSelected) => e => {
    gameDispatcher({
      type: 'ASSIGN',
      payload: {
        userName: userData.userName,
        ...resistance,
        amountSelected,
        enemyID: data.enemyID
      }
    })
  }

  const handleRemoveResistanceClick = ({resistanceID}) => e => {
    e.stopPropagation()
    gameDispatcher({
      type: 'UNASSIGN',
      payload: {
        userName: userData.userName,
        resistanceID,
        enemyID: data.enemyID
      }
    })
  }

  const handleRemoveEnemyClick = e => {
    e.stopPropagation()
    gameDispatcher({
      type: 'UNASSIGN',
      payload: {
        userName: userData.userName,
        enemyID: data.enemyID
      }
    })
  }


  let blockedUsers = Object.keys(gameState.roundData)
    .filter(name => {
        let selectedResistance = data.resistance.filter(({resistanceID}) => gameState.roundData[name].resistanceID.indexOf(resistanceID) >= 0).length > 0
        let selectedEnemy = gameState.roundData[name].enemyID.indexOf(data.enemyID) >= 0

        return selectedEnemy && !selectedResistance
    })

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

      if (userActions.amount >= val.amount || character.skill.indexOf(val.label) < 0) {
        itemClassName.push('-cant-add')
      }

      let printRemoveButton = userActions.name.indexOf(userData.userName) >= 0 && !gameState.readyForNextRound


    return (
      <li key={val.resistanceID} className={itemClassName.join(' ')} onClick={val.destroyed || gameState.status === 'end' ? null : handleResistanceClick(val, userActions.amount)}>
        <img alt={val.label} src={val.url} />
        <strong>{val.amount}</strong><br />
        <em>{userActions.amount}</em> <br />
        {printRemoveButton &&
        <button onClick={gameState.status === 'end' ? null : handleRemoveResistanceClick(val)}>
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

  if (blockedUsers.indexOf(userData.userName) >= 0) {
    enemyClassName.push('-blocked')
  }

  if (data.characterList.indexOf(userData.userName) < 0) {
    enemyClassName.push('-needs-knowledge')
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
      {blockedUsers.length > 0 &&
      <p>
        Waiting list: {blockedUsers.join(', ')}
        {gameState.status !== 'end' && blockedUsers.indexOf(userData.userName) >= 0 &&
        <button onClick={handleRemoveEnemyClick}>
          remove
        </button>
        }
      </p>
      }
    </div>
  )
}

export default EnemyCard
