import { IBetMap, baseBetDefaults } from '../../bets'
import { getRolls } from '../../dice'
import { resolveBets } from '../../game'
const horn: number[] = [2, 3, 11, 12, 7]
const expectedPayouts: {
  [key: number]: number
} = {
  7: 70,
  11: 150,
  12: 300,
  2: 300,
  3: 150,
}
for (let i = 0; i < horn.length; i++) {
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
        betMap,
        payouts: {
          [`center${value}`]: {
            ...initialBet,
            amount: expectedPayouts[value],
          },
        },
        delta: expectedPayouts[value],
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
        delta: -10,
      })
    })
  })
}
