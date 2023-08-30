import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'
describe("resolveBets: Don't Pass", () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win - Come out 2 || 3', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [1, 2], 0)

    expect(result).toEqual({
      betMap,
      payouts: {
        lineDontPassLine: {
          ...initialBet,
          amount: 10,
        },
      },
      delta: 10,
    })
  })
  test('Loss - Come out 7 || 11', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontPassLine: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
  test('Push - Come out 12', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [6, 6], 0)

    expect(result).toEqual({
      betMap: {
        lineDontPassLine: initialBet,
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Set Point', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = resolveBets(betMap, [4, 4], 0)

    expect(result).toEqual({
      betMap: {
        lineDontPassLine8: initialBet,
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Win - 7 Out', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 8)
    expect(result).toEqual({
      betMap: {
        lineDontPassLine: initialBet,
      },
      payouts: {
        lineDontPassLine8: {
          ...initialBet,
          amount: 10,
        },
      },
      delta: 10,
    })
  })
  test('Win - 7 Out with odds', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine4: { ...initialBet, odds: 20 },
    }
    const result = resolveBets(betMap, [3, 4], 4)
    expect(result).toEqual({
      betMap: {
        lineDontPassLine: initialBet,
      },
      payouts: {
        lineDontPassLine4: {
          ...initialBet,
          amount: 10,
          odds: 30,
        },
      },
      delta: 40,
    })
  })
  test('Loss - Point Winner', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    const result = resolveBets(betMap, [4, 4], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontPassLine8: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
})
