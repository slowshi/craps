import { isValidBet } from './bets';
import { resolveBets, resolveMakeBet, resolvePointValue } from './game';
import { rollDice as diceRollDice } from './dice';
export function createCrapsGame(map, tableState) {
    let betMap = map;
    let pointValue = 0;
    let dice = [3, 4];
    const gameHistory = [];
    if (typeof tableState !== 'undefined') {
        pointValue = tableState.pointValue;
        dice = tableState.dice;
    }
    const rollDice = () => {
        const newRoll = diceRollDice();
        const newState = resolvePointValue(newRoll, pointValue);
        const newResults = resolveBets(betMap, newRoll, pointValue);
        gameHistory.push({
            tableState: newState,
            betResults: newResults,
        });
        betMap = { ...newResults.betMap };
        pointValue = newState.pointValue;
        dice = newRoll;
        return newRoll;
    };
    const makeBet = (betKey, bet) => {
        if (!isValidBet(betMap, betKey, bet, pointValue))
            return;
        const newBets = resolveMakeBet(betMap, betKey, bet);
        betMap = { ...newBets };
    };
    const turnOffBets = (betKeys) => {
        let newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap = {
                    ...newBetMap,
                    [key]: {
                        ...newBetMap[key],
                        off: true,
                    },
                };
            }
        });
    };
    const turnOnBets = (betKeys) => {
        let newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap = {
                    ...newBetMap,
                    [key]: {
                        ...newBetMap[key],
                        off: false,
                    },
                };
            }
        });
    };
    const betsWorking = (betKeys) => {
        let newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap = {
                    ...newBetMap,
                    [key]: {
                        ...newBetMap[key],
                        working: true,
                    },
                };
            }
        });
    };
    const betsNotWorking = (betKeys) => {
        let newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap = {
                    ...newBetMap,
                    [key]: {
                        ...newBetMap[key],
                        working: false,
                    },
                };
            }
        });
    };
    const getBets = () => {
        return { ...betMap };
    };
    const getGameHistory = () => {
        return [...gameHistory];
    };
    const getDice = () => {
        return [...dice];
    };
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
    };
}
//# sourceMappingURL=CrapsGame.js.map