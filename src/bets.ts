import { DiceRoll, sortRollValues } from './dice'
export type LineKey = 'linePassLine' | 'lineDontPassLine' | 'lineComeLine' | 'lineDontComeLine'
export const lineRolls = ['linePassLine', 'lineDontPassLine', 'lineComeLine', 'lineDontComeLine']

export interface IBaseBet {
  amount: number
  odds: number
  working: boolean
  off: boolean
}

export interface IBetMap {
  linePassLine: IBaseBet
  linePassLine4: IBaseBet
  linePassLine5: IBaseBet
  linePassLine6: IBaseBet
  linePassLine8: IBaseBet
  linePassLine9: IBaseBet
  linePassLine10: IBaseBet
  lineDontPassLine: IBaseBet
  lineDontPassLine4: IBaseBet
  lineDontPassLine5: IBaseBet
  lineDontPassLine6: IBaseBet
  lineDontPassLine8: IBaseBet
  lineDontPassLine9: IBaseBet
  lineDontPassLine10: IBaseBet
  lineComeLine: IBaseBet
  lineComeLine4: IBaseBet
  lineComeLine5: IBaseBet
  lineComeLine6: IBaseBet
  lineComeLine8: IBaseBet
  lineComeLine9: IBaseBet
  lineComeLine10: IBaseBet
  lineDontComeLine: IBaseBet
  lineDontComeLine4: IBaseBet
  lineDontComeLine5: IBaseBet
  lineDontComeLine6: IBaseBet
  lineDontComeLine8: IBaseBet
  lineDontComeLine9: IBaseBet
  lineDontComeLine10: IBaseBet
  centerField: IBaseBet
  centerAnyCraps: IBaseBet
  center7: IBaseBet
  center12: IBaseBet
  center11: IBaseBet
  center3: IBaseBet
  center2: IBaseBet
  centerHop: IBaseBet
  centerHard4: IBaseBet
  centerHard6: IBaseBet
  centerHard8: IBaseBet
  centerHard10: IBaseBet
  centerHop64: IBaseBet
  centerHop63: IBaseBet
  centerHop62: IBaseBet
  centerHop61: IBaseBet
  centerHop55: IBaseBet
  centerHop54: IBaseBet
  centerHop53: IBaseBet
  centerHop52: IBaseBet
  centerHop51: IBaseBet
  centerHop44: IBaseBet
  centerHop43: IBaseBet
  centerHop42: IBaseBet
  centerHop41: IBaseBet
  centerHop33: IBaseBet
  centerHop32: IBaseBet
  centerHop31: IBaseBet
  centerHop22: IBaseBet
  numbersPlace4: IBaseBet
  numbersPlace5: IBaseBet
  numbersPlace6: IBaseBet
  numbersPlace8: IBaseBet
  numbersPlace9: IBaseBet
  numbersPlace10: IBaseBet
  numbersBuy4: IBaseBet
  numbersBuy5: IBaseBet
  numbersBuy6: IBaseBet
  numbersBuy8: IBaseBet
  numbersBuy9: IBaseBet
  numbersBuy10: IBaseBet
  numbersLay4: IBaseBet
  numbersLay5: IBaseBet
  numbersLay6: IBaseBet
  numbersLay8: IBaseBet
  numbersLay9: IBaseBet
  numbersLay10: IBaseBet
}

export const baseBetDefaults: IBaseBet = {
  amount: 0,
  odds: 0,
  working: false,
  off: false,
}

export interface IBetResolves {
  rolls: DiceRoll[]
  pay: number
}

export const updateBetMap = (betMap: Partial<IBetMap>, betKey: keyof IBetMap, bet: IBaseBet): Partial<IBetMap> => {
  return {
    ...betMap,
    [betKey]: bet,
  }
}

export const moveLineBet = (betMap: Partial<IBetMap>, lineKey: LineKey, pointValue: number): Partial<IBetMap> => {
  if ((lineKey === 'lineDontPassLine' || lineKey === 'lineDontComeLine') && pointValue === 12) {
    return betMap
  }
  const currentBet = betMap[lineKey]
  if (currentBet) {
    const newBetMap = updateBetMap(betMap, `${lineKey}${pointValue}` as keyof IBetMap, currentBet)
    delete newBetMap[lineKey]
    return newBetMap
  }
  return betMap
}
export const passLineBetValidation = (
  currentBet: Partial<IBaseBet>,
  incomingBet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  if (pointValue === 0) {
    if (incomingBet.odds && incomingBet.odds !== 0) return false
  } else {
    return false
  }
  return true
}

export const passLinePointValidation = (
  currentBet: Partial<IBaseBet>,
  incomingBet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  if (pointValue > 0) {
    //cannot make new line contract with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
    //cannot add odds if there is no current bet
    if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
    //cannot reduce pass line bet with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount < 0) return false
  } else {
    return false
  }
  return true
}
export const dontPassLinePointValidation = (
  currentBet: Partial<IBaseBet>,
  incomingBet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  if (pointValue > 0) {
    //cannot make new line contract with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
    //cannot add odds if there is no current bet
    if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
    //cannot increase dont line bet with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount > 0) return false
  } else {
    return false
  }
  return true
}
export const comeLineBetValidation = (
  currentBet: Partial<IBaseBet>,
  incomingBet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  //cannot make come bet with point off
  if (pointValue === 0) {
    return false
  } else {
    //cannot add odds if there is no current bet
    if (incomingBet.odds && incomingBet.odds !== 0) return false
  }
  return true
}

export const comeLinePointValidation = (currentBet: Partial<IBaseBet>, incomingBet: Partial<IBaseBet>): boolean => {
  //cannot make new line contract with puck on
  if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
  //cannot add odds if there is no current bet
  if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
  //cannot reduce come line contract
  if (incomingBet.amount !== undefined && incomingBet.amount < 0) return false
  return true
}
export const dontComeLinePointValidation = (currentBet: Partial<IBaseBet>, incomingBet: Partial<IBaseBet>): boolean => {
  //cannot make new line contract with puck on
  if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
  //cannot add odds if there is no current bet
  if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
  //cannot increase dont come line contract
  if (incomingBet.amount !== undefined && incomingBet.amount > 0) return false
  return true
}
export const centerBetValidation = (currentBet: Partial<IBaseBet>, incomingBet: Partial<IBaseBet>): boolean => {
  if (incomingBet.odds && incomingBet.odds !== 0) return false
  if (incomingBet.off) return false
  if (incomingBet.working) return false

  return true
}

export const numbersBetValidation = (currentBet: Partial<IBaseBet>, incomingBet: Partial<IBaseBet>): boolean => {
  if (incomingBet.odds && incomingBet.odds !== 0) return false

  return true
}
export const isValidBet = (
  betMap: Partial<IBetMap>,
  betKey: string,
  bet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  const currentBet = betMap[betKey as keyof IBetMap] || {}
  if (betKey === 'linePassLine' || betKey === 'lineDontPassLine') {
    return passLineBetValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('linePassLine')) {
    return passLinePointValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('lineDontPassLine')) {
    return dontPassLinePointValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('lineComeLine')) {
    return comeLinePointValidation(currentBet, bet)
  }
  if (betKey.includes('lineDontComeLine')) {
    return dontComeLinePointValidation(currentBet, bet)
  }
  if (betKey.includes('center')) {
    return centerBetValidation(currentBet, bet)
  }
  if (betKey.includes('numbers')) {
    return numbersBetValidation(currentBet, bet)
  }

  return true
}

export const isEmptyBet = (bet: IBaseBet): boolean => {
  return bet.amount === 0 && bet.odds === 0
}

export const getBetPayByRoll = (roll: DiceRoll, resolves: IBetResolves[]): number => {
  const resolve = resolves.filter((resolveBet) => {
    const sortedDiceRoll = sortRollValues(roll)
    return resolveBet.rolls.find((diceRoll) => {
      return sortedDiceRoll[0] === diceRoll[0] && sortedDiceRoll[1] === diceRoll[1]
    })
  })
  if (resolve.length > 0) {
    return resolve[0].pay
  }
  return 0
}
