import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'
describe('resolveBets: Buy', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 50,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      numbersBuy4: initialBet,
    }
    const result = resolveBets(betMap, [2, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {
        numbersBuy4: {
          ...initialBet,
          amount: 95,
        },
      },
      delta: 95,
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      numbersBuy4: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersBuy4: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -50,
    })
  })
  test('No Action', () => {
    const betMap: Partial<IBetMap> = {
      numbersBuy4: initialBet,
    }
    const result = resolveBets(betMap, [4, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('No Action if called off', () => {
    const betMap: Partial<IBetMap> = {
      numbersBuy4: {
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
      numbersBuy4: initialBet,
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
      numbersBuy4: {
        ...initialBet,
        working: true,
      },
    }
    const result = resolveBets(betMap, [3, 4], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersBuy4: {
          ...initialBet,
          amount: 0,
          working: true,
        },
      },
      delta: -50,
    })
  })
})
