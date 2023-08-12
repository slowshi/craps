import { describe, test, expect } from 'bun:test'
import {
  updateBetMap,
  IBetMap,
  IBaseBet,
  moveLineBet,
  baseBetDefaults,
  isValidBet,
  getBetPayByRoll,
  isEmptyBet,
} from '../bets'
import { passLineBet } from '../betTypes'

describe('updateBetMap', () => {
  test('should correctly update the betMap with the provided bet', () => {
    const initialBet = {
      ...baseBetDefaults,
      amount: 10,
    }
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }

    // Define a new bet to be added
    const newBet: IBaseBet = {
      ...initialBet,
      odds: 20,
    }
    // Update the betMap using the updateBetMap function
    const result = updateBetMap(betMap, 'linePassLine', newBet)

    // Expected result after updating the betMap
    const expectedResult: Partial<IBetMap> = {
      linePassLine: { ...baseBetDefaults, amount: 10, odds: 20 },
    }

    expect(result).toEqual(expectedResult)
  })

  test('should correctly handle partial betMap objects', () => {
    // Define an empty partial betMap for testing
    const betMap: Partial<IBetMap> = {}

    // Define a new bet to be added
    const newBet: IBaseBet = {
      ...baseBetDefaults,
      amount: 30,
    }

    // Update the betMap using the updateBetMap function
    const result = updateBetMap(betMap, 'lineComeLine', newBet)

    // Expected result after updating the betMap
    const expectedResult: Partial<IBetMap> = {
      lineComeLine: newBet,
    }

    expect(result).toEqual(expectedResult)
  })
})

describe('moveLineBet', () => {
  // Define any common setup or variables here
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }

  test('should correctly move a pass bet to the number based on point value', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      linePassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'linePassLine', 8)
    const expectedResult: Partial<IBetMap> = {
      linePassLine8: initialBet,
    }
    expect(result).toEqual(expectedResult)
  })

  test('should correctly move a dontPass bet to the number based on point value', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'lineDontPassLine', 8)
    const expectedResult: Partial<IBetMap> = {
      lineDontPassLine8: initialBet,
    }
    expect(result).toEqual(expectedResult)
  })
  test('should return same betMap if it key does not exist', () => {
    // Define a partial betMap for testing
    const betMap: Partial<IBetMap> = {
      lineDontPassLine: initialBet,
    }
    const result = moveLineBet(betMap, 'linePassLine', 8)
    const expectedResult: Partial<IBetMap> = betMap
    expect(result).toEqual(expectedResult)
  })
})

describe('isValidBet  <<<<Test Later>>>', () => {
  test('bet is valid', () => {})
  test('cannot make Pass Line bet while puck is on', () => {})
  test('cannot make come bet with puck off', () => {})
  test('cannot make odds bet with puck off', () => {})
  test('cannot make odds bet on come bet', () => {})
})

describe('getBetPayByRoll', () => {
  test('should return a value 1 win', () => {
    const result = getBetPayByRoll([4, 3], passLineBet())

    expect(result).toEqual(1)
  })
  test('should return a value -1', () => {
    const result = getBetPayByRoll([1, 2], passLineBet())

    expect(result).toEqual(-1)
  })
  test('should return value 0 (no action)', () => {
    const result = getBetPayByRoll([4, 2], passLineBet())

    expect(result).toEqual(0)
  })
})

describe('isEmptyBet', () => {
  test('should be true if values are 0', () => {
    const bet = { ...baseBetDefaults }
    const result = isEmptyBet(bet)

    expect(result).toEqual(true)
  })
  test('should be false if values are not 0 ', () => {
    const bet = { ...baseBetDefaults, amount: 10 }
    const result = isEmptyBet(bet)

    expect(result).toEqual(false)
  })
})
