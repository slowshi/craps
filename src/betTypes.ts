import { DiceRoll, getRolls } from './dice'
export interface IBetResolves {
  rolls: DiceRoll[]
  pay: number
}

export const passLineBet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 11]),
    pay: 1,
  },
  {
    rolls: getRolls([2, 3, 12]),
    pay: -1,
  },
]

export const passLinePoint = (pointValue: number): IBetResolves[] => [
  {
    rolls: getRolls([pointValue]),
    pay: 1,
  },
  {
    rolls: getRolls([7]),
    pay: -1,
  },
]

export const dontPassLineBet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 11]),
    pay: -1,
  },
  {
    rolls: getRolls([2, 3]),
    pay: 1,
  },
  {
    rolls: getRolls([12]),
    pay: 0,
  },
]

export const dontPassLinePoint = (pointValue: number): IBetResolves[] => [
  {
    rolls: getRolls([pointValue]),
    pay: -1,
  },
  {
    rolls: getRolls([7]),
    pay: 1,
  },
]
export const centerFieldBet = (): IBetResolves[] => [
  {
    rolls: getRolls([5, 6, 7, 8]),
    pay: -1,
  },
  {
    rolls: getRolls([3, 4, 9, 10, 11]),
    pay: 1,
  },
  {
    rolls: getRolls([2]),
    pay: 2,
  },
  {
    rolls: getRolls([12]),
    pay: 3,
  },
]
export const centerAnyCrapsBet = (): IBetResolves[] => [
  {
    rolls: getRolls([4, 5, 6, 7, 8, 9, 10, 11]),
    pay: -1,
  },
  {
    rolls: getRolls([3, 2, 12]),
    pay: 7,
  },
]
export const centerHard6Bet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 6], [[3, 3]]),
    pay: -1,
  },
  {
    rolls: getRolls(
      [6],
      [
        [2, 4],
        [1, 5],
      ],
    ),
    pay: 7,
  },
]
export const centerHard8Bet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 8], [[4, 4]]),
    pay: -1,
  },
  {
    rolls: getRolls(
      [8],
      [
        [6, 2],
        [5, 3],
      ],
    ),
    pay: 7,
  },
]
export const centerHard4Bet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 4], [[2, 2]]),
    pay: -1,
  },
  {
    rolls: getRolls([4], [[1, 4]]),
    pay: 9,
  },
]
export const centerHard10Bet = (): IBetResolves[] => [
  {
    rolls: getRolls([7, 10], [[5, 5]]),
    pay: -1,
  },
  {
    rolls: getRolls([10], [[6, 4]]),
    pay: 9,
  },
]
export const betResolvesMap: { [key: string]: IBetResolves[] } = {
  linePassLine: passLineBet(),
  linePassLine4: passLinePoint(4),
  linePassLine5: passLinePoint(5),
  linePassLine6: passLinePoint(6),
  linePassLine8: passLinePoint(8),
  linePassLine9: passLinePoint(9),
  linePassLine10: passLinePoint(10),
  lineDontPassLine: dontPassLineBet(),
  lineDontPassLine4: dontPassLinePoint(4),
  lineDontPassLine5: dontPassLinePoint(5),
  lineDontPassLine6: dontPassLinePoint(6),
  lineDontPassLine8: dontPassLinePoint(8),
  lineDontPassLine9: dontPassLinePoint(9),
  lineDontPassLine10: dontPassLinePoint(10),
  lineComeLine: passLineBet(),
  lineComeLine4: passLinePoint(4),
  lineComeLine5: passLinePoint(5),
  lineComeLine6: passLinePoint(6),
  lineComeLine8: passLinePoint(8),
  lineComeLine9: passLinePoint(9),
  lineComeLine10: passLinePoint(10),
  lineDontComeLine: dontPassLineBet(),
  lineDontComeLine4: dontPassLinePoint(4),
  lineDontComeLine5: dontPassLinePoint(5),
  lineDontComeLine6: dontPassLinePoint(6),
  lineDontComeLine8: dontPassLinePoint(8),
  lineDontComeLine9: dontPassLinePoint(9),
  lineDontComeLine10: dontPassLinePoint(10),
  centerField: centerFieldBet(),
  centerAnyCraps: centerAnyCrapsBet(),
  centerHard6: centerHard6Bet(),
  centerHard8: centerHard8Bet(),
  centerHard4: centerHard4Bet(),
  centerHard10: centerHard10Bet(),
}
