import { DiceRoll } from './dice';
import { IBaseBet, IBetMap } from './bets';
export type GameState = {
    pointValue: number;
    dice: DiceRoll;
};
export declare const resolveMakeBet: (betMap: Partial<IBetMap>, betKey: keyof IBetMap, bet: Partial<IBaseBet>) => Partial<IBetMap>;
export interface BetResults {
    betMap: Partial<IBetMap>;
    payouts: IBaseBet[];
}
export declare const resolveBets: (betMap: Partial<IBetMap>, roll: DiceRoll, pointValue: number) => BetResults;
export declare const resolvePointValue: (roll: DiceRoll, pointValue: number) => GameState;
