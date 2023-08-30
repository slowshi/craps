export type Dice6 = 1 | 2 | 3 | 4 | 5 | 6
export type DiceRoll = [Dice6, Dice6]
export type RollValues = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export const validPoints = [4, 5, 6, 8, 9, 10]
export const diceValues: { [roll: number]: DiceRoll[] } = {
  2: [[1, 1]],
  3: [[2, 1]],
  4: [
    [2, 2],
    [3, 1],
  ],
  5: [
    [4, 1],
    [3, 2],
  ],
  6: [
    [5, 1],
    [4, 2],
    [3, 3],
  ],
  7: [
    [6, 1],
    [5, 2],
    [4, 3],
  ],
  8: [
    [6, 2],
    [5, 3],
    [4, 4],
  ],
  9: [
    [6, 3],
    [5, 4],
  ],
  10: [
    [6, 4],
    [5, 5],
  ],
  11: [[6, 5]],
  12: [[6, 6]],
}

export const rollDice = (): DiceRoll => {
  const randomRoll = () => Math.floor(Math.random() * 6) + 1
  const die1 = randomRoll() as Dice6
  const die2 = randomRoll() as Dice6
  return [die1, die2]
}

export const sortRollValues = (diceRoll: DiceRoll): DiceRoll => {
  const die1 = diceRoll[0]
  const die2 = diceRoll[1]
  if (die1 < die2) {
    return [die2, die1]
  } else {
    return diceRoll
  }
}

export const getRollValue = (roll: DiceRoll): number => {
  return roll[0] + roll[1]
}

export const isValidPoint = (roll: DiceRoll, points = validPoints): boolean => {
  return points.indexOf(getRollValue(roll)) > -1
}

export const getRolls = (rollValues: number[], excluded: DiceRoll[] = []): DiceRoll[] => {
  const allRolls = rollValues.reduce((acc, value) => {
    return [...acc, ...diceValues[value]]
  }, [] as DiceRoll[])
  const cleanedExcluded = excluded.map((roll) => sortRollValues(roll).toString())
  return allRolls.filter((roll) => cleanedExcluded.indexOf(roll.toString()) === -1)
}
