import { DiceRoll } from './dice';
import { IBetResolves } from './bets';
export declare const placeBetOdds: {
    [key: number]: number;
};
export declare const buyBetOdds: {
    [key: number]: number;
};
export declare const layBetOdds: {
    [key: number]: number;
};
export declare const lineBetOdds: {
    [key: number]: number;
};
export declare const dontLineBetOdds: {
    [key: number]: number;
};
export declare const hornBetPayouts: {
    [key: number]: number;
};
export declare const passLineBet: () => IBetResolves[];
export declare const passLinePoint: (pointValue: number) => IBetResolves[];
export declare const dontPassLineBet: () => IBetResolves[];
export declare const dontPassLinePoint: (pointValue: number) => IBetResolves[];
export declare const centerFieldBet: () => IBetResolves[];
export declare const centerAnyCrapsBet: () => IBetResolves[];
export declare const centerHard6Bet: () => IBetResolves[];
export declare const centerHard8Bet: () => IBetResolves[];
export declare const centerHard4Bet: () => IBetResolves[];
export declare const centerHard10Bet: () => IBetResolves[];
export declare const numbersPlace: (value: number) => IBetResolves[];
export declare const numbersBuy: (value: number) => IBetResolves[];
export declare const numbersLay: (value: number) => IBetResolves[];
export declare const centerHorn: (value: number) => IBetResolves[];
export declare const centerHop: (diceRoll: DiceRoll) => IBetResolves[];
export declare const betResolvesMap: {
    [key: string]: IBetResolves[];
};
