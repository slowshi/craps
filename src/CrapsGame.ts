import { IBaseBet, IBetMap, isValidBet } from './bets'
import { BetResults, resolveBets, resolveMakeBet, resolvePointValue, TableState } from './game'
import { DiceRoll, rollDice as diceRollDice } from './dice'
export type GameState = {
  tableState: TableState
  betResults: BetResults
}
export type CrapsGameInstance = {
  rollDice: () => DiceRoll
  makeBet: (betKey: keyof IBetMap, bet: IBaseBet) => void
  turnOffBets: (betKeys: (keyof IBetMap)[]) => void
  turnOnBets: (betKeys: (keyof IBetMap)[]) => void
  betsWorking: (betKeys: (keyof IBetMap)[]) => void
  betsNotWorking: (betKeys: (keyof IBetMap)[]) => void
  getBets: () => Partial<IBetMap>
  getGameHistory: () => GameState[]
  getDice: () => DiceRoll
}

export function createCrapsGame(map: Partial<IBetMap>, tableState?: TableState): CrapsGameInstance {
  let betMap: Partial<IBetMap> = map
  let pointValue: number = 0
  let dice: DiceRoll = [3, 4]
  const gameHistory: GameState[] = []
  if (typeof tableState !== 'undefined') {
    pointValue = tableState.pointValue
    dice = tableState.dice
  }
  const rollDice = (): DiceRoll => {
    const newRoll = diceRollDice()
    const newState = resolvePointValue(newRoll, pointValue)
    const newResults = resolveBets(betMap, newRoll, pointValue)
    gameHistory.push({
      tableState: newState,
      betResults: newResults,
    })

    betMap = { ...newResults.betMap }
    pointValue = newState.pointValue
    dice = newRoll
    return newRoll
  }

  const makeBet = (betKey: keyof IBetMap, bet: IBaseBet): void => {
    if (!isValidBet(betMap, betKey, bet, pointValue)) return
    const newBets = resolveMakeBet(betMap, betKey, bet)
    betMap = { ...newBets }
  }

  const turnOffBets = (betKeys: (keyof IBetMap)[]): void => {
    let newBetMap = { ...betMap }
    betKeys.forEach((key) => {
      if (newBetMap[key]) {
        newBetMap = {
          ...newBetMap,
          [key]: {
            ...newBetMap[key],
            off: true,
          },
        }
      }
    })
  }

  const turnOnBets = (betKeys: (keyof IBetMap)[]): void => {
    let newBetMap = { ...betMap }
    betKeys.forEach((key) => {
      if (newBetMap[key]) {
        newBetMap = {
          ...newBetMap,
          [key]: {
            ...newBetMap[key],
            off: false,
          },
        }
      }
    })
  }

  const betsWorking = (betKeys: (keyof IBetMap)[]): void => {
    let newBetMap = { ...betMap }
    betKeys.forEach((key) => {
      if (newBetMap[key]) {
        newBetMap = {
          ...newBetMap,
          [key]: {
            ...newBetMap[key],
            working: true,
          },
        }
      }
    })
  }

  const betsNotWorking = (betKeys: (keyof IBetMap)[]): void => {
    let newBetMap = { ...betMap }
    betKeys.forEach((key) => {
      if (newBetMap[key]) {
        newBetMap = {
          ...newBetMap,
          [key]: {
            ...newBetMap[key],
            working: false,
          },
        }
      }
    })
  }

  const getBets = (): Partial<IBetMap> => {
    return { ...betMap }
  }

  const getGameHistory = (): GameState[] => {
    return [...gameHistory]
  }

  const getDice = (): DiceRoll => {
    return [...dice]
  }

  return {
    rollDice,
    makeBet,
    turnOffBets,
    turnOnBets,
    betsWorking,
    betsNotWorking,
    getBets,
    getGameHistory,
    getDice,
  }
}
