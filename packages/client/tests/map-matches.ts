// prettier-ignore
export default [
  {
    "description": "Norte Sul Leste Oeste",
    "heuristic": "Manhattan",
    "diagonals": false,
    "start": [0, 2],
    "end"  : [4, 2],
    "map"  : [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    "spec": [
      [
        ". * * * *",
        ". * # . *",
        "o * # . x",
        ". . # . .",
        ". . . . ."
      ],
      [
        ". . . . .",
        ". . # . .",
        "o * # . x",
        ". * # . *",
        ". * * * *"
      ]
    ]
  },
  {
    "description": "Diagonais",
    "heuristic": "Manhattan",
    "diagonals": true,
    "start": [0, 2],
    "end"  : [4, 2],
    "map"  : [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1]
    ],
    "spec": [
      [
        ". * * * *",
        ". * # . *",
        "o * # . x",
        ". . # . .",
        ". . . . ."
      ],
      [
        ". . . . .",
        ". . # . .",
        "o * # . x",
        ". * # . *",
        ". * * * *"
      ]
    ]
  }
]
