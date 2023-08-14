import {createCrapsGame, CrapsGameInstance} from './src'

const newGame:CrapsGameInstance = createCrapsGame({})
newGame.makeBet('numbersPlace5', {
  amount: 10
})
newGame.makeBet('numbersPlace6', {
  amount: 10
})
console.log(newGame.getBets())
let count = 0
while(count < 10) {
  newGame.rollDice()
  count++
}
console.log(newGame.getGameHistory())

