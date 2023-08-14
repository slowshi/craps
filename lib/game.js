import { getRollValue, isValidPoint } from './dice';
import { moveLineBet, updateBetMap, isEmptyBet, getBetPayByRoll, baseBetDefaults, lineRolls, } from './bets';
import { betResolvesMap, lineBetOdds, dontLineBetOdds } from './betTypes';
export const resolveMakeBet = (betMap, betKey, bet) => {
    const currentBet = betMap[betKey];
    let newBetMap = { ...betMap };
    if (currentBet) {
        const betAmount = bet.amount ? bet.amount : 0;
        const betOdds = bet.odds ? bet.odds : 0;
        const betWorking = bet.working ? bet.working : currentBet.working;
        const betOff = bet.off ? bet.off : currentBet.off;
        const newBet = {
            ...baseBetDefaults,
            working: betWorking,
            off: betOff,
            amount: Math.max(currentBet.amount + betAmount, 0),
            odds: Math.max(currentBet.odds + betOdds, 0),
        };
        if (isEmptyBet(newBet)) {
            delete newBetMap[betKey];
        }
        else {
            newBetMap = updateBetMap(betMap, betKey, newBet);
        }
    }
    else {
        const betAmount = bet.amount ? bet.amount : baseBetDefaults.amount;
        const betOdds = bet.odds ? bet.odds : baseBetDefaults.odds;
        const betWorking = bet.working ? bet.working : baseBetDefaults.working;
        const betOff = bet.off ? bet.off : baseBetDefaults.off;
        const newBet = {
            ...baseBetDefaults,
            working: betWorking,
            off: betOff,
            amount: Math.max(betAmount, 0),
            odds: Math.max(betOdds, 0),
        };
        if (!isEmptyBet(newBet)) {
            newBetMap = updateBetMap(betMap, betKey, newBet);
        }
    }
    return newBetMap;
};
export const resolveBets = (betMap, roll, pointValue) => {
    const rollValue = getRollValue(roll);
    let payouts = {};
    let newBetMap = { ...betMap };
    const betTypes = Object.keys(newBetMap);
    const comeLines = [];
    const resolveByType = (type) => {
        const bet = newBetMap[type];
        if (bet) {
            if (bet.off)
                return;
            if (type.includes('number') && pointValue === 0 && !bet.working)
                return;
            const resolves = betResolvesMap[type];
            const payout = getBetPayByRoll(roll, resolves);
            let odds = 0;
            if (payout !== 0) {
                if (type.includes('lineComeLine')) {
                    if (pointValue === 0 && payout < 0 && !bet.working) {
                        odds = bet.odds;
                    }
                    else if (pointValue > 0 && payout > 0) {
                        odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue]);
                    }
                }
                if ((type.includes('lineDontPassLine') || type.includes('lineDontComeLine')) && payout > 0 && pointValue > 0) {
                    odds = Math.floor(bet.odds + bet.odds * dontLineBetOdds[pointValue]);
                }
                if (type.includes('linePassLine') && payout > 0 && pointValue > 0) {
                    odds = Math.floor(bet.odds + bet.odds * lineBetOdds[pointValue]);
                }
                payouts = {
                    ...payouts,
                    [type]: {
                        ...bet,
                        amount: bet.amount + bet.amount * payout,
                        odds,
                    },
                };
                delete newBetMap[type];
            }
            else {
                if (lineRolls.indexOf(type) > -1) {
                    newBetMap = moveLineBet(betMap, type, rollValue);
                }
            }
        }
    };
    for (let i = 0; i < betTypes.length; i++) {
        const type = betTypes[i];
        if (type === 'lineComeLine') {
            comeLines.push(type);
            continue;
        }
        resolveByType(type);
    }
    for (let i = 0; i < comeLines.length; i++) {
        const type = betTypes[i];
        resolveByType(type);
    }
    return { betMap: newBetMap, payouts };
};
export const resolvePointValue = (roll, pointValue) => {
    const rollValue = getRollValue(roll);
    let newPointValue = pointValue;
    let sevenOut = false;
    let pointHit = false;
    if (pointValue === 0 && isValidPoint(roll)) {
        newPointValue = rollValue;
    }
    else if (pointValue !== 0 && getRollValue(roll) === 7) {
        newPointValue = 0;
        sevenOut = true;
    }
    else if (pointValue !== 0 && getRollValue(roll) === pointValue) {
        newPointValue = 0;
        pointHit = true;
    }
    return {
        pointValue: newPointValue,
        dice: roll,
        sevenOut,
        pointHit,
    };
};
//# sourceMappingURL=game.js.map