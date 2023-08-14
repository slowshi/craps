import { IBaseBet, IBetMap } from './bets';
import { BetResults, TableState } from './game';
import { DiceRoll } from './dice';
export type GameState = {
    tableState: TableState;
    betResults: BetResults;
};
export type CrapsGameInstance = {
    rollDice: () => DiceRoll;
    makeBet: (betKey: keyof IBetMap, bet: IBaseBet) => void;
    turnOffBets: (betKeys: (keyof IBetMap)[]) => void;
    turnOnBets: (betKeys: (keyof IBetMap)[]) => void;
    betsWorking: (betKeys: (keyof IBetMap)[]) => void;
    betsNotWorking: (betKeys: (keyof IBetMap)[]) => void;
    getBets: () => Partial<IBetMap>;
    getGameHistory: () => GameState[];
    getDice: () => DiceRoll;
};
export declare function createCrapsGame(map: Partial<IBetMap>, tableState?: TableState): CrapsGameInstance;
