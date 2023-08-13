import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../../bets'
import { resolveBets } from '../../game'
import { IBetMap } from '../../bets'
import { getRolls } from '../..'

const rolls = getRolls([4, 5, 6, 7, 8, 9, 10])
for (let i = 0; i < rolls.length; i++) {
  const roll = rolls[i]
  describe(`resolveBets: Hop ${roll}`, () => {
    const initialBet = {
      ...baseBetDefaults,
      amount: 10,
    }
    test('Win', () => {
      const betMap: Partial<IBetMap> = {
        [`centerHop${roll[0]}${roll[1]}`]: initialBet,
      }
      const result = resolveBets(betMap, roll, 0)

      expect(result).toEqual({
        betMap: {},
        payouts: [
          {
            ...initialBet,
            amount: 310,
          },
        ],
      })
    })
    test('Loss', () => {
      const betMap: Partial<IBetMap> = {
        [`centerHop${roll[0]}${roll[1]}`]: initialBet,
      }
      const result = resolveBets(betMap, [1, 1], 0)

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
  })
}
