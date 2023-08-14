import { DiceRoll } from './dice';
import { IBaseBet, IBetMap } from './bets';
export type TableState = {
    pointValue: number;
    dice: DiceRoll;
    sevenOut: boolean;
    pointHit: boolean;
};
export declare const resolveMakeBet: (betMap: Partial<IBetMap>, betKey: keyof IBetMap, bet: Partial<IBaseBet>) => Partial<IBetMap>;
export interface BetResults {
    betMap: Partial<IBetMap>;
    payouts: Partial<IBetMap>;
}
export declare const resolveBets: (betMap: Partial<IBetMap>, roll: DiceRoll, pointValue: number) => BetResults;
export declare const resolvePointValue: (roll: DiceRoll, pointValue: number) => TableState;
