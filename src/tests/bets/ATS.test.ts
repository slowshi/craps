import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: ATS Bets', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
    rollValues: [],
  }
  test('Center All - Win', () => {
    const betMap: Partial<IBetMap> = {
      centerAll: {
        ...initialBet,
        rollValues: [3, 4, 5, 6, 8, 9, 10, 11, 12],
      },
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerAll: initialBet,
      },
      payouts: {
        centerAll: {
          ...initialBet,
          rollValues: [3, 4, 5, 6, 8, 9, 10, 11, 12, 2],
          amount: 1490,
        },
      },
      delta: 1490,
    })
  })
  test('Center All - No Win Add Number to bet', () => {
    const betMap: Partial<IBetMap> = {
      centerAll: {
        ...initialBet,
      },
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerAll: {
          ...initialBet,
          rollValues: [2],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center All - No Action already hit that number', () => {
    const betMap: Partial<IBetMap> = {
      centerAll: {
        ...initialBet,
        rollValues: [2],
      },
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerAll: {
          ...initialBet,
          rollValues: [2],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center All - Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerAll: {
        ...initialBet,
        rollValues: [2, 3, 4],
      },
    }
    const result = resolveBets(betMap, [4, 3], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        centerAll: {
          ...initialBet,
          amount: 0,
          rollValues: [2, 3, 4],
        },
      },
      delta: -10,
    })
  })
  test('Center Tall - Win', () => {
    const betMap: Partial<IBetMap> = {
      centerTall: {
        ...initialBet,
        rollValues: [8, 10, 11, 12],
      },
    }
    const result = resolveBets(betMap, [4, 5], 8)

    expect(result).toEqual({
      betMap: {
        centerTall: initialBet,
      },
      payouts: {
        centerTall: {
          ...initialBet,
          rollValues: [8, 10, 11, 12, 9],
          amount: 290,
        },
      },
      delta: 290,
    })
  })
  test('Center Tall - No Win Add Number to bet', () => {
    const betMap: Partial<IBetMap> = {
      centerTall: {
        ...initialBet,
      },
    }
    const result = resolveBets(betMap, [5, 3], 8)

    expect(result).toEqual({
      betMap: {
        centerTall: {
          ...initialBet,
          rollValues: [8],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center Tall - No Action already hit that number', () => {
    const betMap: Partial<IBetMap> = {
      centerTall: {
        ...initialBet,
        rollValues: [2],
      },
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerTall: {
          ...initialBet,
          rollValues: [2],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center Tall - Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerTall: {
        ...initialBet,
        rollValues: [2, 3, 4],
      },
    }
    const result = resolveBets(betMap, [4, 3], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        centerTall: {
          ...initialBet,
          amount: 0,
          rollValues: [2, 3, 4],
        },
      },
      delta: -10,
    })
  })
  test('Center Small - Win', () => {
    const betMap: Partial<IBetMap> = {
      centerSmall: {
        ...initialBet,
        rollValues: [2, 3, 5, 6],
      },
    }
    const result = resolveBets(betMap, [3, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerSmall: initialBet,
      },
      payouts: {
        centerSmall: {
          ...initialBet,
          rollValues: [2, 3, 5, 6, 4],
          amount: 290,
        },
      },
      delta: 290,
    })
  })
  test('Center Small - No Win Add Number to bet', () => {
    const betMap: Partial<IBetMap> = {
      centerSmall: {
        ...initialBet,
      },
    }
    const result = resolveBets(betMap, [5, 3], 8)

    expect(result).toEqual({
      betMap: {
        centerSmall: {
          ...initialBet,
          rollValues: [8],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center Small - No Action already hit that number', () => {
    const betMap: Partial<IBetMap> = {
      centerSmall: {
        ...initialBet,
        rollValues: [2],
      },
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerSmall: {
          ...initialBet,
          rollValues: [2],
        },
      },
      payouts: {},
      delta: 0,
    })
  })
  test('Center Small - Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerSmall: {
        ...initialBet,
        rollValues: [2, 3, 4],
      },
    }
    const result = resolveBets(betMap, [4, 3], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        centerSmall: {
          ...initialBet,
          amount: 0,
          rollValues: [2, 3, 4],
        },
      },
      delta: -10,
    })
  })
})
