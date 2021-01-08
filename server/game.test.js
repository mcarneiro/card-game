const deepmerge = require('deepmerge')
const {gameSetupBy, newRound} = require('./game')
const {clone} = require('./utils')

const mock = {
  core: {
    characterList: [],
    eventList: [],
    enemyList: [],
    multiplierList: [ 1 ]
  },
  user: {userName: 'a'},
  character: {
    canDestroy: 2,
    skill: [ 'plus', 'star'],
    toToken: 1
  },
  resistance: {
    label: 'r1',
    amount: -1
  },
  enemy: {
    rounds: {
      amount: 1
    },
    resistance: []
  },
  event: {
    cancelable: true,
    effect: {
      type: '',
      data: {}
    }
  }
}

test('setup with more tasks then cards will reuse multiplier list', () => {
  const userList = [{userName: 'a'}]
  const setupData = {
    ...clone(mock.core),
    enemyList: [{
      ...clone(mock.enemy),
      resistance: [
        clone(mock.resistance),
        {...clone(mock.resistance), label: 'r2', amount: 5},
        {...clone(mock.resistance), label: 'r3'},
        {...clone(mock.resistance), label: 'r4'}
      ]
    }],
    multiplierList: [ 1, 2 ]
  }
  const gameSetup = gameSetupBy(setupData)

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
  const setupData = {
    ...clone(mock.core),
    enemyList: [
      {
        ...clone(mock.enemy),
        resistance: [
          clone(mock.resistance)
        ]
      }
    ]
  }
  const gameSetup = gameSetupBy(setupData)
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
  const setupData = {
    ...clone(mock.core),
    enemyList: [{
      ...clone(mock.enemy),
      resistance: [
        clone(mock.resistance)
      ]
    }]
  }
  const gameSetup = gameSetupBy(setupData)
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
  const setupData = {
    ...clone(mock.core),
    enemyList: [{
      ...clone(mock.enemy),
      resistance: [clone(mock.resistance)]
    }],
    multiplierList: [ 2 ]
  }
  const gameSetup = gameSetupBy(setupData)
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
  const testEnemy = {
    ...clone(mock.enemy),
    rounds: { amount: 10 },
    resistance: [
      { ...clone(mock.resistance), amount: 2 }
    ]
  }
  const testEvent = (amount) => deepmerge(clone(mock.event), {
    effect: {
      type: 'resistance',
      data: {
        resistance: [
          { ...clone(mock.resistance), amount }
        ]
      }
    }
  })
  const setupData = {
    ...clone(mock.core),
    characterList: [
      clone(mock.character)
    ],
    enemyList: [
      clone(testEnemy),
      clone(testEnemy)
    ],
    eventList: [
      testEvent(1),
      testEvent(2),
      testEvent(3)
    ]
  }
  const gameSetup = gameSetupBy(setupData)

  let round = gameSetup(userList)

  expect(round.eventList.map(event => event.effect.data.resistance[0].amount).join(',')).not.toBe('1,2,3')
  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0]).not.toBe(2)
})

test('when there are no more events they will restart', () => {
  const userList = [{userName: 'a'}]
  const setupData = deepmerge(clone(mock.core), {
    characterList: [
      clone(mock.character)
    ],
    eventList: [
      deepmerge(mock.event, {
        canceable: true
      }),
      deepmerge(mock.event, {
        canceable: true
      })
    ],
    enemyList: [
      deepmerge(mock.enemy, {
        rounds: {amount: 10},
        resistance: [
          {
            amount: 2
          }
        ]
      })
    ],
    multiplierList: [ 2 ]
  })
  const gameSetup = gameSetupBy(setupData)

  let round = gameSetup(userList)
  round = newRound(round)
  expect(round.eventIndex).toBe(1)
  round = newRound(round)
  round = newRound(round)
  expect(round.eventIndex).toBe(0)

})

test('new event (use token)', () => {
  const userList = [{userName: 'a'}]
  const setupData = {
    ...clone(mock.core),
    characterList: [clone(mock.character)],
    eventList: [
      clone(mock.event)
    ],
    enemyList: [
      deepmerge(clone(mock.enemy), {
        rounds: {
          amount: 10
        },
        resistance: [clone(mock.resistance)]
      })
    ],
    multiplierList: [2]
  }
  const gameSetup = gameSetupBy(setupData)
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

const mockTypeResistance = (amount, label = mock.resistance.label) => ({
  ...clone(mock.core),
  characterList: [clone(mock.character)],
  eventList: [
    deepmerge(clone(mock.event), {
      effect: {
        type: 'resistance',
        data: {
          resistance: [
            {...clone(mock.resistance), label, amount}
          ]
        }
      }
    })
  ],
  enemyList: [
    deepmerge(clone(mock.enemy), {
      resistance: [clone(mock.resistance)]
    })
  ],
  multiplierList: [2]
})
test('new event (type resistance positive)', () => {
  const userList = [{userName: 'a'}]
  const setupData = mockTypeResistance(2)
  const gameSetup = gameSetupBy(setupData)
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0].amount).toBe(4)
})

test('new event (type resistance negative)', () => {
  const userList = [{userName: 'a'}]
  const setupData = mockTypeResistance(-2)
  const gameSetup = gameSetupBy(setupData)
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance[0].amount).toBe(0)
  expect(round.enemyList[0].resistance[0].destroyed).toBe(true)
  expect(round.enemyList[0].destroyed).toBe(true)
})

test('new event (type nonexistent resistance positive)', () => {
  const userList = [{userName: 'a'}]
  const setupData = mockTypeResistance(2, 'r2')
  const gameSetup = gameSetupBy(setupData)
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance.length).toBe(2)
})

test('new event (type nonexistent resistance negative)', () => {
  const userList = [{userName: 'a'}]
  const setupData = mockTypeResistance(-2, 'r2')
  const gameSetup = gameSetupBy(setupData)
  let round = gameSetup(userList)

  round = newRound(round)
  round = newRound(round)

  expect(round.enemyList[0].resistance.length).toBe(1)
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
