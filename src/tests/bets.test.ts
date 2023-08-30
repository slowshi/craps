import { passLineBet } from '../betTypes'
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
  comeLinePointValidation,
  dontPassLinePointValidation,
  centerATSValidation,
} from '../bets'

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
describe('Pass Line Validation', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('can make new bet on Pass Line', () => {
    const result = passLineBetValidation({}, { amount: 10 }, 0)
    expect(result).toEqual(true)
  })
  test('cannot make new line contract with puck on', () => {
    const result = passLineBetValidation({}, { amount: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = passLineBetValidation({}, { odds: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', () => {
    const result = passLineBetValidation({ ...initialBet }, { amount: -10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds with puck off', () => {
    const result = passLineBetValidation({ ...initialBet }, { odds: 10 }, 0)
    expect(result).toEqual(false)
  })
})

describe('Pass Line Point Validation', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('cannot make new line contract with puck on', () => {
    const result = passLinePointValidation({}, { amount: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = passLinePointValidation({}, { odds: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = passLinePointValidation({ amount: 5, odds: 15 }, { odds: 1 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', () => {
    const result = passLinePointValidation({ ...initialBet }, { amount: -10 }, 4)
    expect(result).toEqual(false)
  })
})
describe('Come Line Validation', () => {
  test('can make new bet on Pass Line', () => {
    const result = comeLineBetValidation({}, { amount: 10 }, 4)
    expect(result).toEqual(true)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = comeLineBetValidation({}, { amount: 10 }, 0)
    expect(result).toEqual(false)
  })
  test('cannot reduce pass line bet with puck on', () => {
    const result = comeLineBetValidation({}, { odds: 10 }, 4)
    expect(result).toEqual(false)
  })
})
describe('Come Line Point Validation', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('cannot make new come line contract with puck on', () => {
    const result = comeLinePointValidation({}, { amount: 10 }, 'lineComeLine6')
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = comeLinePointValidation({}, { odds: 10 }, 'lineComeLine6')
    expect(result).toEqual(false)
  })
  test('cannot add more odds than max', () => {
    const result = comeLinePointValidation({ amount: 5, odds: 25 }, { odds: 1 }, 'lineComeLine6')
    expect(result).toEqual(false)
  })
  test('cannot reduce come line contract', () => {
    const result = comeLinePointValidation({ ...initialBet }, { amount: -10 }, 'lineComeLine6')
    expect(result).toEqual(false)
  })
})
describe('Dont Pass Line Point Validation', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('cannot make new line contract with puck on', () => {
    const result = dontPassLinePointValidation({}, { amount: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = dontPassLinePointValidation({}, { odds: 10 }, 4)
    expect(result).toEqual(false)
  })
  test('cannot add more odds than the amount 6x', () => {
    const result = dontPassLinePointValidation({ ...initialBet, odds: 120 }, { odds: 1 }, 6)
    expect(result).toEqual(false)
  })
  test('cannot remove amount where odds where new amount is greater than max odds', () => {
    const result = dontPassLinePointValidation({ ...initialBet, odds: 120 }, { amount: -5 }, 6)
    expect(result).toEqual(false)
  })
  test('cannot increase dont line bet with puck on', () => {
    const result = dontPassLinePointValidation({ ...initialBet }, { amount: 10 }, 6)
    expect(result).toEqual(false)
  })
})
describe('Numbers Bet Validation', () => {
  test('can make new bet', () => {
    const result = numbersBetValidation({}, { amount: 10 })
    expect(result).toEqual(true)
  })
  test('cannot add odds if there is no current bet', () => {
    const result = numbersBetValidation({}, { amount: 10, odds: 10 })
    expect(result).toEqual(false)
  })
})
describe('Center Bet Validation', () => {
  test('can make new bet', () => {
    const result = centerBetValidation({}, { amount: 10 })
    expect(result).toEqual(true)
  })
  test('cannot add odds to center bets', () => {
    const result = centerBetValidation({}, { amount: 10, odds: 10 })
    expect(result).toEqual(false)
  })
})
describe('Center ATS Validation', () => {
  test('can make new bet', () => {
    const result = centerATSValidation({}, { amount: 10 }, {}, 'centerSmall')
    expect(result).toEqual(true)
  })
  test('cannot add odds to a center bets', () => {
    const result = centerATSValidation({}, { amount: 10, odds: 10 }, {}, 'centerSmall')
    expect(result).toEqual(false)
  })
  test('cannot add to bet if rollValues have started', () => {
    const result = centerATSValidation(
      { amount: 10, rollValues: [2] },
      { amount: 10 },
      { centerAll: { amount: 10, rollValues: [2], working: false, odds: 0, off: false } },
      'centerAll',
    )
    expect(result).toEqual(false)
  })
  test('centerSmall - Can add to bet if All is still active after Small/Tall win', () => {
    const result = centerATSValidation(
      { amount: 10, rollValues: [] },
      { amount: -10 },
      {
        centerSmall: { amount: 10, rollValues: [], working: false, odds: 0, off: false },
        centerAll: { amount: 10, rollValues: [2, 3, 4, 5, 6], working: false, odds: 0, off: false },
      },
      'centerSmall',
    )
    expect(result).toEqual(true)
  })
  test('centerSmall - Can add to bet if Tall/Small is still active after Small/Tall win', () => {
    const result = centerATSValidation(
      { amount: 10, rollValues: [] },
      { amount: -10 },
      {
        centerSmall: { amount: 10, rollValues: [], working: false, odds: 0, off: false },
        centerTall: { amount: 10, rollValues: [2, 3, 4, 5, 6], working: false, odds: 0, off: false },
      },
      'centerSmall',
    )
    expect(result).toEqual(true)
  })
  test('centerTall - Can add to bet if All is still active after Small/Tall win', () => {
    const result = centerATSValidation(
      { amount: 10, rollValues: [] },
      { amount: -10 },
      {
        centerTall: { amount: 10, rollValues: [], working: false, odds: 0, off: false },
        centerAll: { amount: 10, rollValues: [8, 9, 10, 11, 12], working: false, odds: 0, off: false },
      },
      'centerTall',
    )
    expect(result).toEqual(true)
  })
  test('centerTall - Can add to bet if Tall/Small is still active after Small/Tall win', () => {
    const result = centerATSValidation(
      { amount: 10, rollValues: [] },
      { amount: -10 },
      {
        centerTall: { amount: 10, rollValues: [], working: false, odds: 0, off: false },
        centerSmall: { amount: 10, rollValues: [8, 9, 10, 11, 12], working: false, odds: 0, off: false },
      },
      'centerTall',
    )
    expect(result).toEqual(true)
  })

  test('centerAll - Can add to bet if All if Tall/Small is stilla ctive after All win', () => {
    const result = centerATSValidation(
      { amount: 5, odds: 0, off: false, rollValues: [], working: false },
      { amount: -5, off: false, working: false },
      {
        centerAll: { amount: 5, odds: 0, off: false, rollValues: [], working: false },
        centerSmall: { amount: 5, odds: 0, off: false, rollValues: [8, 9, 10, 11, 12], working: false },
      },
      'centerAll',
    )
    expect(result).toEqual(true)
  })
})
describe('isValidBet', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('valid bet', () => {
    const validBet = isValidBet({}, 'linePassLine', { amount: 10 }, 0)
    expect(validBet).toEqual(true)
  })
  test('odds not allowed on line bets with puck off', () => {
    const validBet = isValidBet({}, 'linePassLine', { amount: 10, odds: 10 }, 0)
    expect(validBet).toEqual(false)
  })
  test('odds not allowed on numbers bets', () => {
    const notValidBet = isValidBet({}, 'numbersPlace6', { amount: 10, odds: 10 }, 6)
    expect(notValidBet).toEqual(false)
  })
  test('odds not allowed on center bets', () => {
    const notValidBet = isValidBet({}, 'centerField', { amount: 10, odds: 10 }, 6)
    expect(notValidBet).toEqual(false)
  })
  test('cannot remove from Pass Line bet with Puck ON', () => {
    const notValidBet = isValidBet({ linePassLine5: { ...initialBet } }, 'linePassLine5', { amount: -10 }, 6)
    expect(notValidBet).toEqual(false)
  })
  test('cannot add odds to a bet you are not on', () => {
    const validBet = isValidBet({ linePassLine5: { ...initialBet } }, 'linePassLine5', { odds: 10 }, 6)
    expect(validBet).toEqual(true)

    const notValidBet = isValidBet({}, 'linePassLine5', { odds: 10 }, 6)
    expect(notValidBet).toEqual(false)
  })
  // test('cannot make odds bet on Come Line Bet', () => {
  //   const validBet = isValidBet({}, 'linePassLine', {odds: 10}, 6)
  //   expect(validBet).toEqual(false)
  // })
  // test('cannot make Come Bet with Puck OFF', () => {})
  // test('cannot make odds bet with Puck OFF', () => {})
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
