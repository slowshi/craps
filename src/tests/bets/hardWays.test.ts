import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../../bets'
import { resolveBets } from '../../game'
import { getRollValue } from '../../dice'

describe('resolveBets: Hard Ways', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  const hardwayRolls = [
    [2, 2],
    [3, 3],
    [4, 4],
    [5, 5],
  ]
  for (let i = 0; i < hardwayRolls.length; i++) {
    const diceRoll = hardwayRolls[i]
    const value = getRollValue(diceRoll)
    test(`Win Hard ${value}`, () => {
      const betMap: Partial<IBetMap> = {
        [`centerHard${value}`]: initialBet,
      }
      const result = resolveBets(betMap, diceRoll, 5)

      expect(result).toEqual({
        betMap: {},
        payouts: [
          {
            ...initialBet,
            amount: value === 6 || value === 8 ? 80 : 100,
          },
        ],
      })
    })
    test(`Loss Hard ${value}`, () => {
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
  }
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
  test('No Action if called off', () => {
    const betMap: Partial<IBetMap> = {
      centerHard6: {
        ...initialBet,
        off: true,
      },
    }
    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap,
      payouts: [],
    })
  })
})
