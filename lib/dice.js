export const validPoints = [4, 5, 6, 8, 9, 10];
export const diceValues = {
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
};
export const rollDice = () => {
    const randomRoll = () => Math.floor(Math.random() * 6) + 1;
    const die1 = randomRoll();
    const die2 = randomRoll();
    return [die1, die2];
};
export const sortRollValues = (diceRoll) => {
    const die1 = diceRoll[0];
    const die2 = diceRoll[1];
    if (die1 < die2) {
        return [die2, die1];
    }
    else {
        return diceRoll;
    }
};
export const getRollValue = (roll) => {
    return roll[0] + roll[1];
};
export const isValidPoint = (roll, points = validPoints) => {
    return points.indexOf(getRollValue(roll)) > -1;
};
export const getRolls = (rollValues, excluded = []) => {
    const allRolls = rollValues.reduce((acc, value) => {
        return [...acc, ...diceValues[value]];
    }, []);
    const cleanedExcluded = excluded.map((roll) => sortRollValues(roll).toString());
    return allRolls.filter((roll) => cleanedExcluded.indexOf(roll.toString()) == -1);
};
//# sourceMappingURL=dice.js.map