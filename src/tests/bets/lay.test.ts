import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'
describe('resolveBets: Lay', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 20,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: initialBet,
    }
    const result = resolveBets(betMap, [4, 3], 6)

    expect(result).toEqual({
      betMap,
      payouts: {
        numbersLay4: {
          ...initialBet,
          amount: 9,
        },
      },
      delta: 9,
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: initialBet,
    }
    const result = resolveBets(betMap, [2, 2], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersLay4: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -20,
    })
  })
  test('No Action', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: initialBet,
    }
    const result = resolveBets(betMap, [3, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('No Action if called off', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: {
        ...initialBet,
        off: true,
      },
    }
    const result = resolveBets(betMap, [2, 2], 6)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('No Action if Not Working on Come Out', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: initialBet,
    }
    const result = resolveBets(betMap, [2, 2], 0)

    expect(result).toEqual({
      betMap,
      payouts: {},
      delta: 0,
    })
  })

  test('Loss if Working on Come Out', () => {
    const betMap: Partial<IBetMap> = {
      numbersLay4: {
        ...initialBet,
        working: true,
      },
    }
    const result = resolveBets(betMap, [2, 2], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        numbersLay4: {
          ...initialBet,
          amount: 0,
          working: true,
        },
      },
      delta: -20,
    })
  })
})
