import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: Any Craps', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      centerAnyCraps: initialBet,
    }
    const result = resolveBets(betMap, [1, 1], 8)

    expect(result).toEqual({
      betMap: {
        centerAnyCraps: initialBet,
      },
      payouts: {
        centerAnyCraps: {
          ...initialBet,
          amount: 70,
        },
      },
      delta: 70,
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      centerAnyCraps: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 8)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        centerAnyCraps: {
          ...initialBet,
          amount: 0,
        },
      },
      delta: -10,
    })
  })
})
