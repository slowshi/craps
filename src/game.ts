import { getRollValue, isValidPoint } from './dice'
import { moveLineBet, updateBetMap, isEmptyBet, IBaseBet, IBetMap, getBetPayByRoll, baseBetDefaults } from './bets'
import { betResolvesMap } from './betTypes'

export const lineBetOdds: { [key: number]: number } = {
  4: 6 / 3,
  5: 6 / 4,
  6: 6 / 5,
  8: 6 / 5,
  9: 6 / 4,
  10: 6 / 3,
}

export const dontLineBetOdds: { [key: number]: number } = {
  4: 1 / 2,
  5: 2 / 3,
  6: 5 / 6,
  8: 5 / 6,
  9: 2 / 3,
  10: 1 / 2,
}

export type LineKey = 'linePassLine' | 'lineDontPassLine' | 'lineComeLine' | 'lineDontComeLine'
export const lineRolls = ['linePassLine', 'lineDontPassLine', 'lineComeLine', 'lineDontComeLine']

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
    const betVig = bet.vig ? bet.vig : 0
    const betWorking = bet.working ? bet.working : currentBet.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(currentBet.amount + betAmount, 0),
      odds: Math.max(currentBet.odds + betOdds, 0),
      vig: Math.max(currentBet.vig + betVig, 0),
    }
    if (isEmptyBet(newBet)) {
      delete newBetMap[betKey]
    } else {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  } else {
    const betAmount = bet.amount ? bet.amount : baseBetDefaults.amount
    const betOdds = bet.odds ? bet.odds : baseBetDefaults.odds
    const betVig = bet.vig ? bet.vig : baseBetDefaults.vig
    const betWorking = bet.working ? bet.working : baseBetDefaults.working
    const newBet = {
      ...baseBetDefaults,
      working: betWorking,
      amount: Math.max(betAmount, 0),
      odds: Math.max(betOdds, 0),
      vig: Math.max(betVig, 0),
    }
    if (!isEmptyBet(newBet)) {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  }
  return newBetMap
}
export interface BetResolution {
  betMap: Partial<IBetMap>
  payouts: IBaseBet[]
}
export const resolveBets = (betMap: Partial<IBetMap>, roll: DiceRoll, pointValue: number): BetResolution => {
  const rollValue = getRollValue(roll)
  const payouts: IBaseBet[] = []
  let newBetMap = { ...betMap }
  const betTypes: (keyof IBetMap)[] = Object.keys(newBetMap) as (keyof IBetMap)[]
  const comeLines = []

  const resolveByType = (type: keyof IBetMap) => {
    const bet = newBetMap[type]
    if (bet) {
      const resolves = betResolvesMap[type]
      const result = getBetPayByRoll(roll, resolves)
      let odds = 0
      if (result !== 0) {
        if (type.includes('lineComeLine')) {
          if (pointValue === 0 && result < 0 && !bet.working) {
            odds = bet.odds
          } else if (pointValue > 0 && result > 0) {
            odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
          }
        }
        if ((type.includes('lineDontPassLine') || type.includes('lineDontComeLine')) && result > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * dontLineBetOdds[pointValue])
        }
        if (type.includes('linePassLine') && result > 0 && pointValue > 0) {
          odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue])
        }
        payouts.push({
          ...bet,
          amount: bet.amount + bet.amount * result,
          odds,
        })
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

export const resolvePointValue = (roll: DiceRoll, pointValue: number): DiceState => {
  const rollValue = getRollValue(roll)
  let newPointValue = pointValue
  if (pointValue === 0 && isValidPoint(roll)) {
    newPointValue = rollValue
  } else if (pointValue !== 0 && getRollValue(roll) === 7) {
    newPointValue = 0
  } else if (pointValue !== 0 && getRollValue(roll) === pointValue) {
    newPointValue = 0
  }
  return {
    pointValue: newPointValue,
    dice: roll,
  }
}
