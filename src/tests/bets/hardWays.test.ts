import { baseBetDefaults, IBetMap } from '../../bets'
import { DiceRoll, getRollValue, getRolls } from '../../dice'
import { resolveBets } from '../../game'
describe('resolveBets: Hard Ways', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  const hardwayRolls: DiceRoll[] = [
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
        betMap,
        payouts: {
          [`centerHard${value}`]: {
            ...initialBet,
            amount: value === 6 || value === 8 ? 90 : 70,
          },
        },
        delta: value === 6 || value === 8 ? 90 : 70,
      })
    })
    test(`Loss Hard ${value}`, () => {
      const betMap: Partial<IBetMap> = {
        [`centerHard${value}`]: initialBet,
      }
      const combinations = getRolls([value], [diceRoll])
      const result = resolveBets(betMap, combinations[0], 6)

      expect(result).toEqual({
        betMap: {},
        payouts: {
          [`centerHard${value}`]: {
            ...initialBet,
            amount: 0,
          },
        },
        delta: -10,
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
      payouts: {},
      delta: 0,
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
      payouts: {},
      delta: 0,
    })
  })
})
