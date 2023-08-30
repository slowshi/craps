import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: Dont Come Line', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Winner - Any Craps', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine: initialBet,
    }

    const result = resolveBets(betMap, [1, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {
        lineDontComeLine: initialBet,
      },
      delta: 10,
    })
  })
  test('Lose - on 7 or 11', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine: initialBet,
    }

    const result7 = resolveBets(betMap, [2, 5], 6)
    expect(result7).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
    const result11 = resolveBets(betMap, [6, 5], 6)
    expect(result11).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
  test('Set Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine6: initialBet,
      lineDontComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 6], 6)
    expect(result).toEqual({
      betMap: {
        lineDontPassLine6: initialBet,
        lineDontComeLine8: initialBet,
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Come Point Loss with odds, Dont Come Line moves to same Point', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine4: { ...initialBet, odds: 20 },
      lineDontComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 2], 6)
    expect(result).toEqual({
      betMap: {
        lineDontComeLine4: initialBet,
      },
      payouts: {
        lineDontPassLine4: {
          ...initialBet,
          amount: 0,
          odds: 0,
        },
      },
      delta: -30,
    })
  })
  test('Come Point Loss, Dont Come Line moves to same Point', () => {
    const betMap: Partial<IBetMap> = {
      lineDontPassLine6: initialBet,
      lineDontComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 4], 6)
    expect(result).toEqual({
      betMap: {
        lineDontComeLine6: initialBet,
      },
      payouts: {
        lineDontPassLine6: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
  test('Winner - Dont Come 7 Out ', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine8: {
          ...initialBet,
          amount: 20,
        },
      },
      delta: 20,
    })
  })
  test('Winner with odds - Dont Come 7 Out ', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine4: { ...initialBet, odds: 20 },
    }

    const result = resolveBets(betMap, [3, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine4: {
          ...initialBet,
          amount: 20,
          odds: 30,
        },
      },
      delta: 50,
    })
  })
  test('Winner - Dont Come point with Odds. Loser Dont Come Line', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine: initialBet,
      lineDontComeLine4: { ...initialBet, odds: 20 },
    }

    const result = resolveBets(betMap, [3, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine: {
          ...initialBet,
          amount: 0,
        },
        lineDontComeLine4: {
          ...initialBet,
          amount: 20,
          odds: 30,
        },
      },
      delta: 40,
    })
  })

  test('Winner - Dont Come Point. Loser Dont Come Line', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine: initialBet,
      lineDontComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine: {
          ...initialBet,
          amount: 0,
        },
        lineDontComeLine8: {
          ...initialBet,
          amount: 20,
        },
      },
      delta: 10,
    })
  })

  test('Loss working odds -  Dont Come Point Hit', () => {
    const betMap: Partial<IBetMap> = {
      lineDontComeLine8: { ...initialBet, odds: 10 },
    }

    const result = resolveBets(betMap, [4, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineDontComeLine8: {
          ...initialBet,
          amount: 0,
          odds: 0,
        },
      },
      delta: -20,
    })
  })
})
