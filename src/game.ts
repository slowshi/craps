import { getRollValue, isValidPoint, DiceRoll } from './dice'
import {
  moveLineBet,
  updateBetMap,
  isEmptyBet,
  IBaseBet,
  IBetMap,
  getBetPayByRoll,
  baseBetDefaults,
  LineKey,
  lineRolls,
} from './bets'
import { betResolvesMap, lineBetOdds, dontLineBetOdds } from './betTypes'
export type GameState = {
  pointValue: number
  dice: DiceRole
  sevenOut: boolean
}
export const resolveMakeBet = (
  betMap: Partial<IBetMap>,
  betKey: keyof IBetMap,
  bet: Partial<IBaseBet>,
): Partial<IBetMap> => {
  const currentBet = betMap[betKey]
  let newBetMap = { ...betMap }
  if (currentBet) {
    const betAmount = bet.amount ? bet.amount : 0
    const betOdds = bet.odds ? bet.odds : 0
    const betWorking = bet.working ? bet.working : currentBet.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(currentBet.amount + betAmount, 0),
      odds: Math.max(currentBet.odds + betOdds, 0),
    }
    if (isEmptyBet(newBet)) {
      delete newBetMap[betKey]
    } else {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  } else {
    const betAmount = bet.amount ? bet.amount : baseBetDefaults.amount
    const betOdds = bet.odds ? bet.odds : baseBetDefaults.odds
    const betWorking = bet.working ? bet.working : baseBetDefaults.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(betAmount, 0),
      odds: Math.max(betOdds, 0),
    }
    if (!isEmptyBet(newBet)) {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  }
  return newBetMap
}
export interface BetResolution {
  betMap: Partial<IBetMap>
  payouts: Partial<IBetMap>
}
export const resolveBets = (betMap: Partial<IBetMap>, roll: DiceRoll, pointValue: number): BetResolution => {
  const rollValue = getRollValue(roll)
  let payouts: Partial<IBetMap> = {}
  let newBetMap = { ...betMap }
  const betTypes: (keyof IBetMap)[] = Object.keys(newBetMap) as (keyof IBetMap)[]
  const comeLines = []

  const resolveByType = (type: keyof IBetMap) => {
    const bet = newBetMap[type]
    if (bet) {
      if (bet.off) return
      if (type.includes('number') && pointValue === 0 && !bet.working) return

      const resolves = betResolvesMap[type]
      const payout = getBetPayByRoll(roll, resolves)
      let odds = 0
      if (payout !== 0) {
        if (type.includes('lineComeLine')) {
          if (pointValue === 0 && payout < 0 && !bet.working) {
            odds = bet.odds
          } else if (pointValue > 0 && payout > 0) {
            odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
          }
        }
        if ((type.includes('lineDontPassLine') || type.includes('lineDontComeLine')) && payout > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * dontLineBetOdds[pointValue])
        }
        if (type.includes('linePassLine') && payout > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
        }
        payouts = {
          ...payouts,
          [type]: {
            ...bet,
            amount: bet.amount + bet.amount * payout,
            odds,
          },
        }
        delete newBetMap[type]
      } else {
        if (lineRolls.indexOf(type) > -1) {
          newBetMap = moveLineBet(betMap, type as LineKey, rollValue)
        }
      }
    }
  }

  for (let i = 0; i < betTypes.length; i++) {
    const type = betTypes[i]
    if (type === 'lineComeLine') {
      comeLines.push(type)
      continue
    }
    resolveByType(type)
  }

  for (let i = 0; i < comeLines.length; i++) {
    const type = betTypes[i]
    resolveByType(type)
  }

  return { betMap: newBetMap, payouts }
}

export const resolvePointValue = (roll: DiceRoll, pointValue: number): GameState => {
  const rollValue = getRollValue(roll)
  let newPointValue = pointValue
  let sevenOut = false
  if (pointValue === 0 && isValidPoint(roll)) {
    newPointValue = rollValue
  } else if (pointValue !== 0 && getRollValue(roll) === 7) {
    newPointValue = 0
    sevenOut = true
  } else if (pointValue !== 0 && getRollValue(roll) === pointValue) {
    newPointValue = 0
  }
  return {
    pointValue: newPointValue,
    dice: roll,
    sevenOut,
  }
}
