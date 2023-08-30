import { getRolls } from '../..'
import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

const rolls = getRolls([4, 5, 6, 7, 8, 9, 10])
const hardway = ['22', '33', '44', '55']
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
        betMap,
        payouts: {
          [`centerHop${roll[0]}${roll[1]}`]: {
            ...initialBet,
            amount: hardway.indexOf(`${roll[0]}${roll[1]}`) > -1 ? 300 : 150,
          },
        },
        delta: hardway.indexOf(`${roll[0]}${roll[1]}`) > -1 ? 300 : 150,
      })
    })
    test('Loss', () => {
      const betMap: Partial<IBetMap> = {
        [`centerHop${roll[0]}${roll[1]}`]: initialBet,
      }
      const result = resolveBets(betMap, [1, 1], 0)

      expect(result).toEqual({
        betMap: {},
        payouts: {
          [`centerHop${roll[0]}${roll[1]}`]: {
            ...initialBet,
            amount: 0,
          },
        },
        delta: -10,
      })
    })
  })
}
