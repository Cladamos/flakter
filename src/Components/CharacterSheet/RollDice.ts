export function RollDice(): number[] {
  const rolls = []
  for (let i = 0; i < 4; i++) {
    let random = Math.floor(Math.random() * 6) + 1
    if (random === 1 || random === 2) {
      rolls.push(-1)
    }
    if (random === 3 || random === 4) {
      rolls.push(0)
    }
    if (random === 5 || random === 6) {
      rolls.push(1)
    }
  }

  return rolls
}
