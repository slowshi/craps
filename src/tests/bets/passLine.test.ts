import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: Pass Line', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win - Come out 7 || 11', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap,
      payouts: {
        linePassLine: {
          ...initialBet,
          amount: 10,
        },
      },
      delta: 10,
    })
  })
  test('Loss - Come out any craps', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [1, 2], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        linePassLine: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
  test('Come out set Point', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 2], 0)

    expect(result).toEqual({
      betMap: {
        linePassLine6: initialBet,
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Loss - Point 7 Out', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        linePassLine6: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
  test('Winner point', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: initialBet,
    }
    const result = resolveBets(betMap, [4, 2], 6)

    expect(result).toEqual({
      betMap: {
        linePassLine: initialBet,
      },
      payouts: {
        linePassLine6: {
          ...initialBet,
          amount: 10,
        },
      },
      delta: 10,
    })
  })
  test('Winner point with odds', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine6: { ...initialBet, odds: 20 },
    }
    const result = resolveBets(betMap, [4, 2], 6)

    expect(result).toEqual({
      betMap: {
        linePassLine: initialBet,
      },
      payouts: {
        linePassLine6: {
          ...initialBet,
          odds: 44,
        },
      },
      delta: 54,
    })
  })
  test('Point 7 out with odds', () => {
    const betMap: Partial<IBetMap> = {
      linePassLine8: { ...initialBet, odds: 15, amount: 15 },
    }
    const result = resolveBets(betMap, [5, 2], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        linePassLine8: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -30,
    })
  })
})
