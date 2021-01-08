module.exports = {
  "characterList": [
    {
      "skill": [ "plus", "star", "circle", "drop"],
      "canDestroy": 2,
      "toToken": 1
    },{
      "skill": [ "plus", "star"],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus", "circle" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus", "star", "drop" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus", "star", "circle" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus", "star" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "plus" ],
      "canDestroy": 1,
      "toToken": 0.5
    },{
      "skill": [ "drop", "star" ],
      "canDestroy": 1,
      "toToken": 0.5
    }
  ],
  "enemyList": [
    {
      "label": "Pepé",
      "description": "Projeto para divulgação de um novo produto.",
      "icon": "",
      "rounds": {
        "icon": "clock",
        "amount": 5
      },
      "resistance": [
        {
          "label": "plus",
          "amount": -1
        }
      ]
    }, {
      "label": "RedBird",
      "description": "Automatização de comunicação de eventos.",
      "icon": "",
      "rounds": {
        "icon": "clock",
        "amount": 4
      },
      "resistance": [
        {
          "label": "star",
          "amount": -1
        }
      ]
    }, {
      "label": "Guinness",
      "description": "Projeto com foco em geração de leads.",
      "icon": "",
      "rounds": {
        "icon": "clock",
        "amount": 8
      },
      "resistance": [
        {
          "label": "plus",
          "amount": -1
        }, {
          "label":  "star",
          "amount": -1
        }
      ]
    }
  ],
  "eventList": [
    {
      "label": "Feriado prolongado!",
      "description": "Cliente não responde e o time não consegue continuar.",
      "icon": "worst",
      "cancelable": true,
      "effect": {
        "type": "block",
        "data": {
          "rounds": 2
        }
      }
    }, {
      "label": "Incomunicável!",
      "description": "Cliente não responde e o time não consegue continuar.",
      "icon": "worst",
      "cancelable": true,
      "effect": {
        "type": "block",
        "data": {
          "rounds": 1
        }
      }
    }, {
      "label": "Bloqueio!",
      "description": "Muitas informações ainda faltam e o time não consegue continuar.",
      "icon": "worst",
      "cancelable": true,
      "effect": {
        "type": "block",
        "data": {
          "rounds": 1
        }
      }
    }, {
      "label": "Atropelado!",
      "description": "Uma demanda chegou rasgando! Utilize essa carta como projeto.<br/><i>(Token não tem efeito).</i>",
      "icon": "worst",
      "cancelable": false,
      "effect": {
        "type": "enemy",
        "data": {
          "resistance": [
            {
              "label": "circle",
              "amount": 2
            }, {
              "label": "drop",
              "amount": 2
            }
          ],
          "rounds": 6
        }
      }
    }, {
      "label": "Pastelaria!",
      "description": "Apareceu uma demanda urgente! Utilize essa carta como projeto.<br/><i>(Token não tem efeito).</i>",
      "icon": "worst",
      "cancelable": false,
      "effect": {
        "type": "enemy",
        "data": {
          "resistance": [
            {
              "label": "star",
              "amount": 2
            }, {
              "label": "plus",
              "amount": 1
            }
          ],
          "rounds": 4
        }
      }
    }, {
      "label": "Feriado!",
      "description": "Ninguém percebeu que tinha um feriado no meio.",
      "icon": "worst",
      "cancelable": false,
      "effect": {
        "type": "block",
        "data": {
          "rounds": 1
        }
      }
    }, {
      "label": "Telefone sem fio!",
      "description": "O trabalho precisará ser refeito por problema de entendimento.",
      "icon": "very-bad",
      "cancelable": true,
      "effect": {
        "type": "resistance",
        "data": {
          "resistance": [
            {
              "label": "plus",
              "amount": 2
            }
          ]
        }
      }
    }, {
      "label": "Subiu no telhado!",
      "description": "Aquela mecânica complicada caiu.",
      "icon": "good",
      "cancelable": false,
      "effect": {
        "type": "resistance",
        "data": {
          "resistance": [
            {
              "label": "circle",
              "amount": -1
            }, {
              "label": "star",
              "amount": -1
            }, {
              "label": "plus",
              "amount": -1
            }
          ]
        }
      }
    }, {
      "label": "Consciência!",
      "description": "Cliente foi convencido de derrubar módulo irrelevante.",
      "icon": "good",
      "cancelable": false,
      "effect": {
        "type": "resistance",
        "data": {
          "resistance": [
            {
              "label": "plus",
              "amount": -1
            }
          ]
        }
      }
    }, {
      "label": "O time entregou o dobro do esperado!",
      "description": "Aquela mecânica complicada caiu.",
      "icon": "good",
      "cancelable": false,
      "effect": {
        "type": "resistance",
        "data": {
          "multiplier": 2
        }
      }
    }
  ],
  "multiplierList": [ 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 7, 7, 7 ],
  "iconList": [
    {
      "label": "very-good",
      "url": "/assets/images/very-good.svg"
    }, {
      "label": "good",
      "url": "/assets/images/good.svg"
    }, {
      "label": "bad",
      "url": "/assets/images/bad.svg"
    }, {
      "label": "very-bad",
      "url": "/assets/images/very-bad.svg"
    }, {
      "label": "worst",
      "url": "/assets/images/worst.svg"
    },    {
      "label": "plus",
      "url": "/assets/images/plus.svg"
    }, {
      "label": "star",
      "url": "/assets/images/star.svg"
    }, {
      "label": "circle",
      "url": "/assets/images/circle.svg"
    }, {
      "label": "drop",
      "url": "/assets/images/drop.svg"
    }, {
      "label": "clock",
      "url": "/assets/images/clock.svg"
    }
  ]
}
