import { sortRollValues } from './dice';
export const lineRolls = ['linePassLine', 'lineDontPassLine', 'lineComeLine', 'lineDontComeLine'];
export const baseBetDefaults = {
    amount: 0,
    odds: 0,
    working: false,
    off: false,
};
export const updateBetMap = (betMap, betKey, bet) => {
    return {
        ...betMap,
        [betKey]: bet,
    };
};
export const moveLineBet = (betMap, lineKey, pointValue) => {
    if ((lineKey === 'lineDontPassLine' || lineKey === 'lineDontComeLine') && pointValue === 12) {
        return betMap;
    }
    const currentBet = betMap[lineKey];
    if (currentBet) {
        const newBetMap = updateBetMap(betMap, `${lineKey}${pointValue}`, currentBet);
        delete newBetMap[lineKey];
        return newBetMap;
    }
    return betMap;
};
export const isValidBet = (betMap, betKey, bet, pointValue) => {
    const currentBet = betMap[betKey];
    if (!currentBet && bet.odds) {
        //cant make odds bets without amount
        return false;
    }
    if (bet.odds && pointValue === 0) {
        //cant make odds bets without valid point
        return false;
    }
    if ((betKey.includes('linePassLine') || betKey.includes('lineDontPassLine')) && pointValue > 0) {
        //line bets with odds ok
        if (bet.odds) {
            return true;
        }
        //cant make line bets with valid point
        return false;
    }
    return true;
};
export const isEmptyBet = (bet) => {
    return bet.amount === 0 && bet.odds === 0;
};
export const getBetPayByRoll = (roll, resolves) => {
    const resolve = resolves.filter((resolveBet) => {
        const sortedDiceRoll = sortRollValues(roll);
        return resolveBet.rolls.find((diceRoll) => {
            return sortedDiceRoll[0] === diceRoll[0] && sortedDiceRoll[1] === diceRoll[1];
        });
    });
    if (resolve.length > 0) {
        return resolve[0].pay;
    }
    return 0;
};
//# sourceMappingURL=bets.js.map