import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: Field', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Loss', () => {
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
  test('Win', () => {
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
  test('Win double on 2 || 12', () => {
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
})
