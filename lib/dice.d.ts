export type Dice6 = 1 | 2 | 3 | 4 | 5 | 6;
export type DiceRoll = [Dice6, Dice6];
export declare const validPoints: number[];
export declare const diceValues: {
    [roll: number]: DiceRoll[];
};
export declare const rollDice: () => DiceRoll;
export declare const sortRollValues: (diceRoll: DiceRoll) => DiceRoll;
export declare const getRollValue: (roll: DiceRoll) => number;
export declare const isValidPoint: (roll: DiceRoll, points?: number[]) => boolean;
export declare const getRolls: (rollValues: number[], excluded?: DiceRoll[]) => DiceRoll[];
