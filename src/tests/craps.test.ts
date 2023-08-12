import {
  rollDice,
  getRollValue,
  DiceRoll,
  sortRollValues,
  isValidPoint,
  validPoints,
  getRolls,
  updateBetMap,
  IBetMap,
  IBaseBet,
  moveLineBet,
  baseBetDefaults,
  resolveMakeBet,
  resolvePointValue,
  resolveBets,
  getBetPayByRoll,
  passLineBet,
  isEmptyBet,
} from '../craps'
// import { expect, test, describe } from 'bun:test'

describe('rollDice', () => {
  test('should return a tuple with two values', () => {
    const result = rollDice()
    expect(result).toHaveLength(2)
  })

  test('each value in the tuple should be an integer between 1 and 6', () => {
    const result = rollDice()
    result.forEach((die) => {
      expect(die).toBeGreaterThanOrEqual(1)
      expect(die).toBeLessThanOrEqual(6)
      expect(Number.isInteger(die)).toBe(true)
    })
  })
})

describe('sortRollValues', () => {
  test('should sort dice roll values in non-ascending order', () => {
    // Test case 1: When the first die value is less than the second die value
    const diceRoll1: DiceRoll = [2, 5]
    const result1 = sortRollValues(diceRoll1)
    expect(result1).toEqual([5, 2])

    // Test case 2: When the first die value is greater than the second die value
    const diceRoll2: DiceRoll = [6, 3]
    const result2 = sortRollValues(diceRoll2)
    expect(result2).toEqual([6, 3])

    // Test case 3: When both die values are equal
    const diceRoll3: DiceRoll = [4, 4]
    const result3 = sortRollValues(diceRoll3)
    expect(result3).toEqual([4, 4])
  })
})

describe('getRollValue', () => {
  test('should correctly calculate the sum of two dice values', () => {
    // Test case 1: Dice values are 3 and 4
    const diceRoll1: DiceRoll = [3, 4]
    const result1 = getRollValue(diceRoll1)
    expect(result1).toEqual(7)

    // Test case 2: Dice values are 6 and 1
    const diceRoll2: DiceRoll = [6, 1]
    const result2 = getRollValue(diceRoll2)
    expect(result2).toEqual(7)

    // Test case 3: Dice values are 2 and 2
    const diceRoll3: DiceRoll = [2, 2]
    const result3 = getRollValue(diceRoll3)
    expect(result3).toEqual(4)
  })
})

describe('isValidPoint', () => {
  test('should return true for valid point values', () => {
    const diceRoll1: DiceRoll = [4, 2] // Sum: 6
    const result1 = isValidPoint(diceRoll1, validPoints)
    expect(result1).toBe(true)

    const diceRoll2: DiceRoll = [5, 5] // Sum: 10
    const result2 = isValidPoint(diceRoll2, validPoints)
    expect(result2).toBe(true)
  })

  test('should return false for invalid point values', () => {
    const diceRoll3: DiceRoll = [2, 1] // Sum: 5
    const result3 = isValidPoint(diceRoll3, validPoints)
    expect(result3).toBe(false)

    const diceRoll4: DiceRoll = [1, 1] // Sum: 2
    const result4 = isValidPoint(diceRoll4, validPoints)
    expect(result4).toBe(false)
  })

  test('should use provided points array when specified', () => {
    const customPoints = [3, 4, 5]
    const diceRoll5: DiceRoll = [2, 1] // Sum: 3
    const result5 = isValidPoint(diceRoll5, customPoints)
    expect(result5).toBe(true)

    const diceRoll6: DiceRoll = [6, 4] // Sum: 10
    const result6 = isValidPoint(diceRoll6, customPoints)
    expect(result6).toBe(false)
  })
})

describe('getRolls', () => {
  test('should correctly generate all possible rolls for the given roll values', () => {
    const rollValues = [3, 4]
    const result = getRolls(rollValues, [])
    expect(result).toEqual([
      [2, 1],
      [2, 2],
      [3, 1],
    ])
  })

  test('should correctly exclude specified dice rolls', () => {
    const rollValues = [3, 4]
    const excluded: DiceRoll[] = [
      [1, 2],
      [2, 2],
    ]
    const result = getRolls(rollValues, excluded)
    expect(result).toEqual([[3, 1]])
  })

  test('should return an empty array when all possible rolls are excluded', () => {
    const rollValues = [3]
    const excluded: DiceRoll[] = [
      [1, 2],
      [2, 1],
    ]
    const result = getRolls(rollValues, excluded)
    expect(result).toEqual([])
  })
})

describe('updateBetMap', () => {
  test('should correctly update the betMap with the provided bet', () => {
    const initialBet = {
      ...baseBetDefaults,
      amount: 10,
    }
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }

    // Define a new bet to be added
    const newBet: IBaseBet = {
      ...initialBet,
      odds: 20,
    }
    // Update the betMap using the updateBetMap function
    const result = updateBetMap(betMap, 'linePassLine', newBet)

    // Expected result after updating the betMap
    const expectedResult: Partial<IBetMap> = {
      linePassLine: { ...baseBetDefaults, amount: 10, odds: 20 },
    }

    expect(result).toEqual(expectedResult)
  })

  test('should correctly handle partial betMap objects', () => {
    // Define an empty partial betMap for testing
    const betMap: Partial<IBetMap> = {}

    // Define a new bet to be added
    const newBet: IBaseBet = {
      ...baseBetDefaults,
      amount: 30,
    }

    // Update the betMap using the updateBetMap function
    const result = updateBetMap(betMap, 'lineComeLine', newBet)

    // Expected result after updating the betMap
    const expectedResult: Partial<IBetMap> = {
      lineComeLine: newBet,
    }

    expect(result).toEqual(expectedResult)
  })
})

describe('moveLineBet', () => {
  // Define any common setup or variables here
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }

  test('should correctly move a pass bet to the number based on point value', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'linePassLine', 8)
    const expectedResult: Partial<IBetMap> = {
      linePassLine8: initialBet,
    }
    expect(result).toEqual(expectedResult)
  })

  test('should correctly move a dontPass bet to the number based on point value', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'lineDontPassLine', 8)
    const expectedResult: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    expect(result).toEqual(expectedResult)
  })
  test('should return same betMap if it key does not exist', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'linePassLine', 8)
    const expectedResult: Partial<IBetMap> = betMap
    expect(result).toEqual(expectedResult)
  })
})

describe('getBetPayByRoll', () => {
  test('should return a value 1 win', () => {
    const result = getBetPayByRoll([4, 3], passLineBet())

    expect(result).toEqual(1)
  })
  test('should return a value -1', () => {
    const result = getBetPayByRoll([1, 2], passLineBet())

    expect(result).toEqual(-1)
  })
  test('should return value 0 (no action)', () => {
    const result = getBetPayByRoll([4, 2], passLineBet())

    expect(result).toEqual(0)
  })
})

describe('isEmptyBet', () => {
  test('should be true if values are 0', () => {
    const bet = { ...baseBetDefaults }
    const result = isEmptyBet(bet)

    expect(result).toEqual(true)
  })
  test('should be false if values are not 0 ', () => {
    const bet = { ...baseBetDefaults, amount: 10 }
    const result = isEmptyBet(bet)

    expect(result).toEqual(false)
  })
})

describe('resolveMakeBet', () => {
  // Define any common setup or variables here
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  const betMap: Partial<IBetMap> = {
    numbersPlace6: initialBet,
  }
  test('should add to bet amount', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: 10 })

    expect(result).toEqual({
      numbersPlace6: { ...initialBet, amount: 20 },
    })
  })
  test('should subtract bet amount', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: -5 })

    expect(result).toEqual({
      numbersPlace6: { ...initialBet, amount: 5 },
    })
  })
  test('should remove bet if amount is default value', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: -20 })

    expect(result).toEqual({})
  })
})

describe('resolvePointValue', () => {
  test('Set valid point. pointValue = 0 && roll = validPoint', () => {
    const result = resolvePointValue([4, 2], 0)

    expect(result).toEqual({
      dice: [4, 2],
      pointValue: 6,
    })
  })

  test('Set 7 out. pointValue != 0 && roll = 7', () => {
    const result = resolvePointValue([4, 3], 6)

    expect(result).toEqual({
      dice: [4, 3],
      pointValue: 0,
    })
  })

  test('Set winner point. pointValue = roll && roll = validPoint', () => {
    const result = resolvePointValue([4, 2], 6)

    expect(result).toEqual({
      dice: [4, 2],
      pointValue: 0,
    })
  })
})

describe('resolveBets', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('linePassLine: Win - Come out 7 || 11', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('linePassLine: Loss - Come out any craps', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [1, 2], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('linePassLine: Come out set Point', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 2], 0)

    expect(result).toEqual({
      betMap: {
        linePassLine6: initialBet,
      },
      payouts: [],
    })
  })
  test('linePassLine: Loss - Point 7 Out', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('linePassLine: Winner point', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: initialBet,
    }
    const result = resolveBets(betMap, [4, 2], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('linePassLine: Winner point with odds', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: { ...initialBet, odds: 20 },
    }
    const result = resolveBets(betMap, [4, 2], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
          odds: 44,
        },
      ],
    })
  })
  test('linePassLine: Point 7 out with odds', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine8: { ...initialBet, odds: 15, amount: 15 },
    }
    const result = resolveBets(betMap, [5, 2], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('lineComeLine: Winner 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('lineComeLine: Lose - Any Craps', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 1], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('lineComeLine: Set Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 6], 6)
    expect(result).toEqual({
      betMap: {
        lineComeLine8: initialBet,
      },
      payouts: [],
    })
  })
  test('lineComeLine: Winner - Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [4, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('lineComeLine: Winner with odds - Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 20 },
    }

    const result = resolveBets(betMap, [4, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
          odds: 44,
        },
      ],
    })
  })
  test('lineComeLine: Winner - Come point. Reset Come', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [4, 4], 8)
    expect(result).toEqual({
      betMap: {
        lineComeLine8: initialBet,
      },
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('lineComeLine: Loss - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('lineComeLine: Loss not working odds - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 10 },
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
          odds: 10,
        },
      ],
    })
  })
  test('lineComeLine: Loss working odds - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 10, working: true },
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          working: true,
          amount: 0,
          odds: 0,
        },
      ],
    })
  })
  test('lineDontPassLine: Win - Come out 2 || 3', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [1, 2], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('lineDontPassLine: Loss - Come out 7 || 11', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('lineDontPassLine: Push - Come out 12', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [6, 6], 0)

    expect(result).toEqual({
      betMap: {
        lineDontPassLine: initialBet,
      },
      payouts: [],
    })
  })
  test('lineDontPassLine: Set Point', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 4], 0)

    expect(result).toEqual({
      betMap: {
        lineDontPassLine8: initialBet,
      },
      payouts: [],
    })
  })
  test('lineDontPassLine: Win - 7 Out', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 8)
    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('lineDontPassLine: Loss - Point Winner', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    const result = resolveBets(betMap, [4, 4], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('centerField: Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerField: { ...initialBet, amount: 10 },
    }
    const result = resolveBets(betMap, [5, 2], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('centerField: Win', () => {
    const betMap: Partial<IBetMap> = {
      centerField: { ...initialBet, amount: 10 },
    }
    const result = resolveBets(betMap, [3, 1], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 20,
        },
      ],
    })
  })
  test('centerField: Win double on 2 || 12', () => {
    const betMap: Partial<IBetMap> = {
      centerField: initialBet,
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 30,
        },
      ],
    })
  })
  test('centerAnyCraps: Win', () => {
    const betMap: Partial<IBetMap> = {
      centerAnyCraps: initialBet,
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 80,
        },
      ],
    })
  })
  test('centerAnyCraps: Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerAnyCraps: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('centerHard: Win', () => {
    const betMap: Partial<IBetMap> = {
      centerHard6: initialBet,
    }
    const result = resolveBets(betMap, [3, 3], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 80,
        },
      ],
    })
  })
  test('centerHard: Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerHard6: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 0,
        },
      ],
    })
  })
  test('centerHard: No Action', () => {
    const betMap: Partial<IBetMap> = {
      centerHard6: initialBet,
    }
    const result = resolveBets(betMap, [2, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: [],
    })
  })
})
