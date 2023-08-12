import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../../bets'
import { resolveBets } from '../../game'
describe('resolveBets: Hard Ways', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
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
  test('Loss', () => {
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
  test('No Action', () => {
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
