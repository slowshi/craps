import { describe, test, expect } from 'bun:test'
import { baseBetDefaults, IBetMapm } from '../../bets'
import { resolveBets } from '../../game'
import { getRolls } from '../../dice'
const horn:number[] = [2,3,11,12,7]
const expectedPayouts = {
  7: 80,
  11: 160,
  12: 310,
  2: 310,
  3: 160
}
for (let i =0; i < horn.length; i++) {
  const value = horn[i]
  const diceRolls = getRolls([value])
  describe(`resolveBets: Horn ${value}`, () => {
    const initialBet = {
      ...baseBetDefaults,
      amount: 10,
    }
    test('Win', () => {
      const betMap: Partial<IBetMap> = {
        [`center${value}`]: initialBet,
      }
      const result = resolveBets(betMap, diceRolls[0], 0)

      expect(result).toEqual({
        betMap: {},
        payouts: {
          [`center${value}`]: {
            ...initialBet,
            amount: expectedPayouts[value],
          },
        },
      })
    })
    test('Loss', () => {
      const betMap: Partial<IBetMap> = {
        [`center${value}`]: initialBet,
      }
      const result = resolveBets(betMap, [1, 5], 0)

      expect(result).toEqual({
        betMap: {},
        payouts: {
          [`center${value}`]: {
            ...initialBet,
            amount: 0,
          },
        },
      })
    })
  })

}