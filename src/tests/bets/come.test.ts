import { describe, test, expect } from 'bun:test'
import { baseBetDefaults, IBetMap } from '../../bets'
import { resolveBets } from '../../game'

describe('resolveBets: Come Line', () => {
  const initialBet = {
    ...baseBetDefaults,
    amount: 10,
  }
  test('Winner 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 6)

    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine: {
          ...initialBet,
          amount: 20,
        },
      },
    })
  })
  test('Lose - Any Craps', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 1], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine: {
          ...initialBet,
          amount: 0,
        },
      },
    })
  })
  test('Set Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
    }

    const result = resolveBets(betMap, [2, 6], 6)
    expect(result).toEqual({
      betMap: {
        lineComeLine8: initialBet,
      },
      payouts: {},
    })
  })
  test('Winner - Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [4, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine8: {
          ...initialBet,
          amount: 20,
        },
      },
    })
  })
  test('Winner with odds - Come point ', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 20 },
    }

    const result = resolveBets(betMap, [4, 4], 6)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine8: {
          ...initialBet,
          amount: 20,
          odds: 44,
        },
      },
    })
  })
  test('Winner - Come point. Reset Come', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine: initialBet,
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [4, 4], 8)
    expect(result).toEqual({
      betMap: {
        lineComeLine8: initialBet,
      },
      payouts: {
        lineComeLine8: {
          ...initialBet,
          amount: 20,
        },
      },
    })
  })
  test('Loss - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: initialBet,
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine8: {
          ...initialBet,
          amount: 0,
        },
      },
    })
  })
  test('Loss not working odds - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 10 },
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine8: {
          ...initialBet,
          amount: 0,
          odds: 10,
        },
      },
    })
  })
  test('Loss working odds - Come Out 7', () => {
    const betMap: Partial<IBetMap> = {
      lineComeLine8: { ...initialBet, odds: 10, working: true },
    }

    const result = resolveBets(betMap, [3, 4], 0)
    expect(result).toEqual({
      betMap: {},
      payouts: {
        lineComeLine8: {
          ...initialBet,
          working: true,
          amount: 0,
          odds: 0,
        },
      },
    })
  })
})