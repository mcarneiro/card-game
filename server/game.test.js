const {gameSetupBy} = require('./game')

test('setup with more tasks then cards will reuse multiplier list', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{}],
    "eventList": [{}],
    "enemyList": [{
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        },{
          "label": 'r2',
          "amount": 5
        },{
          "label": 'r3',
          "amount": -1
        },{
          "label": 'r4',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 1, 2 ]
  })

  const game = gameSetup(userList)
  const resistanceAmounts = game.enemyList[0].resistance.map(val => val.amount)
  expect(resistanceAmounts).toContain(1)
  expect(resistanceAmounts).toContain(2)
  expect(resistanceAmounts).toContain(5)

  expect(game.characterList[0].characterID).not.toBeNull()
  expect(game.enemyList[0].enemyID).not.toBeNull()
  expect(game.enemyList[0].resistance[0].resistanceID).not.toBeNull()
})
