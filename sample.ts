// import { IBetMap, resolveBets, resolvePointValue, rollDice } from './src'
// const roll = rollDice()
// let betMap: IBetMap = {
//   linePassLine: {
//     odds: 0,
//     amount: 10,
//     working: false,
//     vig: 0,
//   },
// }
// let pointValue: number = 0
// let payout = []
// const diceResults = resolvePointValue(roll, pointValue)
// const betResults = resolveBets(betMap, roll, pointValue)

// pointValue = diceResults.newPointValue
// betMap = { ...betResults.betMap }
// payout = [...betResults.payouts]
// console.log(roll, betMap, payout)

import { centerHop } from './src'
console.log('centerhop', centerHop([2, 3]))
