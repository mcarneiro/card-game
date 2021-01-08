const {gameSetupBy, newRound} = require('./game')

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

test('user is added to character list of an enemy', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{}],
    "eventList": [{}],
    "enemyList": [{
      "rounds": {
        "amount": 1
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 1 ]
  })
  const game = gameSetup(userList)
  const {enemyID} = game.enemyList[0]

  game.roundData = {
    "a": {
      "resistanceID": [],
      "enemyID": [enemyID]
    }
  }

  const round = newRound(game)

  expect(round.enemyList[0].characterList[0]).toBe('a')
})

test('game over - all enemies destroyed', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{}],
    "eventList": [{}],
    "enemyList": [{
      "rounds": {
        "amount": 1
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 1 ]
  })
  const game = gameSetup(userList)
  const {resistanceID} = game.enemyList[0].resistance[0]

  game.roundData = {
    "a": {
      "resistanceID": [resistanceID],
      "enemyID": []
    }
  }

  const round = newRound(game)
  expect(round.status).toBe('end')
  expect(round.statusMessage).toBe('win')
})

test('game over - time is up', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{}],
    "eventList": [{}],
    "enemyList": [{
      "rounds": {
        "amount": 1
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 2 ]
  })
  const game = gameSetup(userList)
  const resistanceID = game.enemyList[0].resistance[0].resistanceID

  game.roundData = {
    "a": {
      "resistanceID": [resistanceID],
      "enemyID": []
    }
  }

  const round = newRound(game)
  expect(round.status).toBe('end')
  expect(round.statusMessage).toBe('time is up')

})

test('events are shuffled, applied', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{
      "skill": [ "plus", "star"],
      "toToken": 1
    }],
    "eventList": [
      {
        "cancelable": true,
        "effect": {
          "type": "resistance",
          "data": {
            "resistance": [
              {
                "label": "r1",
                "amount": 1
              }
            ]
          }
        }
      },
      {
        "cancelable": true,
        "effect": {
          "type": "resistance",
          "data": {
            "resistance": [
              {
                "label": "r1",
                "amount": 2
              }
            ]
          }
        }
      },
      {
        "cancelable": true,
        "effect": {
          "type": "resistance",
          "data": {
            "resistance": [
              {
                "label": "r1",
                "amount": 3
              }
            ]
          }
        }
      }
    ],
    "enemyList": [{
      "rounds": {
        "amount": 10
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": 2
        }
      ]
    },{
      "rounds": {
        "amount": 10
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": 2
        }
      ]
    }],
    "multiplierList": [ 2 ]
  })

  let round = gameSetup(userList)

  expect(round.eventList.map(event => event.effect.data.resistance[0].amount).join(',')).not.toBe('1,2,3')
  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0]).not.toBe(2)
})

test('when there are no more events they will restart', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{
      "skill": [ "plus", "star"],
      "toToken": 1
    }],
    "eventList": [
      {
        "cancelable": true,
        "effect": {"type": ""}
      },
      {
        "cancelable": true,
        "effect": {"type": ""}
      }
    ],
    "enemyList": [{
      "rounds": {
        "amount": 10
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": 2
        }
      ]
    }],
    "multiplierList": [ 2 ]
  })

  let round = gameSetup(userList)
  round = newRound(round)
  expect(round.eventIndex).toBe(1)
  round = newRound(round)
  round = newRound(round)
  expect(round.eventIndex).toBe(0)

})

test('new event (use token)', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [
      {
        "skill": [ "plus", "star"],
        "toToken": 1
      }
    ],
    "eventList": [
      {
      "cancelable": true,
      }
    ],
    "enemyList": [{
      "rounds": {
        "amount": 10
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 2 ]
  })
  let round = gameSetup(userList)

  round.roundData = {
    "a": {
      "resistanceID": [],
      "enemyID": [],
      "getToken": true
    }
  }

  round = newRound(round)

  round.roundData = {
    "a": {
      "resistanceID": [],
      "enemyID": [],
      "useToken": true
    }
  }

  round = newRound(round)

  expect(round.event).toBeNull()
  expect(round.enemyList[0].resistance[0].amount).toBe(2)
})

test('new event (type resistance positive)', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [{
      "skill": [ "plus", "star"],
      "toToken": 1
    }],
    "eventList": [
      {
        "cancelable": true,
        "effect": {
          "type": "resistance",
          "data": {
            "resistance": [
              {
                "label": "r1",
                "amount": 2
              }
            ]
          }
        }
      }
    ],
    "enemyList": [{
      "rounds": {
        "amount": 10
      },
      "resistance": [
        {
          "label": 'r1',
          "amount": -1
        }
      ]
    }],
    "multiplierList": [ 2 ]
  })
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0].amount).toBe(4)
})

test('new event (type resistance negative)', () => {
  const userList = [{userName: 'a'}]
  const gameSetup = gameSetupBy({
    "characterList": [
      {
        "skill": [ "plus", "star"],
        "toToken": 1
      }
    ],
    "eventList": [
      {
        "cancelable": true,
        "effect": {
          "type": "resistance",
          "data": {
            "resistance": [
              {
                "label": "r1",
                "amount": -2
              }
            ]
          }
        }
      }
    ],
    "enemyList": [
      {
        "rounds": {
          "amount": 10
        },
        "resistance": [
          {
            "label": 'r1',
            "amount": -1
          }
        ]
      }
    ],
    "multiplierList": [ 2 ]
  })
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0].amount).toBe(0)
  expect(round.enemyList[0].resistance[0].destroyed).toBe(true)
  expect(round.enemyList[0].destroyed).toBe(true)
})

test('new event (type block)', () => {
})
test('new event (type new enemy)', () => {
})


// "effect": {
//   "type": "enemy",
//   "cancelable": false,
//   "data": {
//     "resistance": [
//       {
//         "label": "circle",
//         "amount": 2
//       }, {
//         "label": "drop",
//         "amount": 2
//       }
//     ],
//     "rounds": 6
//   }


// {
//   "effect": {
//     "type": "resistance",
//     "cancelable": true,
//     "data": {
//       "resistance": [
//         {
//           "label": "plus",
//           "amount": 2
//         }
//       ]
//     }
//   }
// }
