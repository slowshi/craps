import { baseBetDefaults, IBetMap } from '../bets'
import { resolvePointValue, resolveMakeBet } from '../game'

describe('resolveMakeBet', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  const betMap: Partial<IBetMap> = {
    numbersPlace6: initialBet,
  }
  test('should add to bet amount', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: 10 })

    expect(result).toEqual({
      numbersPlace6: { ...initialBet, amount: 20 },
    })
  })
  test('should subtract bet amount', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: -5 })

    expect(result).toEqual({
      numbersPlace6: { ...initialBet, amount: 5 },
    })
  })
  test('should remove bet if amount is default value', () => {
    const result = resolveMakeBet(betMap, 'numbersPlace6', { amount: -20 })

    expect(result).toEqual({})
  })
})

describe('resolvePointValue', () => {
  test('Set valid point. pointValue = 0 && roll = validPoint', () => {
    const result = resolvePointValue([4, 2], 0)

    expect(result).toEqual({
      dice: [4, 2],
      pointValue: 6,
      sevenOut: false,
      pointHit: false,
    })
  })

  test('Set 7 out. pointValue != 0 && roll = 7', () => {
    const result = resolvePointValue([4, 3], 6)

    expect(result).toEqual({
      dice: [4, 3],
      pointValue: 0,
      sevenOut: true,
      pointHit: false,
    })
  })

  test('Set winner point. pointValue = roll && roll = validPoint', () => {
    const result = resolvePointValue([4, 2], 6)

    expect(result).toEqual({
      dice: [4, 2],
      pointValue: 0,
      sevenOut: false,
      pointHit: true,
    })
  })
})
