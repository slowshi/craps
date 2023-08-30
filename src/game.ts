import {
  betResolvesMap,
  lineBetOdds,
  dontLineBetOdds,
  centerAllResolveWin,
  centerTallResolveWin,
  centerSmallResolveWin,
} from './betTypes'
import {
  updateBetMap,
  isEmptyBet,
  IBaseBet,
  IBetMap,
  getBetPayByRoll,
  baseBetDefaults,
  lineRolls,
  IATSBet,
  IBetResolves,
} from './bets'
import { getRollValue, isValidPoint, DiceRoll } from './dice'
export type TableState = {
  pointValue: number
  dice: DiceRoll
  sevenOut: boolean
  pointHit: boolean
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
    const betOff = bet.off ? bet.off : currentBet.off
    let newBet: IBaseBet | IATSBet = {
      working: betWorking,
      off: betOff,
      amount: Math.max(currentBet.amount + betAmount, 0),
      odds: Math.max(currentBet.odds + betOdds, 0),
    }
    if (betKey === 'centerAll' || betKey === 'centerSmall' || betKey === 'centerTall') {
      newBet = {
        ...newBet,
        rollValues: [],
      }
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
    const betOff = bet.off ? bet.off : baseBetDefaults.off
    let newBet: IBaseBet | IATSBet = {
      working: betWorking,
      off: betOff,
      amount: Math.max(betAmount, 0),
      odds: Math.max(betOdds, 0),
    }
    if (betKey === 'centerAll' || betKey === 'centerSmall' || betKey === 'centerTall') {
      newBet = {
        ...newBet,
        rollValues: [],
      }
    }
    if (!isEmptyBet(newBet)) {
      newBetMap = updateBetMap(betMap, betKey, newBet)
    }
  }
  return newBetMap
}
export interface BetResults {
  betMap: Partial<IBetMap>
  payouts: Partial<IBetMap>
  delta: number
}
export const resolveBets = (
  betMap: Partial<IBetMap>,
  roll: DiceRoll,
  pointValue: number,
  isBubbleCraps = false,
): BetResults => {
  const rollValue = getRollValue(roll)
  let payouts: Partial<IBetMap> = {}
  let newBetMap = { ...betMap }
  const betTypes: (keyof IBetMap)[] = Object.keys(newBetMap) as (keyof IBetMap)[]
  const comeLines = []
  const hasComeLineBet = newBetMap['lineComeLine'] !== undefined
  const resolveByType = (type: keyof IBetMap) => {
    const bet = newBetMap[type]
    if (bet) {
      if (bet.off) return
      if (type.includes('number') && pointValue === 0 && !bet.working) return

      const resolves = betResolvesMap[type]
      let winResolve: IBetResolves[] = []
      if (type === 'centerAll') {
        const { rollValues } = bet as IATSBet
        winResolve = centerAllResolveWin(rollValues)
      }
      if (type === 'centerTall') {
        const { rollValues } = bet as IATSBet
        winResolve = centerTallResolveWin(rollValues)
      }
      if (type === 'centerSmall') {
        const { rollValues } = bet as IATSBet
        winResolve = centerSmallResolveWin(rollValues)
      }
      const payout = getBetPayByRoll(roll, [...resolves, ...winResolve])
      let odds = 0
      let amount = bet.amount * payout
      if (payout < 0) {
        if (type.includes('lineComeLine') && pointValue === 0 && !bet.working) {
          odds = bet.odds
        }

        payouts = {
          ...payouts,
          [type]: {
            ...bet,
            amount: 0,
            odds,
          },
        }
        delete newBetMap[type]
      } else if (payout > 0) {
        if (type.includes('lineComeLine') && pointValue > 0) {
          if (hasComeLineBet && rollValue !== 7) {
            odds = bet.odds * lineBetOdds[pointValue]
          } else {
            amount = bet.amount + bet.amount * payout
            odds = bet.odds + bet.odds * lineBetOdds[pointValue]
            delete newBetMap[type]
          }
        } else if (type.includes('lineDontComeLine') && pointValue > 0) {
          const linePoint = type.replace('lineDontComeLine', '')
          if (!linePoint) {
            amount = bet.amount * payout
          } else {
            amount = bet.amount + bet.amount * payout
            odds = bet.odds + bet.odds * dontLineBetOdds[Number(linePoint)]
            delete newBetMap[type]
          }
        } else if (type.includes('lineDontPassLine') && pointValue > 0) {
          odds = bet.odds + bet.odds * dontLineBetOdds[pointValue]
          newBetMap = {
            ...newBetMap,
            lineDontPassLine: {
              ...bet,
              odds: 0,
            },
          }
          delete newBetMap[type]
        } else if (type.includes('linePassLine') && pointValue > 0) {
          amount = bet.amount * payout
          odds = bet.odds + bet.odds * lineBetOdds[pointValue]

          newBetMap = {
            ...newBetMap,
            linePassLine: {
              ...bet,
              odds: 0,
            },
          }
          delete newBetMap[type]
        }
        payouts = {
          ...payouts,
          [type]: {
            ...bet,
            amount: isBubbleCraps ? Math.floor(amount * 100) / 100 : Math.floor(amount),
            odds: isBubbleCraps ? Math.floor(odds * 100) / 100 : Math.floor(odds),
          },
        }
        if (type === 'centerAll' || type === 'centerSmall' || type === 'centerTall') {
          const { rollValues } = bet as IATSBet
          newBetMap = {
            ...newBetMap,
            [type]: {
              ...bet,
              rollValues: [],
            },
          }
          payouts = {
            ...payouts,
            [type]: {
              ...payouts[type],
              rollValues: [...rollValues, rollValue],
            },
          }
        }
      } else {
        if (type === 'centerAll' || type === 'centerSmall' || type === 'centerTall') {
          const { rollValues } = bet as IATSBet
          if (rollValues.indexOf(rollValue) < 0) {
            newBetMap = {
              ...newBetMap,
              [type]: {
                ...bet,
                rollValues: [...rollValues, rollValue],
              },
            }
          }
        }
        if (
          lineRolls.indexOf(type) > -1 &&
          !((type === 'lineDontPassLine' || type === 'lineDontComeLine') && rollValue === 12)
        ) {
          const existingComeBet = newBetMap[`${type}${rollValue}` as keyof IBetMap] as Partial<IBaseBet>
          if (existingComeBet !== undefined) {
            newBetMap = {
              ...newBetMap,
              [type]: {
                ...bet,
                odds: 0,
              },
            }
          } else {
            newBetMap = {
              ...newBetMap,
              [`${type}${rollValue}`]: bet,
            }
            delete newBetMap[type]
          }
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
    const type = comeLines[i]
    resolveByType(type as keyof IBetMap)
  }
  const payoutKeys = Object.keys(payouts) as (keyof IBetMap)[]
  let delta = 0

  payoutKeys.forEach((key) => {
    let betValue = 0
    if (betMap[key]) {
      betValue = (betMap[key]?.amount ?? 0) + (betMap[key]?.odds ?? 0)
    }

    let payoutValue = 0
    if (payouts[key]) {
      payoutValue = (payouts[key]?.amount ?? 0) + (payouts[key]?.odds ?? 0)
    }

    if (payoutValue === 0) {
      delta -= betValue
    } else {
      delta += payoutValue
    }
  })
  return { betMap: newBetMap, payouts, delta }
}

export const resolvePointValue = (roll: DiceRoll, pointValue: number): TableState => {
  const rollValue = getRollValue(roll)
  let newPointValue = pointValue
  let sevenOut = false
  let pointHit = false
  if (pointValue === 0 && isValidPoint(roll)) {
    newPointValue = rollValue
  } else if (pointValue !== 0 && getRollValue(roll) === 7) {
    newPointValue = 0
    sevenOut = true
  } else if (pointValue !== 0 && getRollValue(roll) === pointValue) {
    newPointValue = 0
    pointHit = true
  }
  return {
    pointValue: newPointValue,
    dice: roll,
    sevenOut,
    pointHit,
  }
}
