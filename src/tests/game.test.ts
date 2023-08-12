import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../bets'
import { resolvePointValue, resolveBets, resolveMakeBet } from '../game'

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
