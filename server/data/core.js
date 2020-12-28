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
      "rounds": 5,
      "resistance": [ "plus" ]
    }, {
      "label": "RedBird",
      "description": "Automatização de comunicação de eventos.",
      "icon": "",
      "rounds": 4,
      "resistance": [ "star" ]
    }, {
      "label": "Guinness",
      "description": "Projeto com foco em geração de leads.",
      "icon": "",
      "rounds": 8,
      "resistance": [ "plus", "star" ]
    }
  ],
  "skillList": [
    {
      "label": "plus",
      "icon": "plus"
    }, {
      "label": "star",
      "icon": "star"
    }, {
      "label": "circle",
      "icon": "circle"
    }, {
      "label": "drop",
      "icon": "drop"
    }
  ],
  "eventList": [
    {
      "label": "Feriado prolongado!",
      "description": "Cliente não responde e o time não consegue continuar.",
      "icon": "worst",
      "effect": {
        "type": "block",
        "cancelable": true,
        "data": {
          "rounds": 2
        }
      }
    }, {
      "label": "Incomunicável!",
      "description": "Cliente não responde e o time não consegue continuar.",
      "icon": "worst",
      "effect": {
        "type": "block",
        "cancelable": true,
        "data": {
          "rounds": 1
        }
      }
    }, {
      "label": "Bloqueio!",
      "description": "Muitas informações ainda faltam e o time não consegue continuar.",
      "icon": "worst",
      "effect": {
        "type": "block",
        "cancelable": true,
        "data": {
          "rounds": 1
        }
      }
    }, {
      "label": "Atropelado!",
      "description": "Uma demanda chegou rasgando! Utilize essa carta como projeto.<br/><i>(Token não tem efeito).</i>",
      "icon": "worst",
      "effect": {
        "type": "enemy",
        "cancelable": false,
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
      "effect": {
        "type": "enemy",
        "cancelable": false,
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
      "effect": {
        "type": "rounds",
        "cancelable": true,
        "data": {
          "rounds": -1
        }
      }
    }, {
      "label": "Telefone sem fio!",
      "description": "O trabalho precisará ser refeito por problema de entendimento.",
      "icon": "very-bad",
      "effect": {
        "type": "resistance",
        "cancelable": true,
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
      "effect": {
        "type": "resistance",
        "cancelable": false,
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
      "effect": {
        "type": "resistance",
        "cancelable": false,
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
      "effect": {
        "type": "resistance",
        "cancelable": false,
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
      "url": ""
    }, {
      "label": "good",
      "url": ""
    }, {
      "label": "bad",
      "url": ""
    }, {
      "label": "very-bad",
      "url": ""
    }, {
      "label": "worst",
      "url": ""
    },    {
      "label": "plus",
      "url": ""
    }, {
      "label": "star",
      "url": ""
    }, {
      "label": "circle",
      "url": ""
    }, {
      "label": "drop",
      "url": ""
    }
  ]
}
