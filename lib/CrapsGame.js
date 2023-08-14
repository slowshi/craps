import { isValidBet } from './bets';
import { resolveBets, resolveMakeBet, resolvePointValue } from './game';
import { rollDice } from './dice';
export function CrapsGame(map, tableState) {
    let betMap = map;
    let pointValue = 0;
    let dice = [3, 4];
    const gameHistory = [];
    if (typeof tableState !== 'undefined') {
        pointValue = tableState.pointValue;
        dice = tableState.dice;
    }
    this.rollDice = () => {
        const newRoll = rollDice();
        const newState = resolvePointValue(newRoll, pointValue);
        const newResults = resolveBets(betMap, newRoll, pointValue);
        gameHistory.push({
            tableState: newState,
            betResults: newResults,
        });
        betMap = { ...newResults.betMap };
        pointValue = newState.pointValue;
        dice = newRoll;
        return newState;
    };
    this.makeBet = (betKey, bet) => {
        if (!isValidBet(betMap, betKey, bet, pointValue))
            return;
        const newBets = resolveMakeBet(betMap, betKey, bet);
        betMap = { ...newBets };
    };
    this.turnOffBets = (betKeys) => {
        const newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap[key].off = false;
            }
        });
    };
    this.turnOnBets = (betKeys) => {
        const newBetMap = { ...betMap };
        betKeys.forEach((key) => {
            if (newBetMap[key]) {
                newBetMap[key].off = true;
            }
        });
    };
    this.getBets = () => {
        return { ...betMap };
    };
    this.getGameHistory = () => {
        return [...gameHistory];
    };
    this.getDice = () => {
        return [...dice];
    };
}
//# sourceMappingURL=CrapsGame.js.map