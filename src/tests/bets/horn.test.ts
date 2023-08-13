import { describe, test, expect } from 'bun:test'
import { baseBetDefaults } from '../../bets'
import { resolveBets } from '../../game'
import { IBetMap } from '../../bets'
describe('resolveBets: Horn 12', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      center12: initialBet,
    }
    const result = resolveBets(betMap, [6, 6], 0)

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
      center12: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 0)

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
describe('resolveBets: Horn 11', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      center11: initialBet,
    }
    const result = resolveBets(betMap, [5, 6], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 160,
        },
      ],
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      center12: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 0)

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
describe('resolveBets: Horn 3', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      center3: initialBet,
    }
    const result = resolveBets(betMap, [2, 1], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 160,
        },
      ],
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      center3: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 0)

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
describe('resolveBets: Horn 3', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      center2: initialBet,
    }
    const result = resolveBets(betMap, [1, 1], 0)

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
      center2: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 0)

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
describe('resolveBets: Big Red (7)', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Win', () => {
    const betMap: Partial<IBetMap> = {
      center7: initialBet,
    }
    const result = resolveBets(betMap, [3, 4], 0)

    expect(result).toEqual({
      betMap: {},
      payouts: [
        {
          ...initialBet,
          amount: 80,
        },
      ],
    })
  })
  test('Loss', () => {
    const betMap: Partial<IBetMap> = {
      center7: initialBet,
    }
    const result = resolveBets(betMap, [1, 5], 0)

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
