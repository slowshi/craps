import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'
describe('resolveBets: Place', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 12,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: initialBet,
    }
    const result = resolveBets(betMap, [3, 3], 6)

    expect(result).toEqual({
      betMap,
      payouts: {
        numbersPlace6: {
          ...initialBet,
          amount: 14,
        },
      },
      delta: 14,
    })
  })
  test('isBubbleCraps returns fractional dollars', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: { ...initialBet, amount: 1 },
    }
    const result = resolveBets(betMap, [3, 3], 6, true)

    expect(result).toEqual({
      betMap,
      payouts: {
        numbersPlace6: {
          ...initialBet,
          amount: 1.16,
        },
      },
      delta: 1.16,
    })
  })
  test('Not isBubbleCraps returns whole chip value', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: { ...initialBet, amount: 1 },
    }
    const result = resolveBets(betMap, [3, 3], 6)

    expect(result).toEqual({
      betMap,
      payouts: {
        numbersPlace6: {
          ...initialBet,
          amount: 1,
        },
      },
      delta: 1,
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersPlace6: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -12,
    })
  })
  test('No Action', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: initialBet,
    }
    const result = resolveBets(betMap, [2, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('No Action if called off', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: {
        ...initialBet,
        off: true,
      },
    }
    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('No Action if Not Working on Come Out', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 0)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('Loss if Working on Come Out', () => {
    const betMap: Partial<IBetMap> = {
      numbersPlace6: {
        ...initialBet,
        working: true,
      },
    }
    const result = resolveBets(betMap, [3, 4], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersPlace6: {
          ...initialBet,
          amount: 0,
          working: true,
        },
      },
      delta: -12,
    })
  })
})
