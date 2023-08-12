import { describe, test, expect } from 'bun:test'
import { rollDice, sortRollValues, getRollValue, isValidPoint, getRolls, validPoints, DiceRoll } from '../dice'

describe('rollDice', () => {
  test('should return a tuple with two values', () => {
    const result = rollDice()
    expect(result).toHaveLength(2)
  })

  test('each value in the tuple should be an integer between 1 and 6', () => {
    const result = rollDice()
    result.forEach((die) => {
      expect(die).toBeGreaterThanOrEqual(1)
      expect(die).toBeLessThanOrEqual(6)
      expect(Number.isInteger(die)).toBe(true)
    })
  })
})

describe('sortRollValues', () => {
  test('should sort dice roll values in non-ascending order', () => {
    // Test case 1: When the first die value is less than the second die value
    const diceRoll1: DiceRoll = [2, 5]
    const result1 = sortRollValues(diceRoll1)
    expect(result1).toEqual([5, 2])

    // Test case 2: When the first die value is greater than the second die value
    const diceRoll2: DiceRoll = [6, 3]
    const result2 = sortRollValues(diceRoll2)
    expect(result2).toEqual([6, 3])

    // Test case 3: When both die values are equal
    const diceRoll3: DiceRoll = [4, 4]
    const result3 = sortRollValues(diceRoll3)
    expect(result3).toEqual([4, 4])
  })
})

describe('getRollValue', () => {
  test('should correctly calculate the sum of two dice values', () => {
    // Test case 1: Dice values are 3 and 4
    const diceRoll1: DiceRoll = [3, 4]
    const result1 = getRollValue(diceRoll1)
    expect(result1).toEqual(7)

    // Test case 2: Dice values are 6 and 1
    const diceRoll2: DiceRoll = [6, 1]
    const result2 = getRollValue(diceRoll2)
    expect(result2).toEqual(7)

    // Test case 3: Dice values are 2 and 2
    const diceRoll3: DiceRoll = [2, 2]
    const result3 = getRollValue(diceRoll3)
    expect(result3).toEqual(4)
  })
})
describe('isValidPoint', () => {
  test('should return true for valid point values', () => {
    const diceRoll1: DiceRoll = [4, 2] // Sum: 6
    const result1 = isValidPoint(diceRoll1, validPoints)
    expect(result1).toBe(true)

    const diceRoll2: DiceRoll = [5, 5] // Sum: 10
    const result2 = isValidPoint(diceRoll2, validPoints)
    expect(result2).toBe(true)
  })

  test('should return false for invalid point values', () => {
    const diceRoll3: DiceRoll = [2, 1] // Sum: 5
    const result3 = isValidPoint(diceRoll3, validPoints)
    expect(result3).toBe(false)

    const diceRoll4: DiceRoll = [1, 1] // Sum: 2
    const result4 = isValidPoint(diceRoll4, validPoints)
    expect(result4).toBe(false)
  })

  test('should use provided points array when specified', () => {
    const customPoints = [3, 4, 5]
    const diceRoll5: DiceRoll = [2, 1] // Sum: 3
    const result5 = isValidPoint(diceRoll5, customPoints)
    expect(result5).toBe(true)

    const diceRoll6: DiceRoll = [6, 4] // Sum: 10
    const result6 = isValidPoint(diceRoll6, customPoints)
    expect(result6).toBe(false)
  })
})
describe('getRolls', () => {
  test('should correctly generate all possible rolls for the given roll values', () => {
    const rollValues = [3, 4]
    const result = getRolls(rollValues, [])
    expect(result).toEqual([
      [2, 1],
      [2, 2],
      [3, 1],
    ])
  })

  test('should correctly exclude specified dice rolls', () => {
    const rollValues = [3, 4]
    const excluded: DiceRoll[] = [
      [1, 2],
      [2, 2],
    ]
    const result = getRolls(rollValues, excluded)
    expect(result).toEqual([[3, 1]])
  })

  test('should return an empty array when all possible rolls are excluded', () => {
    const rollValues = [3]
    const excluded: DiceRoll[] = [
      [1, 2],
      [2, 1],
    ]
    const result = getRolls(rollValues, excluded)
    expect(result).toEqual([])
  })
})
