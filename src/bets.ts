import { betResolvesMap } from './betTypes'
import { DiceRoll, sortRollValues } from './dice'
export type LineKey = 'linePassLine' | 'lineDontPassLine' | 'lineComeLine' | 'lineDontComeLine'
export const lineRolls = ['linePassLine', 'lineDontPassLine', 'lineComeLine', 'lineDontComeLine']

export interface IATSBet {
  amount: number
  rollValues: number[]
  odds: number
  working: boolean
  off: boolean
}

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
  centerAll: IATSBet
  centerSmall: IATSBet
  centerTall: IATSBet
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

export const tableOddsMultiples: { [key: number]: number } = {
  4: 3,
  5: 4,
  6: 5,
  8: 5,
  9: 4,
  10: 3,
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
  const existingComeBet: IBaseBet | undefined = betMap[`${lineKey}${pointValue}` as keyof IBetMap]
  const currentBet = betMap[lineKey]
  if (currentBet) {
    if (existingComeBet !== undefined) {
      return {
        ...betMap,
        [lineKey]: {
          ...currentBet,
          odds: 0,
        },
      }
    } else {
      const newBetMap = {
        ...betMap,
        [`${lineKey}${pointValue}`]: currentBet,
      }
      delete newBetMap[lineKey]
      return newBetMap
    }
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
    //cannot add more odds than max
    if (
      incomingBet.odds !== undefined &&
      currentBet.odds !== undefined &&
      currentBet.amount !== undefined &&
      incomingBet.odds > 0 &&
      currentBet.odds + incomingBet.odds > currentBet.amount * tableOddsMultiples[pointValue]
    )
      return false
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
    if (incomingBet.odds !== undefined && incomingBet.odds !== 0 && !currentBet?.amount) return false
    //cannot add more odds than the amount 6x
    if (
      incomingBet.odds !== undefined &&
      currentBet.amount !== undefined &&
      currentBet.odds !== undefined &&
      incomingBet.odds > 0 &&
      currentBet.odds + incomingBet.odds > currentBet.amount * 6
    )
      return false
    //cannot remove amount where odds where new amount is greater than max odds
    if (
      incomingBet.amount !== undefined &&
      currentBet.amount !== undefined &&
      currentBet.odds !== undefined &&
      incomingBet.amount < 0 &&
      currentBet.odds > (currentBet.amount + incomingBet.amount) * 6
    )
      return false
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

export const comeLinePointValidation = (
  currentBet: Partial<IBaseBet>,
  incomingBet: Partial<IBaseBet>,
  betKey: string,
): boolean => {
  //cannot make new line contract with puck on
  if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
  //cannot add odds if there is no current bet
  if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
  //cannot add more odds than max
  const pointValue = betKey.replace('lineComeLine', '')
  if (
    incomingBet.odds !== undefined &&
    currentBet.odds !== undefined &&
    currentBet.amount !== undefined &&
    incomingBet.odds > 0 &&
    currentBet.odds + incomingBet.odds > currentBet.amount * tableOddsMultiples[Number(pointValue)]
  )
    return false
  //cannot reduce come line contract
  if (incomingBet.amount !== undefined && incomingBet.amount < 0) return false
  return true
}
export const dontComeLinePointValidation = (currentBet: Partial<IBaseBet>, incomingBet: Partial<IBaseBet>): boolean => {
  //cannot make new line contract with puck on
  if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount) return false
  //cannot add odds if there is no current bet
  if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount) return false
  //cannot add more odds than the amount 6x
  if (
    incomingBet.odds !== undefined &&
    currentBet.odds !== undefined &&
    currentBet.amount !== undefined &&
    incomingBet.odds > 0 &&
    currentBet.odds + incomingBet.odds > currentBet.amount * 6
  )
    return false
  //cannot remove amount where odds where new amount is greater than max odds
  if (
    incomingBet.amount !== undefined &&
    currentBet.amount !== undefined &&
    incomingBet.amount < 0 &&
    currentBet.odds &&
    currentBet.odds > (currentBet.amount + incomingBet.amount) * 6
  )
    return false
  //cannot increase dont come line contract
  if (incomingBet.amount !== undefined && incomingBet.amount > 0) return false
  return true
}
export const centerATSValidation = (
  currentBet: Partial<IATSBet>,
  incomingBet: Partial<IATSBet>,
  betMap: Partial<IBetMap>,
  betKey: string,
): boolean => {
  if (incomingBet.odds && incomingBet.odds !== 0) return false
  if (incomingBet.off) return false
  if (incomingBet.working) return false
  // if (betKey === 'centerSmall' || betKey === 'centerTall') {
  //   return true
  // }
  //cannot
  //cannot make new ATS bet when rolls have started
  if (incomingBet.amount && incomingBet.amount !== 0 && currentBet.rollValues && currentBet.rollValues.length > 0)
    return false
  if (betKey === 'centerSmall') {
    const smallBets = [2, 3, 4, 5, 6]
    if (betMap['centerAll'] && betMap['centerAll'].rollValues && betMap['centerAll'].rollValues.length) {
      const valuesLeft = smallBets.filter((num) => betMap['centerAll']?.rollValues.indexOf(num) === -1)
      if (valuesLeft.length === 0) return true
      return false
    }
    if (betMap['centerTall'] && betMap['centerTall'].rollValues && betMap['centerTall'].rollValues.length) {
      const valuesLeft = smallBets.filter((num) => betMap['centerAll']?.rollValues.indexOf(num) === -1)
      if (valuesLeft.length === 0) return true
      return false
    }
  }
  if (betKey === 'centerTall') {
    const tallBets = [8, 9, 10, 11, 12]
    if (betMap['centerAll'] && betMap['centerAll'].rollValues && betMap['centerAll'].rollValues.length) {
      const valuesLeft = tallBets.filter((num) => betMap['centerAll']?.rollValues.indexOf(num) === -1)
      if (valuesLeft.length === 0) return true
      return false
    }
    if (betMap['centerSmall'] && betMap['centerSmall'].rollValues && betMap['centerSmall'].rollValues.length) {
      const valuesLeft = tallBets.filter((num) => betMap['centerSmall']?.rollValues.indexOf(num) === -1)
      if (valuesLeft.length === 0) return true
      return false
    }
  }
  if (betKey === 'centerAll') {
    if (betMap['centerTall'] && betMap['centerTall'].rollValues && betMap['centerTall'].rollValues.length) {
      if (currentBet.rollValues?.length === 0) return true
      return false
    }
    if (betMap['centerSmall'] && betMap['centerSmall'].rollValues && betMap['centerSmall'].rollValues.length) {
      if (currentBet.rollValues?.length === 0) return true
      return false
    }
  }
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

const betKeys = Object.keys(betResolvesMap)
export const isValidBet = (
  betMap: Partial<IBetMap>,
  betKey: string,
  bet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  if (betKeys.indexOf(betKey) < 0) return false
  const currentBet = betMap[betKey as keyof IBetMap] || {}
  if (betKey === 'linePassLine' || (betKey === 'lineDontPassLine' && pointValue === 0)) {
    return passLineBetValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('linePassLine')) {
    return passLinePointValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('lineDontPassLine')) {
    return dontPassLinePointValidation(currentBet, bet, pointValue)
  }
  if (betKey === 'lineComeLine' || betKey === 'lineDontComeLine') {
    return comeLineBetValidation(currentBet, bet, pointValue)
  }
  if (betKey.includes('lineComeLine')) {
    return comeLinePointValidation(currentBet, bet, betKey)
  }
  if (betKey.includes('lineDontComeLine')) {
    return dontComeLinePointValidation(currentBet, bet)
  }
  if (betKey === 'centerAll' || betKey === 'centerSmall' || betKey === 'centerTall') {
    return centerATSValidation(currentBet, bet, betMap, betKey)
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
