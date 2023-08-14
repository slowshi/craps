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
export const passLineBetValidation = (currentBet, incomingBet, pointValue) => {
    if (pointValue === 0) {
        if (incomingBet.odds && incomingBet.odds !== 0)
            return false;
    }
    else {
        return false;
    }
    return true;
};
export const passLinePointValidation = (currentBet, incomingBet, pointValue) => {
    if (pointValue > 0) {
        //cannot make new line contract with puck on
        if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount)
            return false;
        //cannot add odds if there is no current bet
        if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount)
            return false;
        //cannot reduce pass line bet with puck on
        if (incomingBet.amount !== undefined && incomingBet.amount < 0)
            return false;
    }
    else {
        return false;
    }
    return true;
};
export const dontPassLinePointValidation = (currentBet, incomingBet, pointValue) => {
    if (pointValue > 0) {
        //cannot make new line contract with puck on
        if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount)
            return false;
        //cannot add odds if there is no current bet
        if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount)
            return false;
        //cannot increase dont line bet with puck on
        if (incomingBet.amount !== undefined && incomingBet.amount > 0)
            return false;
    }
    else {
        return false;
    }
    return true;
};
export const comeLineBetValidation = (currentBet, incomingBet, pointValue) => {
    //cannot make come bet with point off
    if (pointValue === 0) {
        return false;
    }
    else {
        //cannot add odds if there is no current bet
        if (incomingBet.odds && incomingBet.odds !== 0)
            return false;
    }
    return true;
};
export const comeLinePointValidation = (currentBet, incomingBet) => {
    //cannot make new line contract with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount)
        return false;
    //cannot add odds if there is no current bet
    if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount)
        return false;
    //cannot reduce come line contract
    if (incomingBet.amount !== undefined && incomingBet.amount < 0)
        return false;
    return true;
};
export const dontComeLinePointValidation = (currentBet, incomingBet) => {
    //cannot make new line contract with puck on
    if (incomingBet.amount !== undefined && incomingBet.amount > 0 && !currentBet?.amount)
        return false;
    //cannot add odds if there is no current bet
    if (incomingBet.odds && incomingBet.odds !== 0 && !currentBet?.amount)
        return false;
    //cannot increase dont come line contract
    if (incomingBet.amount !== undefined && incomingBet.amount > 0)
        return false;
    return true;
};
export const centerBetValidation = (currentBet, incomingBet) => {
    if (incomingBet.odds && incomingBet.odds !== 0)
        return false;
    if (incomingBet.off)
        return false;
    if (incomingBet.working)
        return false;
    return true;
};
export const numbersBetValidation = (currentBet, incomingBet) => {
    if (incomingBet.odds && incomingBet.odds !== 0)
        return false;
    return true;
};
export const isValidBet = (betMap, betKey, bet, pointValue) => {
    const currentBet = betMap[betKey] || {};
    if (betKey === 'linePassLine' || betKey === 'lineDontPassLine') {
        return passLineBetValidation(currentBet, bet, pointValue);
    }
    if (betKey.includes('linePassLine')) {
        return passLinePointValidation(currentBet, bet, pointValue);
    }
    if (betKey.includes('lineDontPassLine')) {
        return dontPassLinePointValidation(currentBet, bet, pointValue);
    }
    if (betKey.includes('lineComeLine')) {
        return comeLinePointValidation(currentBet, bet);
    }
    if (betKey.includes('lineDontComeLine')) {
        return dontComeLinePointValidation(currentBet, bet);
    }
    if (betKey.includes('center')) {
        return centerBetValidation(currentBet, bet);
    }
    if (betKey.includes('numbers')) {
        return numbersBetValidation(currentBet, bet);
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