import { IBaseBet, IBetMap } from './bets'
import { GameState, resolveBets, resolveMakeBet, resolvePointValue } from './game'
import { DiceRoll, rollDice } from './dice'

export function CrapsGame(map: IBetMap<Partial>, gameState?: GameState) {
  let betMap: IBetMap<Partial> = map
  let pointValue: number = 0
  let dice: DiceRoll = [3, 4]
  const rollHistory: DiceRoll[][] = []
  let currentShooter: DiceRoll[] = []
  if (typeof gameState !== 'undefined') {
    pointValue = gameState.pointValue
    dice = gameState.dice
  }

  this.rollDice = (): DiceRoll => {
    const newRoll = rollDice()
    const newState = resolvePointValue(newRoll, pointValue)
    currentShooter.push(newRoll)
    if (newState.sevenOut) {
      rollHistory.push(currentShooter)
      currentShooter = []
    }
    const newBets = resolveBets(betMap, newRoll, pointValue)
    // console.log(newBets)
    betMap = { ...newBets }

    pointValue = newState.pointValue
    dice = newRoll
    return newState
  }

  this.makeBet = (betKey: keyof IBetMap, bet: IBaseBet) => {
    //validate move
    //update betmap
    const newBets = resolveMakeBet(betMap, betKey, bet)
    betMap = { ...newBets }
    // console.log('makeBet')
  }

  this.removeBet = () => {
    //validate move
    //update betmap
  }

  this.getBets = (): IBetMap<Partial> => {
    return { ...betMap }
  }

  this.getRollHistory = (): DiceRoll[][] => {
    return [...rollHistory]
  }
  this.getCurrentShooter = (): DiceRoll[] => {
    return [...currentShooter]
  }
  this.getDice = (): DiceRoll => {
    return [...dice]
  }
  // return (betMap, pointValue) => {
  //   console.log(betMap, pointValue)
  // }
}
