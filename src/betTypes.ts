import { DiceRoll, diceValues, getRollValue, getRolls, sortRollValues } from './dice'

export const placeBetOdds: { [key: number]: number } = {
  4: 9 / 5,
  5: 7 / 5,
  6: 7 / 6,
  8: 7 / 6,
  9: 7 / 5,
  10: 9 / 5,
}

export const buyBetOdds: { [key: number]: number } = {
  4: 2 / 1,
  5: 3 / 2,
  6: 6 / 5,
  8: 6 / 5,
  9: 3 / 2,
  10: 2 / 1,
}

export const layBetOdds: { [key: number]: number } = {
  4: 1 / 2,
  5: 2 / 3,
  6: 5 / 6,
  8: 5 / 6,
  9: 2 / 3,
  10: 1 / 2,
}
export const lineBetOdds: { [key: number]: number } = {
  4: 6 / 3,
  5: 6 / 4,
  6: 6 / 5,
  8: 6 / 5,
  9: 6 / 4,
  10: 6 / 3,
}

export const dontLineBetOdds: { [key: number]: number } = {
  4: 1 / 2,
  5: 2 / 3,
  6: 5 / 6,
  8: 5 / 6,
  9: 2 / 3,
  10: 1 / 2,
}
export const hornBetPayouts: { [key: number]: number } = {
  2: 30 / 1,
  3: 15 / 1,
  11: 15 / 1,
  12: 30 / 1,
  7: 7 / 1,
}
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
export const numbersPlace = (value: number): IBetResolves[] => [
  {
    rolls: getRolls([7], []),
    pay: -1,
  },
  {
    rolls: getRolls([value], []),
    pay: placeBetOdds[value],
  },
]
export const numbersBuy = (value: number): IBetResolves[] => [
  {
    rolls: getRolls([7], []),
    pay: -1,
  },
  {
    rolls: getRolls([value], []),
    pay: buyBetOdds[value] * 0.95,
  },
]
export const numbersLay = (value: number): IBetResolves[] => [
  {
    rolls: getRolls([7], []),
    pay: layBetOdds[value],
  },
  {
    rolls: getRolls([value], []),
    pay: -1,
  },
]
export const centerHorn = (value: number): IBetResolves[] => [
  {
    rolls: getRolls(
      [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((val) => val !== value),
      [],
    ),
    pay: -1,
  },
  {
    rolls: getRolls([value], []),
    pay: hornBetPayouts[value],
  },
]
export const centerHop = (diceRoll: DiceRoll): IBetResolves[] => {
  const value = getRollValue(diceRoll)
  const combinations = getRolls([value], [diceRoll])
  return [
    {
      rolls: getRolls([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], [diceRoll]),
      pay: -1,
    },
    {
      rolls: getRolls([value], combinations),
      pay: 30,
    },
  ]
}
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
  center12: centerHorn(12),
  center11: centerHorn(11),
  center3: centerHorn(3),
  center2: centerHorn(2),
  center7: centerHorn(7),
  centerHop64: centerHop([6, 4]),
  centerHop63: centerHop([6, 3]),
  centerHop62: centerHop([6, 2]),
  centerHop61: centerHop([6, 1]),
  centerHop55: centerHop([5, 5]),
  centerHop54: centerHop([5, 4]),
  centerHop53: centerHop([5, 3]),
  centerHop52: centerHop([5, 2]),
  centerHop51: centerHop([5, 1]),
  centerHop44: centerHop([4, 4]),
  centerHop43: centerHop([4, 3]),
  centerHop42: centerHop([4, 2]),
  centerHop41: centerHop([4, 1]),
  centerHop33: centerHop([3, 3]),
  centerHop32: centerHop([3, 2]),
  centerHop31: centerHop([3, 1]),
  centerHop22: centerHop([2, 2]),
  numbersPlace4: numbersPlace(4),
  numbersPlace5: numbersPlace(5),
  numbersPlace6: numbersPlace(6),
  numbersPlace8: numbersPlace(8),
  numbersPlace9: numbersPlace(9),
  numbersPlace10: numbersPlace(10),
  numbersBuy4: numbersBuy(4),
  numbersBuy5: numbersBuy(5),
  numbersBuy6: numbersBuy(6),
  numbersBuy8: numbersBuy(8),
  numbersBuy9: numbersBuy(9),
  numbersBuy10: numbersBuy(10),
  numbersLay4: numbersLay(4),
  numbersLay5: numbersLay(5),
  numbersLay6: numbersLay(6),
  numbersLay8: numbersLay(8),
  numbersLay9: numbersLay(9),
  numbersLay10: numbersLay(10),
}
