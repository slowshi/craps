export type Dice6 = 1 | 2 | 3 | 4 | 5 | 6
export type DiceRoll = [Dice6, Dice6]
export type CapsPoints = 4 | 5 | 6 | 8 | 9 | 10 | 0
export const validPoints = [4, 5, 6, 8, 9, 10]
export const anyCraps = [2, 3, 12]
export const diceValues: { [roll: number]: DiceRoll[] } = {
  2: [[1, 1]],
  3: [[2, 1]],
  4: [
    [2, 2],
    [3, 1],
  ],
  5: [
    [4, 1],
    [3, 2],
  ],
  6: [
    [5, 1],
    [4, 2],
    [3, 3],
  ],
  7: [
    [6, 1],
    [5, 2],
    [4, 3],
  ],
  8: [
    [6, 2],
    [5, 3],
    [4, 4],
  ],
  9: [
    [6, 3],
    [5, 4],
  ],
  10: [
    [6, 4],
    [5, 5],
  ],
  11: [[6, 5]],
  12: [[6, 6]],
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
export interface IBaseBet {
  amount: number
  odds: number
  working: boolean
  vig: number
}

export interface IBetMap {
  linePassLine: IBaseBet
  linePassLine4: IBaseBet
  linePassLine5: IBaseBet
  linePassLine6: IBaseBet
  linePassLine8: IBaseBet
  linePassLine9: IBaseBet
  linePassLine10: IBaseBet
  lineDontPassLine: IBaseBet
  lineDontPassLine4: IBaseBet
  lineDontPassLine5: IBaseBet
  lineDontPassLine6: IBaseBet
  lineDontPassLine8: IBaseBet
  lineDontPassLine9: IBaseBet
  lineDontPassLine10: IBaseBet
  lineComeLine: IBaseBet
  lineComeLine4: IBaseBet
  lineComeLine5: IBaseBet
  lineComeLine6: IBaseBet
  lineComeLine8: IBaseBet
  lineComeLine9: IBaseBet
  lineComeLine10: IBaseBet
  lineDontComeLine: IBaseBet
  lineDontComeLine4: IBaseBet
  lineDontComeLine5: IBaseBet
  lineDontComeLine6: IBaseBet
  lineDontComeLine8: IBaseBet
  lineDontComeLine9: IBaseBet
  lineDontComeLine10: IBaseBet
  centerField: IBaseBet
  centerAnyCraps: IBaseBet
  centerAny7: IBaseBet
  centerHorn: IBaseBet
  centerHop: IBaseBet
  centerHard4: IBaseBet
  centerHard6: IBaseBet
  centerHard8: IBaseBet
  centerHard10: IBaseBet
  numbersPlace4: IBaseBet
  numbersPlace5: IBaseBet
  numbersPlace6: IBaseBet
  numbersPlace8: IBaseBet
  numbersPlace9: IBaseBet
  numbersPlace10: IBaseBet
  numbersBuy4: IBaseBet
  numbersBuy5: IBaseBet
  numbersBuy6: IBaseBet
  numbersBuy8: IBaseBet
  numbersBuy9: IBaseBet
  numbersBuy10: IBaseBet
  numbersLay4: IBaseBet
  numbersLay5: IBaseBet
  numbersLay6: IBaseBet
  numbersLay8: IBaseBet
  numbersLay9: IBaseBet
  numbersLay10: IBaseBet
}
// type LineBetKeys =
//   | 'linePassLine'
//   | 'linePassLine4'
//   | 'linePassLine5'
//   | 'linePassLine6'
//   | 'linePassLine8'
//   | 'linePassLine9'
//   | 'linePassLine10'
//   | 'lineDontPassLine'
//   | 'lineDontPassLine4'
//   | 'lineDontPassLine5'
//   | 'lineDontPassLine6'
//   | 'lineDontPassLine8'
//   | 'lineDontPassLine9'
//   | 'lineDontPassLine10'
//   | 'lineComeLine'
//   | 'lineComeLine4'
//   | 'lineComeLine5'
//   | 'lineComeLine6'
//   | 'lineComeLine8'
//   | 'lineComeLine9'
//   | 'lineComeLine10'
//   | 'lineDontComeLine'
//   | 'lineDontComeLine4'
//   | 'lineDontComeLine5'
//   | 'lineDontComeLine6'
//   | 'lineDontComeLine8'
//   | 'lineDontComeLine9'
//   | 'lineDontComeLine10'
type LineKey = 'linePassLine' | 'lineDontPassLine' | 'lineComeLine' | 'lineDontComeLine'
export const lineRolls = ['linePassLine', 'lineDontPassLine', 'lineComeLine', 'lineDontComeLine']
export const baseBetDefaults: IBaseBet = {
  amount: 0,
  odds: 0,
  working: false,
  vig: 0,
}
// --------------------------------- Dice ---------------------------------
export interface DiceState {
  dice: DiceRoll
  pointValue: number
}

export const rollDice = (): DiceRoll => {
  const randomRoll = () => Math.floor(Math.random() * 6) + 1
  const die1 = randomRoll() as Dice6
  const die2 = randomRoll() as Dice6
  return [die1, die2]
}

export const sortRollValues = (diceRoll: DiceRoll): DiceRoll => {
  const die1 = diceRoll[0]
  const die2 = diceRoll[1]
  if (die1 < die2) {
    return [die2, die1]
  } else {
    return diceRoll
  }
}

export const getRollValue = (roll: DiceRoll): number => {
  return roll[0] + roll[1]
}

export const isValidPoint = (roll: DiceRoll, points = validPoints): boolean => {
  return points.indexOf(getRollValue(roll)) > -1
}

export const getRolls = (rollValues: number[], excluded: DiceRoll[] = []): DiceRoll[] => {
  const allRolls = rollValues.reduce((acc, value) => {
    return [...acc, ...diceValues[value]]
  }, [] as DiceRoll[])
  const cleanedExcluded = excluded.map((roll) => sortRollValues(roll).toString())
  return allRolls.filter((roll) => cleanedExcluded.indexOf(roll.toString()) == -1)
}
// --------------------------------- Betting ---------------------------------
export const updateBetMap = (betMap: Partial<IBetMap>, betKey: keyof IBetMap, bet: IBaseBet): Partial<IBetMap> => {
  return {
    ...betMap,
    [betKey]: bet,
  }
}

export const moveLineBet = (betMap: Partial<IBetMap>, lineKey: LineKey, pointValue: number): Partial<IBetMap> => {
  if ((lineKey === 'lineDontPassLine' || lineKey === 'lineDontComeLine') && pointValue === 12) {
    return betMap
  }
  const currentBet = betMap[lineKey]
  if (currentBet) {
    const newBetMap = updateBetMap(betMap, `${lineKey}${pointValue}` as keyof IBetMap, currentBet)
    delete newBetMap[lineKey]
    return newBetMap
  }
  return betMap
}
export const isValidBet = (
  betMap: Partial<IBetMap>,
  betKey: string,
  bet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  const currentBet = betMap[betKey as keyof IBetMap]
  if (!currentBet && bet.odds) {
    //cant make odds bets without amount
    return false
  }
  if (bet.odds && pointValue === 0) {
    //cant make odds bets without valid point
    return false
  }
  if ((betKey.includes('linePassLine') || betKey.includes('lineDontPassLine')) && pointValue > 0) {
    //line bets with odds ok
    if (bet.odds) {
      return true
    }
    //cant make line bets with valid point
    return false
  }
  return true
}
// --------------------------------- Bet Types ---------------------------------
export interface IBetResolves {
  rolls: DiceRoll[]
  pay: number
}
export const getBetPayByRoll = (roll: DiceRoll, resolves: IBetResolves[]): number => {
  const resolve = resolves.filter((resolveBet) => {
    const sortedDiceRoll = sortRollValues(roll)
    return resolveBet.rolls.find((diceRoll) => {
      return sortedDiceRoll[0] === diceRoll[0] && sortedDiceRoll[1] === diceRoll[1]
    })
  })
  if (resolve.length > 0) {
    return resolve[0].pay
  }
  return 0
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
export const isEmptyBet = (bet: IBaseBet): boolean => {
  return bet.amount === 0 && bet.odds === 0
}
// export const hasRollValue(roll: DiceRoll, rolls[])
// --------------------------------- Resolve Game ---------------------------------
export const resolveMakeBet = (
  betMap: Partial<IBetMap>,
  betKey: keyof IBetMap,
  bet: Partial<IBaseBet>,
): Partial<IBetMap> => {
  const currentBet = betMap[betKey]
  let newBetMap = { ...betMap }
  if (currentBet) {
    const betAmount = bet.amount ? bet.amount : 0
    const betOdds = bet.odds ? bet.odds : 0
    const betVig = bet.vig ? bet.vig : 0
    const betWorking = bet.working ? bet.working : currentBet.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(currentBet.amount + betAmount, 0),
      odds: Math.max(currentBet.odds + betOdds, 0),
      vig: Math.max(currentBet.vig + betVig, 0),
    }
    if (isEmptyBet(newBet)) {
      delete newBetMap[betKey]
    } else {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  } else {
    const betAmount = bet.amount ? bet.amount : baseBetDefaults.amount
    const betOdds = bet.odds ? bet.odds : baseBetDefaults.odds
    const betVig = bet.vig ? bet.vig : baseBetDefaults.vig
    const betWorking = bet.working ? bet.working : baseBetDefaults.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(betAmount, 0),
      odds: Math.max(betOdds, 0),
      vig: Math.max(betVig, 0),
    }
    if (!isEmptyBet(newBet)) {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  }
  return newBetMap
}
export interface BetResolution {
  betMap: Partial<IBetMap>
  payouts: IBaseBet[]
}
export const resolveBets = (betMap: Partial<IBetMap>, roll: DiceRoll, pointValue: number): BetResolution => {
  const rollValue = getRollValue(roll)
  const payouts: IBaseBet[] = []
  let newBetMap = { ...betMap }
  const betTypes: (keyof IBetMap)[] = Object.keys(newBetMap) as (keyof IBetMap)[]
  const comeLines = []

  const resolveByType = (type: keyof IBetMap) => {
    const bet = newBetMap[type]
    if (bet) {
      const resolves = betResolvesMap[type]
      const result = getBetPayByRoll(roll, resolves)
      let odds = 0
      if (result !== 0) {
        if (type.includes('lineComeLine')) {
          if (pointValue === 0 && result < 0 && !bet.working) {
            odds = bet.odds
          } else if (pointValue > 0 && result > 0) {
            odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
          }
        }
        if ((type.includes('lineDontPassLine') || type.includes('lineDontComeLine')) && result > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * dontLineBetOdds[pointValue])
        }
        if (type.includes('linePassLine') && result > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
        }
        payouts.push({
          ...bet,
          amount: bet.amount + bet.amount * result,
          odds,
        })
        delete newBetMap[type]
      } else {
        if (lineRolls.indexOf(type) > -1) {
          newBetMap = moveLineBet(betMap, type as LineKey, rollValue)
        }
      }
    }
  }

  for (let i = 0; i < betTypes.length; i++) {
    const type = betTypes[i]
    if (type === 'lineComeLine') {
      comeLines.push(type)
      continue
    }
    resolveByType(type)
  }

  for (let i = 0; i < comeLines.length; i++) {
    const type = betTypes[i]
    resolveByType(type)
  }

  return { betMap: newBetMap, payouts }
}

export const resolvePointValue = (roll: DiceRoll, pointValue: number): DiceState => {
  const rollValue = getRollValue(roll)
  let newPointValue = pointValue
  if (pointValue === 0 && isValidPoint(roll)) {
    newPointValue = rollValue
  } else if (pointValue !== 0 && getRollValue(roll) === 7) {
    newPointValue = 0
  } else if (pointValue !== 0 && getRollValue(roll) === pointValue) {
    newPointValue = 0
  }
  return {
    pointValue: newPointValue,
    dice: roll,
  }
}
