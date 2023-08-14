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
  passLineBetValidation,
  passLinePointValidation,
  centerBetValidation,
  numbersBetValidation,
  comeLineBetValidation,
  comeLinePointValidation
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
describe('Pass Line Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('can make new bet on Pass Line', ()=>{
    const result = passLineBetValidation({}, {amount: 10}, 0)
    expect(result).toEqual(true)
  })
  test('cannot make new line contract with puck on', ()=>{
    const result = passLineBetValidation({}, {amount: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = passLineBetValidation({}, {odds: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', ()=>{
    const result = passLineBetValidation({...initialBet}, {amount: -10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds with puck off', ()=>{
    const result = passLineBetValidation({...initialBet}, {odds:10}, 0)
    expect(result).toEqual(false)
  })
})

describe('Pass Line Point Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('cannot make new line contract with puck on', ()=>{
    const result = passLineBetValidation({}, {amount: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = passLineBetValidation({}, {odds: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', ()=>{
    const result = passLineBetValidation({...initialBet}, {amount: -10}, 4)
    expect(result).toEqual(false)
  })
})
describe('Come Line Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('can make new bet on Pass Line', ()=>{
    const result = comeLineBetValidation({}, {amount: 10}, 4)
    expect(result).toEqual(true)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = comeLineBetValidation({}, {amount: 10}, 0)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', ()=>{
    const result = comeLineBetValidation({}, {odds: 10}, 4)
    expect(result).toEqual(false)
  })
})
describe('Come Line Point Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('cannot make new come line contract with puck on', ()=>{
    const result = comeLinePointValidation({}, {amount: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = comeLinePointValidation({}, {odds: 10}, 4)
    expect(result).toEqual(false)
  })
  test('cannot reduce come line contract', ()=>{
    const result = comeLinePointValidation({...initialBet}, {amount: -10}, 0)
    expect(result).toEqual(false)
  })
})
describe('Numbers Bet Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('can make new bet', ()=>{
    const result = numbersBetValidation({}, {amount: 10}, 4)
    expect(result).toEqual(true)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = numbersBetValidation({}, {amount: 10, odds: 10}, 4)
    expect(result).toEqual(false)
  })
})
describe('Center Bet Validation', ()=>{
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('can make new bet', ()=>{
    const result = centerBetValidation({}, {amount: 10}, 4)
    expect(result).toEqual(true)
  })
  test('cannot add odds if there is no current bet', ()=>{
    const result = centerBetValidation({}, {amount: 10, odds: 10}, 4)
    expect(result).toEqual(false)
  })
})
describe('isValidBet', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10
  }
  test('valid bet', () => {
    const validBet = isValidBet({}, 'linePassLine', {amount: 10}, 0)
    expect(validBet).toEqual(true)
  })
  test('odds not allowed on line bets with puck off', () => {
    const validBet = isValidBet({}, 'linePassLine', {amount: 10, odds: 10}, 0)
    expect(validBet).toEqual(false)
  })
  test('odds not allowed on numbers bets', () => {
    const notValidBet = isValidBet({}, 'numbersPlace6', {amount: 10, odds: 10}, 6)
    expect(notValidBet).toEqual(false)
  })
  test('odds not allowed on center bets', () => {
    const notValidBet = isValidBet({}, 'centerField', {amount: 10, odds: 10}, 6)
    expect(notValidBet).toEqual(false)
  })
  test('cannot remove from Pass Line bet with Puck ON', () => {
    const notValidBet = isValidBet({linePassLine5: {...initialBet}}, 'linePassLine5', {amount: -10}, 6)
    expect(notValidBet).toEqual(false)
  })
  test('cannot add odds to a bet you are not on', () => {
    const validBet = isValidBet({linePassLine5: {...initialBet}}, 'linePassLine5', { odds:10 }, 6)
    expect(validBet).toEqual(true)

    const notValidBet = isValidBet({}, 'linePassLine5', {odds: 10}, 6)
    expect(notValidBet).toEqual(false)
  })
  // test('cannot make odds bet on Come Line Bet', () => {
  //   const validBet = isValidBet({}, 'linePassLine', {odds: 10}, 6)
  //   expect(validBet).toEqual(false)
  // })
  test('cannot make Come Bet with Puck OFF', () => {})
  test('cannot make odds bet with Puck OFF', () => {})

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
