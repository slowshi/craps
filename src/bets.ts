import { sortRollValues } from './dice'

export interface IBaseBet {
  amount: number
  odds: number
  working: boolean
  vig: number
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
  centerAny7: IBaseBet
  centerHorn: IBaseBet
  centerHop: IBaseBet
  centerHard4: IBaseBet
  centerHard6: IBaseBet
  centerHard8: IBaseBet
  centerHard10: IBaseBet
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
  vig: 0,
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

export const isValidBet = (
  betMap: Partial<IBetMap>,
  betKey: string,
  bet: Partial<IBaseBet>,
  pointValue: number,
): boolean => {
  const currentBet = betMap[betKey as keyof IBetMap]
  if (!currentBet && bet.odds) {
    //cant make odds bets without amount
    return false
  }
  if (bet.odds && pointValue === 0) {
    //cant make odds bets without valid point
    return false
  }
  if ((betKey.includes('linePassLine') || betKey.includes('lineDontPassLine')) && pointValue > 0) {
    //line bets with odds ok
    if (bet.odds) {
      return true
    }
    //cant make line bets with valid point
    return false
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
